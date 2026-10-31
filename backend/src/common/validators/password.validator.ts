import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

/** Rule: more than 8 chars (min 9), >=1 uppercase, >=1 lowercase, >=1 special character. */
export const PASSWORD_MIN_LENGTH = 9;

/** Pure function so the rule can be unit-tested and mirrored exactly in the frontend Zod schema. */
export function getPasswordErrors(password: unknown): string[] {
  if (typeof password !== 'string') return ['Password is required'];
  const errors: string[] = [];
  if (password.length < PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be more than 8 characters (minimum ${PASSWORD_MIN_LENGTH})`);
  }
  if (!/[A-Z]/.test(password)) errors.push('Password must contain at least one uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('Password must contain at least one lowercase letter');
  if (!/[^A-Za-z0-9\s]/.test(password)) errors.push('Password must contain at least one special character');
  return errors;
}

@ValidatorConstraint({ name: 'strongPassword', async: false })
export class StrongPasswordConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return getPasswordErrors(value).length === 0;
  }
  defaultMessage(args: ValidationArguments): string {
    return getPasswordErrors(args.value).join('. ');
  }
}

export function IsStrongPassword(options?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      constraints: [],
      validator: StrongPasswordConstraint,
    });
  };
}
