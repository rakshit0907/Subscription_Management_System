import { getPasswordErrors } from './password.validator';

describe('password validator', () => {
  it('accepts a password that satisfies every rule', () => {
    expect(getPasswordErrors('Admin@12345')).toEqual([]);
    expect(getPasswordErrors('Abcdefg#h')).toEqual([]); // exactly 9 chars
  });

  it('rejects 8 characters or fewer', () => {
    const errors = getPasswordErrors('Abcdef#1');
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/more than 8/);
  });

  it('requires an uppercase letter', () => {
    expect(getPasswordErrors('lowercase@123')).toEqual(['Password must contain at least one uppercase letter']);
  });

  it('requires a lowercase letter', () => {
    expect(getPasswordErrors('UPPERCASE@123')).toEqual(['Password must contain at least one lowercase letter']);
  });

  it('requires a special character (spaces and digits do not count)', () => {
    expect(getPasswordErrors('NoSpecial123')).toEqual(['Password must contain at least one special character']);
    expect(getPasswordErrors('Has Space 123')).toEqual(['Password must contain at least one special character']);
  });

  it('reports multiple problems at once', () => {
    expect(getPasswordErrors('abc').length).toBe(3);
  });

  it('rejects non-string input', () => {
    expect(getPasswordErrors(undefined)).toEqual(['Password is required']);
  });
});
