import { z } from "zod"
import { apiKeys } from "~~/server/db/schema";

const RequestBodySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long.'),
});

export default defineEventHandler(async (event) => {
  // Authorization check first
  await authorize(event, canManageApiKeys); // Added authorization check

  const session = await requireUserSession(event);
  const user = session.user;

  // No need for explicit if (!user?.id) check here, as authorize() covers it for 'canManageApiKeys'
  // and requireUserSession() would also throw a 401 if no valid session.

  const body = await readValidatedBody(event, (body) => RequestBodySchema.safeParse(body));

  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: body.error.flatten(),
    });
  }

  // Generate the new key
  const newApiKey = generateApiKey();
  const hashedKey = hashApiKey(newApiKey); // No await needed for SHA256

  // Store the hashed key in the database
  await db.insert(apiKeys).values({
    name: body.data.name,
    keyHash: hashedKey,
    userId: user.id, // Use user.id from the session
  });

  // Return the plaintext key to the user ONCE.
  return {
    message: 'API key created successfully. Save this key somewhere safe. You will not be able to see it again.',
    apiKey: newApiKey,
  };
});
