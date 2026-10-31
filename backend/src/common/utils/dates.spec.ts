import { addPeriod, periodEnd, startOfDayUTC } from './dates';

const d = (s: string) => new Date(`${s}T00:00:00.000Z`);

describe('dates', () => {
  it('adds daily and weekly periods', () => {
    expect(addPeriod(d('2026-01-01'), 'DAILY')).toEqual(d('2026-01-02'));
    expect(addPeriod(d('2026-01-01'), 'WEEKLY')).toEqual(d('2026-01-08'));
  });

  it('clamps month-end for monthly periods', () => {
    expect(addPeriod(d('2026-01-31'), 'MONTHLY')).toEqual(d('2026-02-28'));
    expect(addPeriod(d('2028-01-31'), 'MONTHLY')).toEqual(d('2028-02-29'));
  });

  it('adds a year and handles leap day', () => {
    expect(addPeriod(d('2026-03-15'), 'YEARLY')).toEqual(d('2027-03-15'));
    expect(addPeriod(d('2028-02-29'), 'YEARLY')).toEqual(d('2029-02-28'));
  });

  it('period end is start + one period - 1 day', () => {
    expect(periodEnd(d('2026-01-01'), 'MONTHLY')).toEqual(d('2026-01-31'));
    expect(periodEnd(d('2026-01-01'), 'DAILY')).toEqual(d('2026-01-01'));
  });

  it('normalises to UTC midnight', () => {
    expect(startOfDayUTC(new Date('2026-05-05T17:45:00Z'))).toEqual(d('2026-05-05'));
  });
});
