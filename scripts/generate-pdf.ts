import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Dummy resume data for PDF generation
const resumeData = {
  personal: {
    name: "Philipp Fleischer",
    title: "Als angehender Informatiker lebe ich für sauberen Code, reibungslose Nutzererfahrungen und innovative Lösungen, die Konzepte Wirklichkeit werden lassen.",
    location: "Neubrandenburg, DE",
    internshipStatus: "Im Rahmen meiner Umschulung zum Fachinformatiker suche ich ein 6-monatiges Pflichtpraktikum. Ich bin bereit, mit vollem Engagement zu lernen und Ihr Team zu unterstützen.",
  },
  summary: "Ich bin ein angehender Informatiker, der sich in der Entwicklung von sauberem Code, nahtlosen Nutzererlebnissen und innovativen Lösungen entfaltet, die Ideen zum Leben erwecken.",
  techStack: [
    'Typescript', 'React', 'Git', 'Docker', 'Dart', 'Rust', 'Tailwind', 'Vue', 'Flutter', 'Node.js', 'Deno', 'Python', 'PostgreSQL', 'MongoDB', 'REST', 'GraphQL'
  ],
  careerTimeline: [
    {
        date: "2025 - 2027",
        title: "WBS Training AG",
        description: "Umschulung zum Fachinformatiker für Anwendungsentwicklung",
        icon: "heroicons:academic-cap",
        skills: ["Java", "Python", "C#", "Webentwicklung", "DevOps", "Datenbanken"]
    },
    {
        date: "2022 - 2025",
        title: "United Parcel Service",
        description: "Lagermitarbeiter und Teamleitung",
        icon: "heroicons:briefcase",
        skills: ["Teamleitung", "Prozessoptimierung", "Projekt Management", "Lagerlogistik", "Fehlerbehebung"]
    },
    {
        date: "2020 - 2022",
        title: "Lidl GmbH & Co. KG",
        description: "Verkäufer im Einzelhandel",
        icon: "heroicons:briefcase",
        skills: ["Datenpflege", "Bestandverwaltung", "Einzelhandelslogistik", "Kundenservice", "Prozessoptimierung"]
    },
    {
        date: "2017 - 2019",
        title: "Auszeit",
        description: "Gesundheitsbedingte Auszeit und Neubewertung der Karriereziele",
        icon: "mage:eye-closed",
        skills: ["Weiterentwicklung", "Weiterbildung", "Analyse"]
    },
    {
        date: "2015 - 2017",
        title: "Medienkolleg Rostock",
        description: "Ausbildung zum Mediengestalter für Bild und Ton",
        icon: "heroicons:academic-cap",
        skills: ["Audioproduktion", "Videoproduktion", "Sounddesign", "Motion Graphics", "Adobe Creative Cloud"]
    },
    {
        date: "2014 - 2015",
        title: "Designbüro Persch",
        description: "Mediengestalter für Digital- und Printmedien",
        icon: "heroicons:briefcase",
        skills: ["Printdesign", "Digitale Medien", "Grafikdesign", "Layoutdesign", "Brand Identity", "Typography", "Webdesign"]
    },
    {
        date: "2012 - 2014",
        title: "IT-College Putbus",
        description: "Ausbildung zum Mediengestalter für Digital- und Printmedien",
        icon: "heroicons:academic-cap",
        skills: ["Printdesign", "Digitale Medien", "Layoutdesign", "Typography", "Webdesign"]
    },
    {
        date: "2007 - 2012",
        title: "8. Realschule Johann Heinrich Voß",
        description: "Mittlere Reife",
        icon: "heroicons:academic-cap",
        skills: []
    },
    {
        date: "2003 - 2007",
        title: "9. Grundschule Hans Christian Andersen",
        description: "Grundschulabschluss",
        icon: "heroicons:academic-cap",
        skills: []
    }
  ],
};

async function generatePdf() {
  const browser = await puppeteer.launch({
    headless: true, // Set to false to see the browser UI
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: '/etc/profiles/per-user/philipp/bin/google-chrome-stable', // <--- HIER ANPASSEN
  });
  const page = await browser.newPage();

  const apiBaseUrl = 'http://localhost:3000'; // Assuming your Nuxt app runs on port 3000
  const pageUrl = `${apiBaseUrl}/pdf-resume?resumeData=${encodeURIComponent(JSON.stringify(resumeData))}`;

  try {
    // Navigate to the Nuxt page to get the HTML content
    await page.goto(pageUrl, { waitUntil: 'networkidle0' });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      scale: .8
    });

    // Define output path
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const outputPath = path.resolve(__dirname, '../static/resume.pdf');

    // Ensure the output directory exists
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
