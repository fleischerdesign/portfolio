// scripts/migrate-applications.ts
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const APPLICATIONS_PATH = 'applications'; // Path relative to project root
const API_ENDPOINT = 'http://localhost:3000/api/applications';

interface FrontmatterDate {
  application?: Date;
  response?: Date;
  interviews?: Date[];
}

interface FrontmatterContact {
  name: string;
  position?: string;
  email?: string;
  phone?: string;
}

interface FrontmatterAddress {
  name?: string;
  contact?: FrontmatterContact;
  street: string;
  houseNumber: string;
  zipcode: number;
  city: string;
}

interface FrontmatterCompany {
  name: string;
  address: FrontmatterAddress;
}

interface Frontmatter {
  title: string;
  subtitle: string;
  slug: string;
  url: string;
  dates?: FrontmatterDate;
  status: 'draft' | 'applied' | 'interview' | 'offer' | 'rejected' | 'withdrawn';
  company: FrontmatterCompany;
  notes?: string[];
}

async function main() {
  console.log('Starting migration of Markdown applications...');

  const files = fs.readdirSync(APPLICATIONS_PATH).filter(file => file.endsWith('.md'));

  for (const file of files) {
    const filePath = path.join(APPLICATIONS_PATH, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content: body } = matter(fileContent);

    // Cast frontmatter to the expected type for better safety
    const parsedFrontmatter: Frontmatter = frontmatter as Frontmatter;

    try {
      // Map frontmatter to API payload structure
      const payload = {
        slug: parsedFrontmatter.slug || file.replace('.md', ''), // Use slug from frontmatter or filename
        title: parsedFrontmatter.title,
        subtitle: parsedFrontmatter.subtitle,
        body: body.trim(), // Trim whitespace from markdown body
        status: parsedFrontmatter.status,
        notes: parsedFrontmatter.notes,
        url: parsedFrontmatter.url,
        // Flatten dates and convert to ISO string for API
        applicationDate: parsedFrontmatter.dates?.application?.toISOString() || undefined,
        responseDate: parsedFrontmatter.dates?.response?.toISOString() || undefined,
        interviews: parsedFrontmatter.dates?.interviews?.map(d => d.toISOString()) || undefined,
        company: {
          name: parsedFrontmatter.company.name,
          address: {
            name: parsedFrontmatter.company.address.name,
                  street: parsedFrontmatter.company.address.street,
                  houseNumber: String(parsedFrontmatter.company.address.houseNumber), // Ensure houseNumber is a string
                  zipcode: parsedFrontmatter.company.address.zipcode,            city: parsedFrontmatter.company.address.city,
            // Flatten contact details
            contactName: parsedFrontmatter.company.address.contact?.name,
            contactPosition: parsedFrontmatter.company.address.contact?.position,
            contactEmail: parsedFrontmatter.company.address.contact?.email,
            contactPhone: parsedFrontmatter.company.address.contact?.phone,
          },
        },
      };

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`[SUCCESS] Migrated ${file}: ${result.result.status} (Slug: ${result.result.slug})`);
      } else {
        const errorData = await response.json();
        console.error(`[ERROR] Failed to migrate ${file} (${response.status}):`, errorData);
      }
    } catch (error) {
      console.error(`[ERROR] Processing ${file}:`, error);
    }
  }

  console.log('Migration process finished.');
}

main().catch(console.error);
