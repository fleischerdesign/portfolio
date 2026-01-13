import { applications, companies, addresses, applicationHistories, applications_to_contacts } from '~~/server/db/schema';
import type { ApplicationResponsePayload, ApplicationCreatePayload, Status } from '~~/shared/schemas/application.schema';
import type { CompanyResponse } from '~~/shared/schemas/company.schema';
import { eq, desc, and, inArray } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

// --- Internal Helpers ---

const mapApplication = (app: any): ApplicationResponsePayload => {
  const latestStatusHistory = app.histories && app.histories.length > 0
    ? app.histories.reduce((prev: any, current: any) => 
        (prev.createdAt?.getTime() || 0) > (current.createdAt?.getTime() || 0) ? prev : current
      )
    : null;

  const currentStatus = latestStatusHistory?.status || 'draft';
  const associatedContacts = app.contacts?.map((c: any) => c.contact) || [];

  return {
    ...app,
    currentStatus,
    histories: app.histories || [],
    company: {
      ...app.company,
      address: app.company?.address || null,
    } as CompanyResponse,
    contacts: associatedContacts,
  };
};

async function ensureCompanyAndAddress(tx: any, companyName: string, companyAddress?: any) {
  let addressId: number | null = null;
  
  if (companyAddress) {
    const [newAddress] = await tx.insert(addresses).values(companyAddress).returning();
    if (!newAddress) throw createError({ statusCode: 500, statusMessage: 'Failed to insert address' });
    addressId = newAddress.id;
  }

  const existingCompany = await tx.query.companies.findFirst({
    where: eq(companies.name, companyName),
  });

  if (existingCompany) {
    if (addressId && existingCompany.addressId !== addressId) {
      await tx.update(companies).set({ addressId }).where(eq(companies.id, existingCompany.id));
    }
    return existingCompany.id;
  } else {
    const [newCompany] = await tx.insert(companies).values({
      name: companyName,
      addressId,
    }).returning();
    if (!newCompany) throw createError({ statusCode: 500, statusMessage: 'Failed to insert company' });
    return newCompany.id;
  }
}

async function syncContacts(tx: any, applicationId: number, newContactIds: number[] | undefined) {
  if (!newContactIds) return;

  const currentContactLinks = await tx.query.applications_to_contacts.findMany({
    where: eq(applications_to_contacts.applicationId, applicationId),
  });
  const currentContactIds = currentContactLinks.map((c: any) => c.contactId);

  const idsToAdd = newContactIds.filter(id => !currentContactIds.includes(id));
  const idsToRemove = currentContactIds.filter((id: number) => !newContactIds.includes(id));

  if (idsToAdd.length > 0) {
    await tx.insert(applications_to_contacts).values(
      idsToAdd.map(contactId => ({ applicationId, contactId }))
    );
  }

  if (idsToRemove.length > 0) {
    await tx.delete(applications_to_contacts).where(
      and(
        eq(applications_to_contacts.applicationId, applicationId),
        inArray(applications_to_contacts.contactId, idsToRemove)
      )
    );
  }
}

export const applicationService = {
  async getAll(limit?: number): Promise<ApplicationResponsePayload[]> {
    const allApplications = await db.query.applications.findMany({
      limit,
      with: {
        company: { with: { address: true } },
        contacts: { with: { contact: true } },
        histories: true,
      },
      orderBy: [desc(applications.createdAt)],
    });

    return allApplications.map(mapApplication);
  },

  async getBySlug(slug: string): Promise<ApplicationResponsePayload | null> {
    const application = await db.query.applications.findFirst({
      where: eq(applications.slug, slug),
      with: {
        company: { with: { address: true } },
        contacts: { with: { contact: true } },
        histories: {
          orderBy: [desc(applicationHistories.createdAt), desc(applicationHistories.id)],
        },
      },
    });
  
    if (!application) return null;
    return mapApplication(application);
  },

  async addHistory(slug: string, data: { status: Status; notes?: string | null; scheduled_at?: string | null }) {
    const application = await db.query.applications.findFirst({ where: eq(applications.slug, slug) });
    if (!application) throw createError({ statusCode: 404, statusMessage: 'Application not found' });

    return await db.insert(applicationHistories).values({
      applicationId: application.id,
      status: data.status,
      notes: data.notes,
      scheduled_at: data.scheduled_at ? new Date(data.scheduled_at) : null,
    }).returning();
  },

  async updateHistory(historyId: number, data: { status?: Status; notes?: string | null; scheduled_at?: string | null }) {
    return await db.update(applicationHistories)
      .set({
        ...data,
        scheduled_at: data.scheduled_at ? new Date(data.scheduled_at) : (data.scheduled_at === null ? null : undefined),
      })
      .where(eq(applicationHistories.id, historyId))
      .returning();
  },

  async deleteHistory(historyId: number) {
    return await db.delete(applicationHistories).where(eq(applicationHistories.id, historyId)).returning();
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
        const companyId = await ensureCompanyAndAddress(tx, data.companyName || '', data.companyAddress);
        
        const { companyName: _, companyAddress: __, contactIds, ...appFields } = data;
        
        const applicationValues = {
          ...appFields,
          companyId,
          createdAt: appFields.createdAt ? new Date(appFields.createdAt) : undefined,
          updatedAt: appFields.updatedAt ? new Date(appFields.updatedAt) : undefined,
          pdfGeneratedAt: appFields.pdfGeneratedAt ? new Date(appFields.pdfGeneratedAt) : undefined,
        };
    
        const existingApplication = await tx.query.applications.findFirst({
          where: eq(applications.slug, data.slug),
        });
    
        let currentApplicationId: number;
        let finalAction: 'updated' | 'inserted';
    
        if (existingApplication) {
          const [updated] = await tx.update(applications)
            .set(applicationValues)
            .where(eq(applications.id, existingApplication.id))
            .returning();
          
          if (!updated) throw createError({ statusCode: 500, statusMessage: 'Failed to update application' });
          currentApplicationId = updated.id;
          finalAction = 'updated';
        } else {
          const [inserted] = await tx.insert(applications).values(applicationValues).returning();
          
          if (!inserted) throw createError({ statusCode: 500, statusMessage: 'Failed to insert application' });
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
        
        await syncContacts(tx, currentApplicationId, contactIds);
    
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
