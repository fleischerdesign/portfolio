import { eq } from 'drizzle-orm';
import { users } from '~~/server/db/schema';
import type { SessionUser } from '#shared/schemas/user.schema';

export default defineNitroPlugin(() => {
  sessionHooks.hook('fetch', async (session) => {
    // If there's no user in the session object, there's nothing to do.
    if (!session.user || !session.user.id) {
      return;
    }

    // Fetch the fresh, full user from the database using the ID from the session.
    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    // If the user for some reason doesn't exist in the DB anymore, clear the session.
    if (!dbUser) {
      session.user = undefined;
      return;
    }

    // Enrich the session's user object with the latest data from the database.
    // This ensures the client-side `useUserSession` composable will have the fresh role.
    // We need to explicitly cast session.user to SessionUser because by default it's type User
    // which might not have 'role' unless augmented.
    (session.user as SessionUser).id = dbUser.id;
    (session.user as SessionUser).name = dbUser.name;
    (session.user as SessionUser).email = dbUser.email;
    (session.user as SessionUser).role = dbUser.role;
  });
});