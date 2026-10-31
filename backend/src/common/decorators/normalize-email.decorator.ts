import { Transform } from 'class-transformer';

/** Trims and lower-cases an email so uniqueness checks are case-insensitive. */
export const NormalizeEmail = () =>
  Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value));
