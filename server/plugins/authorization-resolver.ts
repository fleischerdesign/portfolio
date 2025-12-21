import { db } from '../utils/db';
import { apiKeys, users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { getHeader } from 'h3';

// hashApiKey is auto-imported from server/utils/apiKey.ts

export default defineNitroPlugin((nitroApp) => {

  nitroApp.hooks.hook('request', async (event) => {

    event.context.$authorization = {
      resolveServerUser: async () => {

        // 1. Try to get user from session
        const session = await getUserSession(event);


        if (session.user && session.user.id) {
          const user = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
          });


          if (user) {
            return user;
          }
        }

        // 2. If no session user, try to authenticate via API Key
        const apiKeyHeader = getHeader(event, 'x-api-key');
        if (apiKeyHeader) {
          // This is the master key check we discussed.
          const config = useRuntimeConfig();
          if (config.masterApiKey && apiKeyHeader === config.masterApiKey) {
            return { id: -1, role: 'admin', email: 'master@system.local', name: 'Master Key User' };
          }

          // This is the database API key check.
          try {
            const hashedIncomingKey = hashApiKey(apiKeyHeader);
            const apiKeyRecord = await db.query.apiKeys.findFirst({
              where: eq(apiKeys.keyHash, hashedIncomingKey),
            });

            if (apiKeyRecord) {
              const user = await db.query.users.findFirst({
                where: eq(users.id, apiKeyRecord.userId),
              });



              if (user) {
                db.update(apiKeys).set({ lastUsedAt: new Date() }).where(eq(apiKeys.id, apiKeyRecord.id)).execute().catch(console.error);
                return user;
              }
            }
          } catch (error) {
            console.error('Error during API key database validation:', error);
            return null;
          }
        }

        // 3. If neither works, return null (guest)
        return null;
      },
    };
  });
});