import { applications, companies, addresses, interviews as interviewsTable } from '../../db/schema';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);

  // Check if any companies or applications exist
  const existingApplication = await db.query.applications.findFirst();

  // If DB is empty, insert dummy data. This should only run once.
  if (!existingApplication) {
    console.log('No applications found, inserting dummy data.');

    const [newAddress] = await db.insert(addresses).values({
      name: 'Company HQ',
      contactName: 'Max Mustermann',
      contactPosition: 'HR Manager',
      contactEmail: 'hr@acmecorp.com',
      contactPhone: '+49123456789',
      street: 'Main Street',
      houseNumber: '10',
      zipcode: 12345,
      city: 'Metropolis',
    }).returning();

    const [newCompany] = await db.insert(companies).values({
      name: 'ACME Corp',
      addressId: newAddress.id,
    }).returning();

    const appSlug = 'rocket-powered-skates-tester';
    const [newApplication] = await db.insert(applications).values({
      companyId: newCompany.id,
      title: 'Rocket-Powered Skates Tester',
      subtitle: 'Seeking adventurous individual for high-speed product testing.',
      slug: appSlug,
      url: 'https://acmecorp.com/careers/' + appSlug,
      applicationDate: new Date('2025-10-26'),
      status: 'applied',
      notes: ['Sent application via website.', 'Followed up via email after 1 week.'],
      body: '## About the Role\n\nThis is a placeholder for the cover letter content.',
    }).returning();
    
    // Add dummy interviews for the new application
    await db.insert(interviewsTable).values([
      { applicationId: newApplication.id, date: new Date('2025-11-15T10:00:00.000Z'), notes: 'First technical interview.'},
      { applicationId: newApplication.id, date: new Date('2025-11-22T14:30:00.000Z'), notes: 'Follow-up with team lead.'},
    ]);
  }

  // Fetch all applications with related company, address, and interviews data
  const allApplications = await db.query.applications.findMany({
    with: {
      company: {
        with: {
          address: true,
        },
      },
      interviews: true,
    },
  });

  return {
    applications: allApplications,
  };
});
