import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { eq } from 'drizzle-orm';
import { applications } from '~~/server/db/schema';
import { PDFDocument } from '@cantoo/pdf-lib';
import { applicationService } from '~~/server/services/application.service';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);
  const slug = getRouterParam(event, 'slug');

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug is required',
    });
  }

  const application = await applicationService.getBySlug(slug);
  if (!application) {
    throw createError({ statusCode: 404, statusMessage: 'Application not found' });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--hide-scrollbars',
      '--mute-audio'
    ],
    executablePath: process.env.BROWSER_BIN,
  });
  
  try {
    const page = await browser.newPage();
    
    // Optimize: Disable request types we don't need for PDF
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      const type = req.resourceType();
      if (['image', 'font', 'stylesheet', 'document', 'script'].includes(type)) {
        req.continue();
      } else {
        req.abort();
      }
    });

    const host = getRequestHost(event);
    const protocol = getRequestProtocol(event);
    const apiBaseUrl = `${protocol}://${host}`;
    const pageUrl = `${apiBaseUrl}/de/studio/applications/${slug}/print`;
    
    const cookies = getRequestHeader(event, 'cookie');
    if (cookies) {
      const domain = host.split(':')[0];
      const cookieList = cookies.split(';').map(c => {
        const parts = c.trim().split('=');
        return {
          name: parts[0] || '',
          value: parts.slice(1).join('=') || '',
          domain: domain,
          path: '/',
          secure: protocol === 'https',
          sameSite: 'Lax' as const
        };
      }).filter(c => c.name && c.value);
      await page.setCookie(...cookieList);
    }

    // networkidle2 is significantly faster than networkidle0
    await page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for the main container to be present
    await page.waitForSelector('.pdf-resume-container', { visible: true, timeout: 10000 });

    const coverLetterPdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      scale: .8
    });

    // --- PDF Merging with pdf-lib ---
    const mergedPdf = await PDFDocument.create();
    
    // Add cover letter
    const coverPdf = await PDFDocument.load(coverLetterPdfBuffer);
    const coverPages = await mergedPdf.copyPages(coverPdf, coverPdf.getPageIndices());
    coverPages.forEach(page => mergedPdf.addPage(page));

    // Add attachments
    if (application.documents && application.documents.length > 0) {
      for (const appDoc of application.documents) {
        const doc = appDoc.document;
        const filePath = path.join(process.cwd(), '.data', 'uploads', 'documents', doc.filename);
        
        if (fs.existsSync(filePath)) {
          try {
            const attachmentBuffer = fs.readFileSync(filePath);
            const attachmentPdf = await PDFDocument.load(attachmentBuffer);
            const attachmentPages = await mergedPdf.copyPages(attachmentPdf, attachmentPdf.getPageIndices());
            attachmentPages.forEach(page => mergedPdf.addPage(page));
          } catch (err) {
            console.error(`Failed to append document ${doc.name}:`, err);
            // We continue even if one document fails
          }
        }
      }
    }

    const finalPdfBuffer = await mergedPdf.save();

    const outputPath = path.join(process.cwd(), '.data', 'applications', `${slug}.pdf`);
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, finalPdfBuffer);

    await db.update(applications).set({ pdfGeneratedAt: new Date() }).where(eq(applications.slug, slug));

    return {
      path: `/api/applications/${slug}/pdf/download`
    }
  } catch (error) {
    console.error(`Error generating PDF for slug "${slug}":`, error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error generating PDF',
    });
  } finally {
    await browser.close();
  }
});
