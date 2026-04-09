import { eq } from "drizzle-orm";
import { users } from "~~/server/db/schema";
import type { SessionUser } from "~~/shared/types/auth";

export default defineNitroPlugin(() => {
  sessionHooks.hook("fetch", async (session) => {
    if (!session.user || !session.user.id) {
      return;
    }

    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (!dbUser) {
      session.user = undefined;
      return;
    }

    // Enrich the session user with the latest data from the database
    const user = session.user as SessionUser;
    user.id = dbUser.id;
    user.name = dbUser.name;
    user.email = dbUser.email;
    user.role = dbUser.role;
  });
});
