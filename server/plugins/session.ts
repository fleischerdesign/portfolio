import { eq } from 'drizzle-orm';
import { users } from '~~/server/db/schema';
import type { SessionUser } from '#shared/schemas/user.schema';

export default defineNitroPlugin(() => { // <--- Added defineNitroPlugin wrapper
  /**
   * This hook is called by nuxt-auth-utils when the session is fetched for the client.
   * It's the perfect place to enrich the session data with fresh information from the database,
   * ensuring the client-side has up-to-date user roles without storing them permanently in the cookie
   * for extended periods. This solves the "stale data" problem.
   */
  sessionHooks.hook('fetch', async (session) => {
    // If there's no user in the session object, there's nothing to do.
    // This could happen if the user is a guest or session is being cleared.
    if (!session.user || !session.user.id) {
      return;
    }

    // Fetch the fresh, full user from the database using the ID from the session.
    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    // If the user for some reason doesn't exist in the DB anymore, clear the session.
    if (!dbUser) {
      session.user = undefined; // Assign undefined as per type requirement
      return;
    }

    // Enrich the session's user object with the latest data from the database.
    // This ensures the client-side `useUserSession` composable will have the fresh role.
    // We need to explicitly cast session.user to SessionUser because by default it's type User
    // which might not have 'role' unless augmented.
    (session.user as SessionUser).id = dbUser.id; // Should be the same
    (session.user as SessionUser).name = dbUser.name;
    (session.user as SessionUser).email = dbUser.email;
    (session.user as SessionUser).role = dbUser.role; // This is the crucial part
  });
});