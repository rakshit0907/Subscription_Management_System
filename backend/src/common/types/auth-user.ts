import { Role } from '@prisma/client';

/** Shape attached to `req.user` by the JWT strategy. */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}
