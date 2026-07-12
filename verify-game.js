const fs = require('fs');
const path = require('path');

const root = __dirname;
const required = [
  'game-server.js',
  'game-data.json',
  'public/index.html',
  'public/app.js',
  'public/app.css',
  'public/media/article-final-subtil-1.png',
  'public/media/article-final-subtil-2.png'
];
const pageCounts = { A: 5, B: 5, C: 4, D: 6, E: 10, V: 6 };
const errors = [];

function exists(relative) {
  return fs.existsSync(path.join(root, relative));
}

for (const file of required) {
  if (!exists(file)) errors.push(`Fehlt: ${file}`);
}

for (const [group, count] of Object.entries(pageCounts)) {
  const pdf = `public/media/archives/${group}.pdf`;
  if (!exists(pdf)) errors.push(`Originalakte fehlt: ${pdf}`);
  for (let page = 1; page <= count; page += 1) {
    const image = `public/media/diaries/${group}/${group}-${page}.png`;
    if (!exists(image)) errors.push(`Gerenderte Seite fehlt: ${image}`);
  }
}

try {
  JSON.parse(fs.readFileSync(path.join(root, 'game-data.json'), 'utf8'));
} catch (error) {
  errors.push(`game-data.json ist ungültig: ${error.message}`);
}

if (exists('public/app.js')) {
  const app = fs.readFileSync(path.join(root, 'public/app.js'), 'utf8');
  const forbidden = ['ANALYSEHILFEN', '0 / 3 freigegeben', 'Nächste Spur in etwa'];
  for (const text of forbidden) {
    if (app.includes(text)) errors.push(`Veraltete sichtbare Hinweisanzeige gefunden: ${text}`);
  }
  if (!app.includes("id:'ARTIKEL',images:content.articleImages")) {
    errors.push('Der Artikel wird im Gruppenarchiv nicht eindeutig als Bild eingebunden.');
  }
}

if (errors.length) {
  console.error('\nIntegritätsprüfung fehlgeschlagen:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Integritätsprüfung erfolgreich.');
console.log('Alle sechs Originalakten, 36 gerenderten Seiten und Artikelbilder sind vorhanden.');

