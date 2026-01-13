import { getDaysInMonth, getYearStartDate, maxYear, minYear } from "./data.js";

export type BsInternalDate = {
  isoYear: number;
  isoMonth: number;
  isoDay: number;
};

export const BS_MONTH_CODES = [
  "M01",
  "M02",
  "M03",
  "M04",
  "M05",
  "M06",
  "M07",
  "M08",
  "M09",
  "M10",
  "M11",
  "M12",
] as const;

/**
 * Bikram Sambat calendar implementation following the Temporal.Calendar API pattern.
 * Provides comprehensive date operations for the Nepali Bikram Sambat calendar system.
 */
export class BikramSambatCalendar {
  readonly id = "bikram-sambat";

  /**
   * Convert ISO (Gregorian) date to Bikram Sambat date.
   */
  yearMonthDayFromIso(
    isoYear: number,
    isoMonth: number,
    isoDay: number,
  ): { year: number; month: number; day: number } {
    const targetDate = new Date(isoYear, isoMonth - 1, isoDay);
    const targetTime = targetDate.getTime();
    let bsYear = isoYear + 56;
    if (targetDate >= new Date(isoYear, 3, 14)) bsYear = isoYear + 57;

    for (const candidateBsYear of [bsYear, bsYear - 1, bsYear + 1]) {
      if (
        candidateBsYear < minYear ||
        candidateBsYear > maxYear
      ) continue;
      const startDate = getYearStartDate(candidateBsYear);
      if (!startDate) continue;
      const startTime = startDate.getTime();
      if (targetTime >= startTime) {
        const nextBsYear = candidateBsYear + 1;
        if (nextBsYear > maxYear) {
          return this._calcBsDate(targetTime, candidateBsYear);
        }
        const nextStartDate = getYearStartDate(nextBsYear);
        if (!nextStartDate || targetTime < nextStartDate.getTime()) {
          return this._calcBsDate(targetTime, candidateBsYear);
        }
      }
    }
    throw new Error(
      `Date ${isoYear}-${isoMonth}-${isoDay} is before the supported range`,
    );
  }

  private _calcBsDate(
    targetTime: number,
    bsYear: number,
  ): { year: number; month: number; day: number } {
    const startDate = getYearStartDate(bsYear);
    if (!startDate) {
      throw new Error(`No start date found for BS year ${bsYear}`);
    }
    const diffDays = Math.floor(
      (targetTime - startDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    let bsMonth = 1, bsDay = 1 + diffDays;
    while (bsDay > getDaysInMonth(bsYear, bsMonth)) {
      bsDay -= getDaysInMonth(bsYear, bsMonth);
      bsMonth++;
      if (bsMonth > 12) {
        bsMonth = 1;
        bsYear++;
      }
    }
    return { year: bsYear, month: bsMonth, day: bsDay };
  }

  /**
   * Convert Bikram Sambat date to ISO (Gregorian) date.
   */
  isoFromYearMonthDay(
    year: number,
    month: number,
    day: number,
  ): BsInternalDate | null {
    try {
      const startDate = getYearStartDate(year);
      if (!startDate) {
        throw new Error(`No start date found for BS year ${year}`);
      }
      let daysOffset = day - 1;
      for (let m = 1; m < month; m++) daysOffset += getDaysInMonth(year, m);
      const resultDate = new Date(startDate);
      resultDate.setDate(resultDate.getDate() + daysOffset);
      return {
        isoYear: resultDate.getFullYear(),
        isoMonth: resultDate.getMonth() + 1,
        isoDay: resultDate.getDate(),
      };
    } catch {
      return null;
    }
  }

  monthCode(month: number): string {
    if (month < 1 || month > 12) {
      throw new RangeError(`Invalid month: ${month}`);
    }
    return BS_MONTH_CODES[month - 1];
  }

  monthFromMonthCode(monthCode: string): number {
    const index = BS_MONTH_CODES.indexOf(monthCode as any);
    if (index === -1) throw new RangeError(`Invalid monthCode: ${monthCode}`);
    return index + 1;
  }

  daysInMonth(year: number, month: number): number {
    return getDaysInMonth(year, month);
  }

  daysInYear(year: number): number {
    let total = 0;
    for (let m = 1; m <= 12; m++) total += getDaysInMonth(year, m);
    return total;
  }

  monthsInYear(): number {
    return 12;
  }

  inLeapYear(bsYear: number): boolean {
    const d = getYearStartDate(bsYear);
    return d
      ? ((d.getFullYear() % 4 === 0 && d.getFullYear() % 100 !== 0) ||
        d.getFullYear() % 400 === 0)
      : false;
  }

  era(): string {
    return "bs";
  }

  eraYear(year: number): number {
    return year;
  }

  dayOfWeek(bsYear: number, bsMonth: number, bsDay: number): number {
    const iso = this.isoFromYearMonthDay(bsYear, bsMonth, bsDay);
    return iso
      ? new Date(iso.isoYear, iso.isoMonth - 1, iso.isoDay).getDay()
      : 0;
  }

  dayOfYear(bsYear: number, bsMonth: number, bsDay: number): number {
    let dayCount = bsDay;
    for (let m = 1; m < bsMonth; m++) dayCount += getDaysInMonth(bsYear, m);
    return dayCount;
  }

  weekOfYear(bsYear: number, bsMonth: number, bsDay: number): number {
    return Math.ceil(
      (this.dayOfYear(bsYear, bsMonth, bsDay) -
        this.dayOfWeek(bsYear, bsMonth, bsDay) + 10) / 7,
    );
  }

  addYears(
    bsYear: number,
    bsMonth: number,
    bsDay: number,
    years: number,
  ): { year: number; month: number; day: number } {
    const newYear = bsYear + years;
    return {
      year: newYear,
      month: bsMonth,
      day: Math.min(bsDay, getDaysInMonth(newYear, bsMonth)),
    };
  }

  addMonths(
    bsYear: number,
    bsMonth: number,
    bsDay: number,
    months: number,
  ): { year: number; month: number; day: number } {
    let totalMonths = (bsYear * 12) + (bsMonth - 1) + months;
    let newYear = Math.floor(totalMonths / 12);
    let newMonth = totalMonths % 12;
    if (newMonth < 0) {
      newMonth += 12;
      newYear--;
    }
    newMonth++;
    return {
      year: newYear,
      month: newMonth,
      day: Math.min(bsDay, getDaysInMonth(newYear, newMonth)),
    };
  }

  addDays(
    bsYear: number,
    bsMonth: number,
    bsDay: number,
    days: number,
  ): { year: number; month: number; day: number } {
    const iso = this.isoFromYearMonthDay(bsYear, bsMonth, bsDay);
    if (!iso) return { year: bsYear, month: bsMonth, day: bsDay };
    const isoDate = new Date(iso.isoYear, iso.isoMonth - 1, iso.isoDay);
    isoDate.setDate(isoDate.getDate() + days);
    return this.yearMonthDayFromIso(
      isoDate.getFullYear(),
      isoDate.getMonth() + 1,
      isoDate.getDate(),
    );
  }

  compare(
    aYear: number,
    aMonth: number,
    aDay: number,
    bYear: number,
    bMonth: number,
    bDay: number,
  ): number {
    if (aYear !== bYear) return aYear - bYear;
    if (aMonth !== bMonth) return aMonth - bMonth;
    return aDay - bDay;
  }

  isValid(bsYear: number, bsMonth: number, bsDay: number): boolean {
    if (
      bsYear < minYear || bsYear > maxYear ||
      bsMonth < 1 || bsMonth > 12
    ) return false;
    return bsDay >= 1 && bsDay <= getDaysInMonth(bsYear, bsMonth);
  }

  fields(isoYear: number, isoMonth: number, isoDay: number): {
    year: number;
    month: number;
    day: number;
    monthCode: string;
    dayOfWeek: number;
    dayOfYear: number;
    weekOfYear: number;
    daysInMonth: number;
    daysInYear: number;
    inLeapYear: boolean;
  } {
    const bs = this.yearMonthDayFromIso(isoYear, isoMonth, isoDay);
    return {
      year: bs.year,
      month: bs.month,
      day: bs.day,
      monthCode: this.monthCode(bs.month),
      dayOfWeek: this.dayOfWeek(bs.year, bs.month, bs.day),
      dayOfYear: this.dayOfYear(bs.year, bs.month, bs.day),
      weekOfYear: this.weekOfYear(bs.year, bs.month, bs.day),
      daysInMonth: this.daysInMonth(bs.year, bs.month),
      daysInYear: this.daysInYear(bs.year),
      inLeapYear: this.inLeapYear(bs.year),
    };
  }
}

/**
 * Default Bikram Sambat calendar instance.
 */
export const bsCalendar = new BikramSambatCalendar();

// Re-export data module
export * from "./data.js";
