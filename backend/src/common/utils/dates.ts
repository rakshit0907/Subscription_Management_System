import { BillingPeriod } from '@prisma/client';

/** Billing dates are date-only values normalised to UTC midnight. */
export function startOfDayUTC(d: Date = new Date()): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

export function addDays(d: Date, days: number): Date {
  const r = new Date(d.getTime());
  r.setUTCDate(r.getUTCDate() + days);
  return r;
}

/** Adds months and clamps to the last day (Jan 31 + 1 month = Feb 28/29). */
export function addMonthsClamped(d: Date, months: number): Date {
  const target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + months, 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(d.getUTCDate(), lastDay));
  return target;
}

/** Moves a date forward by `count` billing periods. */
export function addPeriod(d: Date, period: BillingPeriod, count = 1): Date {
  const base = startOfDayUTC(d);
  switch (period) {
    case 'DAILY':
      return addDays(base, count);
    case 'WEEKLY':
      return addDays(base, 7 * count);
    case 'MONTHLY':
      return addMonthsClamped(base, count);
    case 'YEARLY':
      return addMonthsClamped(base, 12 * count);
  }
}

/** Last day covered by a period that starts on `start` (start + one period - 1 day). */
export function periodEnd(start: Date, period: BillingPeriod): Date {
  return addDays(addPeriod(start, period), -1);
}
