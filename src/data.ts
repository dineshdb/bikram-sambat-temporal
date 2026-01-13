import bsDataRaw from "./bs.json";

type BsMonthDeviations = number[];

// Decode calendar data from packed format
const [min, max, apr13Base64, monthsBase64] = bsDataRaw as [
  number,
  number,
  string,
  string,
];

// Decode apr13 bitmap (1 bit per year, 1 = year starts on April 13)
const apr13Buffer = Uint8Array.from(atob(apr13Base64), (c) => c.charCodeAt(0));
const apr13: number[] = [];
for (let year = min; year <= max; year++) {
  const offset = year - min;
  const byteIndex = offset >> 3;
  const bitIndex = offset & 7;
  if (apr13Buffer[byteIndex] & (1 << bitIndex)) apr13.push(year);
}

// Decode month deviations (2 bits per month, values 0-3 map to -1 to +2 days from 30)
const monthsBuffer = Uint8Array.from(
  atob(monthsBase64),
  (c) => c.charCodeAt(0),
);
const months = new Map<number, BsMonthDeviations>();
let bitPos = 0;
for (let year = min; year <= max; year++) {
  const deviations = new Array<number>(12);
  for (let month = 0; month < 12; month++) {
    const byteIndex = bitPos >> 3;
    const bitOffset = bitPos & 7;
    const value = (bitOffset <= 6)
      ? (monthsBuffer[byteIndex] >> bitOffset) & 0b11
      : ((monthsBuffer[byteIndex] >> bitOffset) & 0b11) |
        ((monthsBuffer[byteIndex + 1] << (8 - bitOffset)) & 0b11);
    deviations[month] = value - 1;
    bitPos += 2;
  }
  months.set(year, deviations);
}

export const minYear = min;
export const maxYear = max;

// Data access functions
export function getYearStartDate(bsYear: number): Date | null {
  if (bsYear < minYear || bsYear > maxYear) return null;
  const day = apr13.includes(bsYear) ? 13 : 14;
  return new Date(bsYear - 57, 3, day);
}

export function getDaysInMonth(bsYear: number, bsMonth: number): number {
  if (bsMonth < 1 || bsMonth > 12) {
    throw new Error(`Invalid BS month: ${bsMonth}`);
  }
  const deviations = months.get(bsYear);
  if (!deviations) return 30;
  return 30 + (deviations[bsMonth - 1] ?? 0);
}
