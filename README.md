# Bikram Sambat Temporal

A TypeScript library for working with the Bikram Sambat (BS) calendar system
used in Nepal. This library provides a comprehensive API following the
JavaScript Temporal.Calendar pattern for date operations, conversions, and
arithmetic.

## Features

- **ISO (Gregorian) ↔ BS Conversion**: Bidirectional conversion between
  Gregorian and Bikram Sambat dates
- **Date Arithmetic**: Add days, months, and years to BS dates with proper
  month-length handling
- **Calendar Operations**: Day of week, day of year, week of year calculations
- **Validation**: Check if BS dates are valid
- **Temporal.Calendar-like API**: Familiar API pattern matching JavaScript's
  Temporal proposal
- **TypeScript**: Full TypeScript support with types
- **Compact Data**: Efficient bit-packed calendar data for minimal bundle size

## Installation

```bash
npm install bikram-sambat-temporal
```

## Quick Start

```typescript
import { bsCalendar } from "bikram-sambat-temporal";

// Convert ISO (Gregorian) date to BS
const bs = bsCalendar.yearMonthDayFromIso(2025, 1, 13);
console.log(bs); // { year: 2081, month: 9, day: 29 }

// Convert BS to ISO (Gregorian)
const iso = bsCalendar.isoFromYearMonthDay(2081, 9, 29);
console.log(iso); // { isoYear: 2025, isoMonth: 1, isoDay: 13 }

// Get today's date in BS
const today = bsCalendar.fields(2025, 1, 13);
console.log(today);
// {
//   year: 2081,
//   month: 9,
//   day: 29,
//   monthCode: "M09",
//   dayOfWeek: 1,
//   dayOfYear: 274,
//   weekOfYear: 40,
//   daysInMonth: 30,
//   daysInYear: 365,
//   inLeapYear: false
// }
```

## API Reference

### Main Calendar Instance

```typescript
import { bsCalendar } from "bikram-sambat-temporal";
```

The `bsCalendar` instance provides all calendar operations.

### Core Methods

#### Conversion

| Method                                           | Description                   |
| ------------------------------------------------ | ----------------------------- |
| `yearMonthDayFromIso(isoYear, isoMonth, isoDay)` | Convert ISO date to BS        |
| `isoFromYearMonthDay(year, month, day)`          | Convert BS date to ISO        |
| `fields(isoYear, isoMonth, isoDay)`              | Get complete date information |

#### Date Information

| Method                         | Description                        |
| ------------------------------ | ---------------------------------- |
| `daysInMonth(year, month)`     | Get days in a BS month             |
| `daysInYear(year)`             | Get total days in a BS year        |
| `dayOfWeek(year, month, day)`  | Get day of week (0-6)              |
| `dayOfYear(year, month, day)`  | Get day of year                    |
| `weekOfYear(year, month, day)` | Get week of year                   |
| `inLeapYear(year)`             | Check if BS year is leap year      |
| `monthCode(month)`             | Get month code (e.g., "M01")       |
| `monthFromMonthCode(code)`     | Convert month code to month number |

#### Date Arithmetic

| Method                                | Description           |
| ------------------------------------- | --------------------- |
| `addDays(year, month, day, days)`     | Add days to BS date   |
| `addMonths(year, month, day, months)` | Add months to BS date |
| `addYears(year, month, day, years)`   | Add years to BS date  |

#### Validation

| Method                            | Description               |
| --------------------------------- | ------------------------- |
| `isValid(year, month, day)`       | Check if BS date is valid |
| `compare(y1, m1, d1, y2, m2, d2)` | Compare two BS dates      |

### Data Access Functions

```typescript
import {
  getDaysInMonth,
  getYearStartDate,
  maxYear,
  minYear,
} from "bikram-sambat-temporal";
```

| Constant/Function             | Description                         |
| ----------------------------- | ----------------------------------- |
| `minYear`                     | Minimum supported BS year           |
| `maxYear`                     | Maximum supported BS year           |
| `getDaysInMonth(year, month)` | Get days in a BS month              |
| `getYearStartDate(year)`      | Get the AD date when BS year starts |

## Supported Year Range

The library supports BS years from approximately 1975 to 2100

## Examples

### Date Arithmetic

```typescript
import { bsCalendar } from "bikram-sambat-temporal";

// Add 10 days to a BS date
const future = bsCalendar.addDays(2082, 1, 1, 10);
console.log(future); // { year: 2082, month: 1, day: 11 }

// Add 3 months (handles month boundaries)
const result = bsCalendar.addMonths(2082, 11, 15, 3);
console.log(result); // { year: 2083, month: 2, day: 15 }

// Add 5 years
const futureYear = bsCalendar.addYears(2082, 6, 15, 5);
console.log(futureYear); // { year: 2087, month: 6, day: 15 }
```

### Date Validation

```typescript
import { bsCalendar } from "bikram-sambat-temporal";

console.log(bsCalendar.isValid(2082, 1, 1)); // true
console.log(bsCalendar.isValid(2082, 1, 32)); // false (invalid day)
console.log(bsCalendar.isValid(2082, 13, 1)); // false (invalid month)
console.log(bsCalendar.isValid(1800, 1, 1)); // false (out of range)
```

### Date Comparison

```typescript
import { bsCalendar } from "bikram-sambat-temporal";

const cmp = bsCalendar.compare(2082, 1, 1, 2082, 6, 15);
console.log(cmp); // negative (first date is earlier)

console.log(bsCalendar.compare(2082, 6, 15, 2082, 6, 15)); // 0 (equal)
console.log(bsCalendar.compare(2082, 12, 31, 2082, 6, 15)); // positive (first is later)
```

### Month Codes

```typescript
import { BS_MONTH_CODES, bsCalendar } from "bikram-sambat-temporal";

// Get month code
console.log(bsCalendar.monthCode(1)); // "M01"
console.log(bsCalendar.monthCode(12)); // "M12"

// Convert month code back to number
console.log(bsCalendar.monthFromMonthCode("M01")); // 1
console.log(bsCalendar.monthFromMonthCode("M12")); // 12

// All month codes
console.log(BS_MONTH_CODES); // ["M01", "M02", ..., "M12"]
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run dev

# Build the library
npm run build

# Type check
npm run typecheck
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

This library implements the Bikram Sambat calendar system used officially in
Nepal. The calendar data is efficiently packed using bit manipulation to
minimize bundle size while maintaining accuracy.
