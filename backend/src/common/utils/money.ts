import { Prisma } from '@prisma/client';

/** All money math uses Decimal (never float). */
export type DecimalInput = Prisma.Decimal | string | number;

export const D = (v: DecimalInput | null | undefined): Prisma.Decimal => new Prisma.Decimal(v ?? 0);

/** Round to 2 decimals, half-up. */
export const round2 = (v: DecimalInput): Prisma.Decimal =>
  D(v).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);

export const sum = (values: DecimalInput[]): Prisma.Decimal =>
  values.reduce<Prisma.Decimal>((a, b) => a.plus(D(b)), D(0));

/** amount * rate / 100, rounded to 2 decimals. */
export const percentOf = (amount: DecimalInput, ratePercent: DecimalInput): Prisma.Decimal =>
  round2(D(amount).mul(D(ratePercent)).div(100));

export const minOf = (a: DecimalInput, b: DecimalInput): Prisma.Decimal => (D(a).lte(D(b)) ? D(a) : D(b));
export const maxOf = (a: DecimalInput, b: DecimalInput): Prisma.Decimal => (D(a).gte(D(b)) ? D(a) : D(b));
