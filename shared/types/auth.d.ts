import type { SessionUser } from '../schemas/user.schema';

declare module '#auth-utils' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface User extends SessionUser { }
}