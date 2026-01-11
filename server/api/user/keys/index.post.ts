import { z } from "zod"
import { userService } from "~~/server/services/user.service";

const RequestBodySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long.'),
});

export default defineEventHandler(async (event) => {
  await authorize(event, canManageApiKeys);

  const session = await requireUserSession(event);
  const user = session.user;

  const body = await readValidatedBody(event, RequestBodySchema.parse);

  return await userService.createApiKey(user.id, body.name);
});
