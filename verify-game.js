const fs = require('fs');
const path = require('path');

const root = __dirname;
const required = [
  'game-server.js',
  'game-data.json',
  'public/index.html',
  'public/app.js',
  'public/leitung.html',
  'public/leitung.js',
  'public/app.css',
  'public/themes/ermittlungsraum.css',
  'public/themes/kriminaltechnik.css',
  'public/themes/hierarchyforce.css',
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
  const gameData = JSON.parse(fs.readFileSync(path.join(root, 'game-data.json'), 'utf8'));
  if (gameData.groups.V.answer !== '0764') errors.push('Der Zwischencode von Segment V muss 0764 bleiben.');
  if (gameData.groups.E.answer !== '6407') errors.push('Der finale Code von Segment E muss 64-07 bzw. intern 6407 lauten.');
  const eText = gameData.groups.E.entries.map(entry => entry.text).join('\n');
  if (eText.includes('das nicht zurückführt')) errors.push('E enthält noch die veraltete Aussage „das nicht zurückführt“.');
  for (const statement of ['Die Null steht an dritter Stelle.', 'Die Sechs eröffnet die Reihe.', 'Er schließt die Reihe.', 'das wahre das, das zurückführt.']) {
    if (!eText.includes(statement)) errors.push(`E-Aussage fehlt: ${statement}`);
  }
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
  if (!app.includes("activateTheme('hierarchyforce')")) {
    errors.push('Der automatische Designwechsel beim Hierarchy-Force-Eingriff fehlt.');
  }
  const hiddenSecrets = ['accessWords', 'personen', 'orte', 'jahre', 'transaktionen', 'regeln', 'reihenfolge', '0764', '6407', '64-07', 'BILDETGRUPPEN'];
  for (const secret of hiddenSecrets) {
    if (app.toLocaleLowerCase('de-DE').includes(secret.toLocaleLowerCase('de-DE'))) errors.push(`Öffentlicher Client enthält noch einen Klartextschlüssel oder -code: ${secret}`);
  }
}

if (exists('game-server.js')) {
  const server = fs.readFileSync(path.join(root, 'game-server.js'), 'utf8');
  for (const route of ['/api/admin/start', '/api/recovery']) {
    if (!server.includes(route)) errors.push(`Serverroute fehlt: ${route}`);
  }
  if (!server.includes('/api/lobby/join')) errors.push('Die Lobby-Anmeldung fehlt auf dem Server.');
  if (!server.includes('MIN_GROUP_SIZE=2')) errors.push('Die Mindestbesetzung von zwei Mitgliedern je Gruppe fehlt.');
  if (!server.includes('state.groupsLocked=true')) errors.push('Die automatische verbindliche Gruppensperre fehlt.');
}

if (exists('public/index.html') && !fs.readFileSync(path.join(root, 'public/index.html'), 'utf8').includes('id="lobbyView"')) errors.push('Die Teilnehmer-Lobby fehlt.');
if (exists('public/leitung.html') && !fs.readFileSync(path.join(root, 'public/leitung.html'), 'utf8').includes('id="attendeeList"')) errors.push('Die Anwesenheitsliste der Spielleitung fehlt.');

if (errors.length) {
  console.error('\nIntegritätsprüfung fehlgeschlagen:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Integritätsprüfung erfolgreich.');
console.log('Alle sechs Originalakten, 36 gerenderten Seiten und Artikelbilder sind vorhanden.');
