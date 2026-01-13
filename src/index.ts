/**
 * Bikram Sambat Calendar Library
 *
 * A TypeScript library for working with the Bikram Sambat (Nepali) calendar system.
 * Provides a Temporal.Calendar-like API for comprehensive date operations.
 *
 * @example
 * ```ts
 * import { bsCalendar } from 'bikram-sambat-temporal';
 *
 * // Convert ISO date to BS
 * const bs = bsCalendar.yearMonthDayFromIso(2025, 1, 13);
 * console.log(bs); // { year: 2081, month: 9, day: 29 }
 *
 * // Convert BS to ISO
 * const iso = bsCalendar.isoFromYearMonthDay(2081, 9, 29);
 * console.log(iso); // { isoYear: 2025, isoMonth: 1, isoDay: 13 }
 * ```
 */

// Main calendar class and instance
export {
  BikramSambatCalendar,
  BS_MONTH_CODES,
  bsCalendar,
  type BsInternalDate,
} from "./calendar.js";

// Data access functions and constants
export { getDaysInMonth, getYearStartDate, maxYear, minYear } from "./data.js";
