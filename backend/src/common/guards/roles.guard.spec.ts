
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { RolesGuard } from './roles.guard';
import { ROLES_KEY } from '../decorators/roles.decorator';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: { getAllAndOverride: jest.Mock };

  const createContext = (user?: { role: Role }) =>
    ({
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    }) as unknown as ExecutionContext;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    };

    guard = new RolesGuard(reflector as unknown as Reflector);
  });

  it('should allow ADMIN when ADMIN role is required', () => {
    reflector.getAllAndOverride.mockReturnValue([Role.ADMIN]);

    const context = createContext({ role: Role.ADMIN });

    expect(guard.canActivate(context)).toBe(true);
    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
  });

  it('should deny STAFF when ADMIN role is required', () => {
    reflector.getAllAndOverride.mockReturnValue([Role.ADMIN]);

    const context = createContext({ role: Role.STAFF });

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should deny CUSTOMER when ADMIN role is required', () => {
    reflector.getAllAndOverride.mockReturnValue([Role.ADMIN]);

    const context = createContext({ role: Role.CUSTOMER });

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should deny access when no user is authenticated', () => {
    reflector.getAllAndOverride.mockReturnValue([Role.ADMIN]);

    const context = createContext();

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should allow access when no roles are specified', () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);

    const context = createContext();

    expect(guard.canActivate(context)).toBe(true);
  });
});
