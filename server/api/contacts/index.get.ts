import { contactService } from '~~/server/services/contact.service';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);
  
  const query = getQuery(event);
  const companyId = query.companyId ? Number(query.companyId) : undefined;
  const limit = query.limit ? parseInt(query.limit as string) : undefined;

  return await contactService.getAll({ companyId, limit });
});