
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
    let guard: JwtAuthGuard;
    let reflector: { getAllAndOverride: jest.Mock };

    const createContext = () =>
        ({
            getHandler: jest.fn(),
            getClass: jest.fn(),
        }) as unknown as ExecutionContext;

    beforeEach(() => {
        reflector = {
            getAllAndOverride: jest.fn(),
        };

        guard = new JwtAuthGuard(reflector as unknown as Reflector);
    });

    it('should allow public routes without authentication', () => {
        reflector.getAllAndOverride.mockReturnValue(true);

        const context = createContext();

        expect(guard.canActivate(context)).toBe(true);
    });

    it('should call JWT authentication for protected routes', async () => {
        reflector.getAllAndOverride.mockReturnValue(false);

        const context = createContext();
        const passportResult = Promise.resolve(true);

        const superCanActivate = jest
            .spyOn(Object.getPrototypeOf(JwtAuthGuard.prototype), 'canActivate')
            .mockReturnValue(passportResult);

        await expect(guard.canActivate(context)).resolves.toBe(true);
        expect(superCanActivate).toHaveBeenCalledWith(context);

        superCanActivate.mockRestore();
    });

    it('should reject when authentication fails', () => {
        expect(() =>
            guard.handleRequest(new Error('Invalid token'), false),
        ).toThrow(UnauthorizedException);
    });

    it('should reject when no user is returned', () => {
        expect(() => guard.handleRequest(null, false)).toThrow(
            UnauthorizedException,
        );
    });

    it('should return the authenticated user', () => {
        const user = { id: 'user-1', role: 'ADMIN' };

        expect(guard.handleRequest(null, user)).toBe(user);
    });
});
