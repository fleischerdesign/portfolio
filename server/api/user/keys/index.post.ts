import { z } from "zod"
import { apiKeys } from "~~/server/db/schema";

const RequestBodySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long.'),
});

export default defineEventHandler(async (event) => {
  await authorize(event, canManageApiKeys);

  const session = await requireUserSession(event);
  const user = session.user;

  const body = await readValidatedBody(event, (body) => RequestBodySchema.safeParse(body));

  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: body.error.flatten(),
    });
  }

  const newApiKey = generateApiKey();
  const hashedKey = hashApiKey(newApiKey);

  await db.insert(apiKeys).values({
    name: body.data.name,
    keyHash: hashedKey,
    userId: user.id,
  });

  return {
    message: 'API key created successfully. Save this key somewhere safe. You will not be able to see it again.',
    apiKey: newApiKey,
  };
});
