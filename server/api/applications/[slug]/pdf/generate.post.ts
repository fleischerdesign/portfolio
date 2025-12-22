import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path'; // Import path module
import fs from 'fs';
import { eq } from 'drizzle-orm';
import { applications } from '~~/server/db/schema';

export default defineEventHandler(async (event) => {
  await authorize(event, isAdmin);
  const slug = getRouterParam(event, 'slug');
  console.log("generate!")

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug is required',
    });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: process.env.BROWSER_BIN,
  });
  const page = await browser.newPage();

  const host = getRequestHost(event);
  const protocol = getRequestProtocol(event);
  const apiBaseUrl = `${protocol}://${host}`;
  const pageUrl = `${apiBaseUrl}/de/application/${slug}/print`;

  const cookies = getRequestHeader(event, 'cookie');
  if (cookies) {
    await page.setExtraHTTPHeaders({ cookie: cookies });
  }

  try {
    await page.goto(pageUrl, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      scale: .8
    });

    // Use process.cwd() which is reliably /app in the container
    const outputPath = path.join(process.cwd(), 'data', 'applications', `${slug}.pdf`);
    console.log(`Writing PDF to: ${outputPath}`);

    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, pdfBuffer);

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
