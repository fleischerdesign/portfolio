import { apiKeys, users } from '~~/server/db/schema';
import { eq } from 'drizzle-orm';
import { getHeader } from 'h3';

export default defineNitroPlugin((nitroApp) => {

  nitroApp.hooks.hook('request', async (event) => {

    event.context.$authorization = {
      resolveServerUser: async () => {

        const session = await getUserSession(event);


        if (session.user && session.user.id) {
          const user = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
          });


          if (user) {
            return user;
          }
        }

        const apiKeyHeader = getHeader(event, 'x-api-key');
        if (apiKeyHeader) {
          const config = useRuntimeConfig();
          if (config.masterApiKey && apiKeyHeader === config.masterApiKey) {
            return { id: -1, role: 'admin', email: 'master@system.local', name: 'Master Key User' };
          }

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
        return null;
      },
    };
  });
});