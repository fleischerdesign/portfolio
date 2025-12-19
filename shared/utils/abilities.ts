import type { SessionUser } from '#shared/schemas/user.schema';

export const isAdmin = defineAbility((user: SessionUser) => {
  return user?.email === 'philipp@fleischer.design';
});
