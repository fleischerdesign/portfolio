import { contactCreateSchema } from "#shared/schemas/contact.schema";
import { contacts } from "~~/server/db/schema";

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const body = await readValidatedBody(event, (body) => contactCreateSchema.safeParse(body));

  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: body.error.flatten(),
    });
  }
  
  const [newContact] = await db.insert(contacts).values(body.data).returning();

  return newContact;
});
