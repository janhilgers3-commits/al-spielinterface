# L&B-Spielinterface – Tag 2

Diese Fassung enthält das lokale Spielinterface, die Audiodateien, den Zeitungsartikel und die sechs verbindlichen Originalakten `A`, `B`, `C`, `D`, `E` und `V`.

## Prüfen

Voraussetzung: Node.js 18 oder neuer.

```bash
npm test
```

Die Prüfung kontrolliert:

- die JavaScript-Syntax von Server und Oberfläche,
- alle sechs Original-PDFs,
- alle 36 daraus gerenderten Archivseiten,
- beide Artikelbilder,
- die Gültigkeit von `game-data.json`,
- das Fehlen der alten sichtbaren Hinweisvorschau.

## Starten

```bash
npm start
```

Danach ist das Spiel unter <http://localhost:8764/> erreichbar. Unter Windows kann alternativ `start_game.cmd` verwendet werden.

## Designvarianten

Standardmäßig startet das Spiel im zurückhaltenden **Ermittlungsraum**-Design. Beim tatsächlichen Eingriff von Hierarchy Force wechselt die Oberfläche automatisch in das entsprechende Systemdesign. Für eine gezielte technische Vorschau stehen außerdem folgende lokale Adressen bereit:

- Ermittlungsraum: <http://localhost:8764/?theme=ermittlungsraum>
- Kriminaltechnik: <http://localhost:8764/?theme=kriminaltechnik>
- Hierarchy Force: <http://localhost:8764/?theme=hierarchyforce>

## Nicht versionierte Dateien

`game-state.json` enthält den veränderlichen Spielstand und wird bewusst ignoriert. Der Ordner `runtime` enthält nur die große, gebündelte Windows-Laufzeit für den Offline-Start und wird ebenfalls nicht in Git aufgenommen. Für Git und die automatische Prüfung genügt eine normale Node.js-Installation.
