import type { DbUser } from '#shared/schemas/user.schema';

export const isAdmin = defineAbility((user: DbUser | null) => {
  return user?.role === 'admin';
});

export const canManageApiKeys = defineAbility((user: DbUser | null) => {
  return !!user?.id; // True if user is logged in (has an ID)
});

