
/** Fails fast at boot when required environment variables are missing. */
export function validateEnv(config: Record<string, unknown>): Record<string, unknown> {
  const required = ['DATABASE_URL', 'JWT_SECRET'];
  const missing = required.filter((k) => !config[k]);

  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  if (String(config.JWT_SECRET).length < 16) {
    throw new Error('JWT_SECRET must be at least 16 characters long');
  }

  const parsePositiveInteger = (key: string, defaultValue: number): number => {
    const raw = config[key];

    if (raw === undefined || raw === null || raw === '') {
      return defaultValue;
    }

    const value = Number(raw);

    if (!Number.isSafeInteger(value) || value <= 0) {
      throw new Error(`${key} must be a positive integer`);
    }

    return value;
  };

  return {
    ...config,
    AUTH_RATE_LIMIT: parsePositiveInteger('AUTH_RATE_LIMIT', 5),
    AUTH_RATE_LIMIT_TTL_MS: parsePositiveInteger('AUTH_RATE_LIMIT_TTL_MS', 60000),
  };
}
