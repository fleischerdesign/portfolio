import { contactService } from '~~/server/services/contact.service';
import { contactCreateSchema } from "#shared/schemas/contact.schema";

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  const data = await readValidatedBody(event, contactCreateSchema.parse);
  
  return await contactService.create(data);
});
