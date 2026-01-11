import { contactService } from '~~/server/services/contact.service';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);
  
  const query = getQuery(event);
  const companyId = query.companyId ? Number(query.companyId) : undefined;
  
  // Reuse studio query schema for limit validation
  const { limit } = await getStudioQuery(event);

  const contacts = await contactService.getAll({ companyId, limit });

  return { contacts };
});