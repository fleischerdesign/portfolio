import type { SessionUser } from '../schemas/user.schema';

declare module '#auth-utils' {
  interface User extends SessionUser {}
}