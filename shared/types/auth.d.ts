import type { DbUser } from "../schemas/user.schema";

/** Session user is a partial DbUser — enriched by the session hook on each request. */
type SessionUser = Pick<DbUser, "id" | "email" | "name" | "role">;

declare module "#auth-utils" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface User extends SessionUser {}
}

export type { SessionUser };
