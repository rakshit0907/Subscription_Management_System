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
  return config;
}
