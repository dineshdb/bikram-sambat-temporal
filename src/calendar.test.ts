import { describe, expect, it } from "vitest";
import {
  BikramSambatCalendar,
  BS_MONTH_CODES,
  bsCalendar,
} from "./calendar.js";

describe("BikramSambatCalendar", () => {
  describe("calendar identity", () => {
    it("should have correct calendar ID", () => {
      expect(bsCalendar.id).toBe("bikram-sambat");
    });

    it("should return correct era", () => {
      expect(bsCalendar.era()).toBe("bs");
    });

    it("should return correct era year", () => {
      expect(bsCalendar.eraYear(2082)).toBe(2082);
    });

    it("should always have 12 months", () => {
      expect(bsCalendar.monthsInYear()).toBe(12);
    });
  });

  describe("ISO to BS conversion", () => {
    it("should convert BS new year correctly", () => {
      const bs = bsCalendar.yearMonthDayFromIso(2025, 4, 14);
      expect(bs).toEqual({ year: 2082, month: 1, day: 1 });
    });

    it("should convert date before BS new year correctly", () => {
      const bs = bsCalendar.yearMonthDayFromIso(2025, 4, 13);
      expect(bs.year).toBe(2081);
    });

    it("should be reversible", () => {
      const testDates = [
        [2025, 1, 1],
        [2025, 4, 14],
        [2025, 12, 31],
      ];

      for (const [isoYear, isoMonth, isoDay] of testDates) {
        const bs = bsCalendar.yearMonthDayFromIso(isoYear, isoMonth, isoDay);
        const iso = bsCalendar.isoFromYearMonthDay(bs.year, bs.month, bs.day);

        expect(iso).not.toBeNull();
        expect(iso!.isoYear).toBe(isoYear);
        expect(iso!.isoMonth).toBe(isoMonth);
        expect(iso!.isoDay).toBe(isoDay);
      }
    });
  });

  describe("BS to ISO conversion", () => {
    it("should convert BS new year correctly", () => {
      const iso = bsCalendar.isoFromYearMonthDay(2082, 1, 1);
      expect(iso).not.toBeNull();
      expect(iso!.isoYear).toBe(2025);
      expect(iso!.isoMonth).toBe(4);
      expect(iso!.isoDay).toBe(14);
    });

    it("should return null for out of range dates", () => {
      expect(bsCalendar.isoFromYearMonthDay(1800, 1, 1)).toBeNull();
      expect(bsCalendar.isoFromYearMonthDay(2200, 1, 1)).toBeNull();
    });
  });

  describe("date arithmetic", () => {
    it("should add days correctly", () => {
      const result = bsCalendar.addDays(2082, 1, 1, 10);
      expect(result).toEqual({ year: 2082, month: 1, day: 11 });
    });

    it("should add months correctly", () => {
      const result = bsCalendar.addMonths(2082, 1, 15, 3);
      expect(result).toEqual({ year: 2082, month: 4, day: 15 });
    });

    it("should add years correctly", () => {
      const result = bsCalendar.addYears(2082, 6, 15, 5);
      expect(result).toEqual({ year: 2087, month: 6, day: 15 });
    });

    it("should subtract months correctly", () => {
      const result = bsCalendar.addMonths(2082, 6, 15, -3);
      expect(result).toEqual({ year: 2082, month: 3, day: 15 });
    });

    it("should subtract months across year boundary", () => {
      const result = bsCalendar.addMonths(2082, 2, 15, -3);
      expect(result.year).toBe(2081);
      expect(result.month).toBe(11);
    });
  });

  describe("date comparison", () => {
    it("should return negative when first date is earlier", () => {
      const result = bsCalendar.compare(2082, 1, 1, 2082, 6, 15);
      expect(result).toBeLessThan(0);
    });

    it("should return positive when first date is later", () => {
      const result = bsCalendar.compare(2082, 12, 31, 2082, 6, 15);
      expect(result).toBeGreaterThan(0);
    });

    it("should return zero for equal dates", () => {
      const result = bsCalendar.compare(2082, 6, 15, 2082, 6, 15);
      expect(result).toBe(0);
    });
  });

  describe("date validation", () => {
    it("should validate correct dates", () => {
      expect(bsCalendar.isValid(2082, 1, 1)).toBe(true);
      expect(bsCalendar.isValid(2082, 6, 15)).toBe(true);
      expect(bsCalendar.isValid(2082, 12, 30)).toBe(true);
    });

    it("should reject invalid dates", () => {
      expect(bsCalendar.isValid(2082, 1, 0)).toBe(false);
      expect(bsCalendar.isValid(2082, 1, 32)).toBe(false);
      expect(bsCalendar.isValid(2082, 13, 1)).toBe(false);
    });

    it("should reject out of range years", () => {
      expect(bsCalendar.isValid(1800, 1, 1)).toBe(false);
      expect(bsCalendar.isValid(2200, 1, 1)).toBe(false);
    });
  });

  describe("fields", () => {
    it("should return all expected fields", () => {
      const fields = bsCalendar.fields(2025, 4, 14);

      expect(fields).toHaveProperty("year");
      expect(fields).toHaveProperty("month");
      expect(fields).toHaveProperty("day");
      expect(fields).toHaveProperty("monthCode");
      expect(fields).toHaveProperty("dayOfWeek");
      expect(fields).toHaveProperty("dayOfYear");
      expect(fields).toHaveProperty("weekOfYear");
      expect(fields).toHaveProperty("daysInMonth");
      expect(fields).toHaveProperty("daysInYear");
      expect(fields).toHaveProperty("inLeapYear");
    });

    it("should return correct values for known date", () => {
      const fields = bsCalendar.fields(2025, 4, 14);

      expect(fields.year).toBe(2082);
      expect(fields.month).toBe(1);
      expect(fields.day).toBe(1);
      expect(fields.monthCode).toBe("M01");
      expect(fields.dayOfWeek).toBe(1); // Monday
      expect(fields.dayOfYear).toBe(1);
      expect(fields.daysInMonth).toBe(31);
      expect(fields.inLeapYear).toBe(false);
    });
  });

  describe("month codes", () => {
    it("should have correct month codes", () => {
      expect(BS_MONTH_CODES).toHaveLength(12);
      expect(BS_MONTH_CODES[0]).toBe("M01");
      expect(BS_MONTH_CODES[11]).toBe("M12");
    });

    it("should convert month to code and back", () => {
      for (let month = 1; month <= 12; month++) {
        const code = bsCalendar.monthCode(month);
        const back = bsCalendar.monthFromMonthCode(code);
        expect(back).toBe(month);
      }
    });
  });
});
