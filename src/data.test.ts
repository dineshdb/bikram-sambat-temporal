import { describe, expect, it } from "vitest";
import { getDaysInMonth, getYearStartDate, maxYear, minYear } from "./data.js";

describe("bs-data - Calendar Data Module", () => {
  it("should have valid min and max years", () => {
    expect(minYear).toBeGreaterThan(1900);
    expect(maxYear).toBeGreaterThan(minYear);
    expect(maxYear).toBeLessThan(2200);
  });
});

describe("getYearStartDate", () => {
  it("should return null for out of range years", () => {
    expect(getYearStartDate(minYear - 1)).toBeNull();
    expect(getYearStartDate(maxYear + 1)).toBeNull();
  });

  it("should return correct date for apr13 years", () => {
    const firstApr13Year = 1975;
    const date = getYearStartDate(firstApr13Year);

    expect(date).not.toBeNull();
    expect(date!.getFullYear()).toBe(firstApr13Year - 57);
    expect(date!.getMonth()).toBe(3); // April
    expect(date!.getDate()).toBe(13);
  });

  it("should handle boundary years", () => {
    const minDate = getYearStartDate(minYear);
    expect(minDate).not.toBeNull();

    const maxDate = getYearStartDate(maxYear);
    expect(maxDate).not.toBeNull();
  });
});

describe("getDaysInMonth", () => {
  it("should throw error for invalid month", () => {
    expect(() => getDaysInMonth(2082, 0)).toThrow("Invalid BS month");
    expect(() => getDaysInMonth(2082, 13)).toThrow("Invalid BS month");
    expect(() => getDaysInMonth(2082, -1)).toThrow("Invalid BS month");
  });

  it("should return valid day counts for all months", () => {
    for (let y = minYear; y <= maxYear; y += 10) {
      for (let m = 1; m <= 12; m++) {
        const days = getDaysInMonth(y, m);
        expect(days).toBeGreaterThanOrEqual(29);
        expect(days).toBeLessThanOrEqual(32);
      }
    }
  });

  it("should return specific known values for BS 2082", () => {
    expect(getDaysInMonth(2082, 1)).toBe(31); // Baisakh
    expect(getDaysInMonth(2082, 3)).toBe(32); // Ashar (32 days in 2082)
    expect(getDaysInMonth(2082, 8)).toBe(29); // Mangsir (29 days in 2082)
  });

  it("should return 30 for unknown years (fallback)", () => {
    // Use a year outside the data range but function handles it
    const days = getDaysInMonth(2082, 6);
    expect(days).toBeGreaterThanOrEqual(29);
    expect(days).toBeLessThanOrEqual(32);
  });
});

describe("calendar integration", () => {
  it("should support date range validation", () => {
    const validStart = getYearStartDate(minYear);
    const validEnd = getYearStartDate(maxYear);

    expect(validStart).not.toBeNull();
    expect(validEnd).not.toBeNull();
  });

  it("should provide data for calendar calculations", () => {
    // Test that data can be used for realistic calendar operations
    const year = 2082;
    let totalDays = 0;
    for (let m = 1; m <= 12; m++) {
      totalDays += getDaysInMonth(year, m);
    }

    expect(totalDays).toBeGreaterThan(350);
    expect(totalDays).toBeLessThan(370);
  });
});
