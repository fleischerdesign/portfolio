import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

async function generatePdf() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: '/etc/profiles/per-user/philipp/bin/google-chrome-stable',
  });
  const page = await browser.newPage();

  const apiBaseUrl = 'http://localhost:3000';
  const pageUrl = `${apiBaseUrl}/de/resume`;

  try {
    await page.goto(pageUrl, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      scale: .8
    });

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const outputPath = path.resolve(__dirname, '../public/resume.pdf');

    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, pdfBuffer);
    console.log(`PDF generated successfully at ${outputPath}`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  } finally {
    await browser.close();
  }
}

generatePdf();
