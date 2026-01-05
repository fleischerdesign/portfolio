import { applications, companies, addresses, applicationHistories, contacts, applications_to_contacts } from '../../db/schema';
import { desc, eq } from 'drizzle-orm';
import { ApplicationResponsePayload } from '../../../shared/schemas/application.schema';
import { CompanyResponse } from '../../../shared/schemas/company.schema';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  // Temporary dummy data creation logic - keep as is for now
  const existingApplication = await db.query.applications.findFirst();

  if (!existingApplication) {
    console.log('No applications found, inserting dummy data.');

    const [newAddress] = await db.insert(addresses).values({
      name: 'Company HQ',
      street: 'Main Street',
      houseNumber: '10',
      zipcode: 12345,
      city: 'Metropolis',
    }).returning();
    if (!newAddress) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to insert address' });
    }

    const [newCompany] = await db.insert(companies).values({
      name: 'ACME Corp',
      addressId: newAddress.id,
    }).returning();
    if (!newCompany) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to insert company' });
    }

    const [newContact] = await db.insert(contacts).values({
      name: 'Max Mustermann',
      salutation: 'male',
      position: 'HR Manager',
      email: 'hr@acmecorp.com',
      phone: '+49123456789',
      companyId: newCompany.id,
    }).returning();
    if (!newContact) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to insert contact' });
    }

    const appSlug = 'rocket-powered-skates-tester';
    const [newApplication] = await db.insert(applications).values({
      companyId: newCompany.id,
      title: 'Rocket-Powered Skates Tester',
      subtitle: 'Seeking adventurous individual for high-speed product testing.',
      slug: appSlug,
      url: 'https://acmecorp.com/careers/' + appSlug,
      notes: ['Sent application via website.', 'Followed up via email after 1 week.'],
      body: '## About the Role\n\nThis is a placeholder for the cover letter content.',
    }).returning();
    if (!newApplication) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to insert application' });
    }
    
    await db.insert(applications_to_contacts).values({
      applicationId: newApplication.id,
      contactId: newContact.id,
    });

    await db.insert(applicationHistories).values([
      {
        applicationId: newApplication.id,
        status: 'applied',
        notes: 'Initial dummy data creation',
      },
      {
        applicationId: newApplication.id,
        status: 'interview',
        scheduled_at: new Date('2025-11-15T10:00:00.000Z'),
        notes: 'First technical interview.',
      },
      {
        applicationId: newApplication.id,
        status: 'interview',
        scheduled_at: new Date('2025-11-22T14:30:00.000Z'),
        notes: 'Follow-up with team lead.',
      },
    ]);
  }

  const allApplications = await db.query.applications.findMany({
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

  const applicationsWithStatus: ApplicationResponsePayload[] = await Promise.all(allApplications.map(async (app) => {
    // Exclude 'interview' status when determining the current overall status of the application
    const latestStatusHistory = app.histories
      .filter(h => h.status !== 'interview')
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
    
    // Transform Drizzle's many-to-many contact structure to an array of Contact objects
    const associatedContacts = app.contacts.map(appToContact => appToContact.contact);

    return {
      ...app,
      currentStatus: latestStatusHistory?.status || 'draft',
      histories: app.histories,
      company: {
        ...app.company,
        address: app.company.address || null, // Ensure address is null if not found
      } as CompanyResponse,
      contacts: associatedContacts,
    } as unknown as ApplicationResponsePayload; // Use 'as unknown' to bridge the type gap until all parts are refactored
  }));


  return {
    applications: applicationsWithStatus,
  };
});
