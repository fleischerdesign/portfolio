import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { dbUserSchema, type DbUser } from '#shared/schemas/user.schema';

export default defineOAuthAuthentikEventHandler({
  async onSuccess(event, { user: authUser }) {
    const query = getQuery(event);
    const redirectTo = (query.redirect as string) || '/';

    // Use the DbUserSchema to validate the data before processing
    const validatedAuthUser = dbUserSchema.pick({ authProviderId: true, email: true, name: true }).parse({
      authProviderId: authUser.sub,
      email: authUser.email,
      name: authUser.name,
    });

    // Check if user exists
    let user: DbUser | undefined = await db.select().from(users).where(eq(users.authProviderId, validatedAuthUser.authProviderId)).get();

    if (user) {
      // Update user details if they have changed.
      if (user.name !== validatedAuthUser.name || user.email !== validatedAuthUser.email) {
        // Only update fields that are allowed to change
        await db.update(users)
          .set({ name: validatedAuthUser.name, email: validatedAuthUser.email })
          .where(eq(users.id, user.id!));
        // Refresh the user object after update to ensure it's current
        user = await db.select().from(users).where(eq(users.id, user.id!)).get();
      }
    } else {
      // Create new user if they don't exist
      user = await db.insert(users)
        .values({
          authProviderId: validatedAuthUser.authProviderId,
          email: validatedAuthUser.email,
          name: validatedAuthUser.name
        })
        .returning()
        .get();
    }

    // After successful user creation/update, user should always be defined
    if (!user) {
      console.error('Failed to retrieve or create user after Authentik login.');
      return sendRedirect(event, '/login-error');
    }

    // Store our internal user ID and some basic info in the session
    await setUserSession(event, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role, // Add the role to the session
      },
      loggedInAt: new Date()
    });

    return sendRedirect(event, redirectTo);
  },
  onError(event, error) {
    console.error('Authentik OAuth error:', error);
    return sendRedirect(event, '/login-error'); // Redirect to generic error page
  }
});
