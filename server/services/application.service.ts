import { applications, companies, addresses, applicationHistories, applications_to_contacts } from '~~/server/db/schema';
import type { ApplicationResponsePayload, ApplicationCreatePayload, Status } from '~~/shared/schemas/application.schema';
import type { CompanyResponse } from '~~/shared/schemas/company.schema';
import { eq, desc, and, inArray } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

export const applicationService = {
  async getAll(limit?: number): Promise<ApplicationResponsePayload[]> {
    const allApplications = await db.query.applications.findMany({
      limit,
      with: {
        company: {
          with: {
            address: true,
          },
        },
        contacts: {
          with: {
            contact: true,
          },
        },
        histories: true,
      },
    });

    return Promise.all(allApplications.map(async (app) => {
      const latestStatusHistory = app.histories
        .filter(h => h.status !== 'interview')
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
      
      const associatedContacts = app.contacts.map(appToContact => appToContact.contact);

      return {
        ...app,
        currentStatus: latestStatusHistory?.status || 'draft',
        histories: app.histories,
        company: {
          ...app.company,
          address: app.company.address || null,
        } as CompanyResponse,
        contacts: associatedContacts,
      } as unknown as ApplicationResponsePayload;
    }));
  },

  async getBySlug(slug: string): Promise<ApplicationResponsePayload | null> {
    const application = await db.query.applications.findFirst({
      where: eq(applications.slug, slug),
      with: {
        company: {
          with: {
            address: true,
          },
        },
        contacts: {
          with: {
            contact: true,
          },
        },
        histories: {
          orderBy: [desc(applicationHistories.createdAt), desc(applicationHistories.id)],
        },
      },
    });
  
    if (!application) return null;
  
    const currentStatus = application.histories.length > 0 ? application.histories[0]!.status : 'draft';
    const associatedContacts = application.contacts.map(appToContact => appToContact.contact);
  
    return {
      ...application,
      currentStatus,
      company: {
          ...application.company,
          address: application.company.address || null,
      },
      contacts: associatedContacts,
      histories: application.histories,
    } as unknown as ApplicationResponsePayload;
  },

  async addHistory(slug: string, data: { status: Status; notes?: string; scheduled_at?: string }) {
    const application = await db.query.applications.findFirst({ where: eq(applications.slug, slug) });
    if (!application) throw createError({ statusCode: 404, statusMessage: 'Application not found' });

    return await db.insert(applicationHistories).values({
      applicationId: application.id,
      status: data.status,
      notes: data.notes,
      scheduled_at: data.scheduled_at ? new Date(data.scheduled_at) : null,
    }).returning();
  },

  async updateHistory(historyId: number, data: { status?: Status; notes?: string; scheduled_at?: string | null }) {
    return await db.update(applicationHistories)
      .set({
        ...data,
        scheduled_at: data.scheduled_at ? new Date(data.scheduled_at) : (data.scheduled_at === null ? null : undefined),
      })
      .where(eq(applicationHistories.id, historyId))
      .returning();
  },

  async deleteHistory(historyId: number) {
    return await db.delete(applicationHistories).where(eq(applicationHistories.id, historyId));
  },

  async deleteBySlug(slug: string) {
    const application = await db.query.applications.findFirst({ where: eq(applications.slug, slug) });
    
    if (!application) {
      throw createError({ statusCode: 404, statusMessage: 'Application not found' });
    }

    const result = await db.transaction(async (tx) => {
      await tx.delete(applications_to_contacts).where(eq(applications_to_contacts.applicationId, application.id));
      await tx.delete(applicationHistories).where(eq(applicationHistories.applicationId, application.id));
      
      const [deleted] = await tx.delete(applications).where(eq(applications.id, application.id)).returning();
      return deleted;
    });

    const pdfPath = path.join(process.cwd(), 'data', 'applications', `${slug}.pdf`);
    if (fs.existsSync(pdfPath)) {
      try {
        fs.unlinkSync(pdfPath);
      } catch (err) {
        console.error(`Failed to delete PDF for ${slug}:`, err);
      }
    }

    return result;
  },

  async createOrUpdate(data: ApplicationCreatePayload) {
    return await db.transaction(async (tx) => {
        let addressId: number | null | undefined = undefined;
        let companyId: number;
    
        if (data.companyAddress) {
          const [newAddress] = await tx.insert(addresses).values({
            ...data.companyAddress
          }).returning();
          if (!newAddress) { throw createError({ statusCode: 500, statusMessage: 'Failed to insert address' }); }
          addressId = newAddress.id;
        }
    
        const existingCompany = await tx.query.companies.findFirst({
          where: eq(companies.name, data.companyName),
        });
    
        if (existingCompany) {
          companyId = existingCompany.id;
          if (addressId && existingCompany.addressId !== addressId) {
            await tx.update(companies).set({ addressId }).where(eq(companies.id, companyId));
          }
        } else {
          const [newCompany] = await tx.insert(companies).values({
            name: data.companyName,
            addressId: addressId,
          }).returning();
          if (!newCompany) { throw createError({ statusCode: 500, statusMessage: 'Failed to insert company' }); }
          companyId = newCompany.id;
        }
        
        const { companyName, companyAddress, ...applicationData } = data;
        const applicationInsertData = {
          ...applicationData,
          companyId,
        };
    
        const existingApplication = await tx.query.applications.findFirst({
          where: eq(applications.slug, data.slug),
        });
    
        let currentApplicationId;
        let finalAction: 'updated' | 'inserted';
    
        if (existingApplication) {
          const [updated] = await tx.update(applications).set(applicationInsertData).where(eq(applications.id, existingApplication.id)).returning();
          if (!updated) { throw createError({ statusCode: 500, statusMessage: 'Failed to update application' }); }
          currentApplicationId = updated.id;
          finalAction = 'updated';
        } else {
          const [inserted] = await tx.insert(applications).values(applicationInsertData).returning();
          if (!inserted) { throw createError({ statusCode: 500, statusMessage: 'Failed to insert application' }); }
          currentApplicationId = inserted.id;
          finalAction = 'inserted';
        }
    
        if (finalAction === 'inserted') {
          await tx.insert(applicationHistories).values({
            applicationId: currentApplicationId,
            status: 'draft',
            notes: 'Initial creation as draft',
          });
        }
        
        if (data.contactIds) {
          const currentContactLinks = await tx.query.applications_to_contacts.findMany({
            where: eq(applications_to_contacts.applicationId, currentApplicationId),
          });
          const currentContactIds = currentContactLinks.map(c => c.contactId);
          const newContactIds = data.contactIds;
    
          const idsToAdd = newContactIds.filter(id => !currentContactIds.includes(id));
          const idsToRemove = currentContactIds.filter(id => !newContactIds.includes(id));
    
          if (idsToAdd.length > 0) {
            const newLinks = idsToAdd.map(contactId => ({
              applicationId: currentApplicationId,
              contactId,
            }));
            await tx.insert(applications_to_contacts).values(newLinks);
          }
    
          if (idsToRemove.length > 0) {
            await tx.delete(applications_to_contacts).where(
              and(
                eq(applications_to_contacts.applicationId, currentApplicationId),
                inArray(applications_to_contacts.contactId, idsToRemove)
              )
            );
          }
        }
    
        const finalApplication = await tx.query.applications.findFirst({
          where: eq(applications.id, currentApplicationId),
          with: {
            company: { with: { address: true } },
            contacts: { with: { contact: true } },
            histories: true,
          }
        });
    
        return { ...finalApplication, action: finalAction };
      });
  }
};
