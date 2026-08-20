# Die Hautmaler

Statische Website für das Tattoo-Studio in Ottobrunn. Die ausgelieferte Site bleibt
reines HTML, CSS und JavaScript. Node.js wird ausschließlich für reproduzierbare
Qualitätsprüfungen, Bildderivate und das allowlist-basierte Pages-Artefakt verwendet.

## Lokale Prüfung

Voraussetzung ist Node.js 24. Nach `npm ci` und der einmaligen Chromium-Installation
mit `npx playwright install chromium` führt `npm run release:check` sämtliche
technischen Prüfungen aus. Dazu gehören HTML/JavaScript, Links, Assets, Medien,
Browser-E2E, axe, visuelle Regression, Lighthouse-Budgets und Dependency-Audit.

Der Befehl trennt technische Ergebnisse von externen Freigaben. Ein technisch grüner
Lauf gibt die Website nicht zur Veröffentlichung frei; sämtliche Betreiber-Gates
bleiben sichtbar blockiert.

## Veröffentlichung

Ein Push auf `main` startet `.github/workflows/pages.yml`. Das Deployment wartet auf
die wiederverwendbare Quality-CI und lädt anschließend nur `_site/` hoch. Quellcode
für Tests, Dokumentation, Manifeste und `.agent/` werden nicht als Website-Artefakt
ausgeliefert.

Die clientseitige Vorschau-Sperre ist ausschließlich eine Präsentationshilfe und
keine Authentifizierung. Sie sowie `noindex, nofollow` bleiben auf allen Seiten, bis
die öffentliche Freigabe ausdrücklich erteilt wurde. Google Maps wird erst nach
einer bewussten Interaktion geladen; Tracking oder Analyse-Skripte gibt es nicht.

## Aktuelle Aufgaben

Die einzige verbindliche Aufgabenliste liegt in [`.agent/TODO.md`](.agent/TODO.md).
Domain, GitHub Pages und HTTPS wurden beim Agent-Handoff am 13.08.2026 verifiziert;
Freigabe, rechtliche Angaben und die Entfernung der Vorschau-Sperre sind weiterhin
offen.

## Inhaltliche Basis

Adresse (Ottostraße 86a, 85521 Ottobrunn), Telefonnummer (0176 74135642) und Öffnungszeiten stammen aus dem öffentlichen Facebook-Auftritt und dem aktuellen Logo (Google-Business-Foto); ein älteres Logo-Asset von Facebook zeigte noch eine andere Telefonnummer (0176/27620719) – die Nummer aus dem neueren Logo und der Facebook-Info-Seite wurde übernommen, da sie an zwei Stellen übereinstimmt. Vor Veröffentlichung nochmal gegenchecken, falls sich seither was geändert hat.

Die Portfolio-Fotos in `img/work-*.jpg` sind reale Arbeiten. `work-foo-dog-back.jpg`
wurde direkt für diese Aktualisierung bereitgestellt und für die Website als
metadatenfreies JPEG aufbereitet. `work-dagger-panther.jpg`, `work-om.jpg` und
`img/phil.jpg` stammen laut vorhandener Dokumentation aus lokalen Originalfotos;
EXIF/GPS wurden beim Verkleinern entfernt. Die übrigen `work-*.jpg` sind
Bildschirm-Ausschnitte aus dem öffentlichen Instagram-Feed `@diehautmaler` in
Thumbnail-Auflösung. `img/logo.png` ist das aktuelle Studio-Logo aus einem
Google-Business-Foto, `img/storefront.jpg` der Studio-Eingang aus derselben
Quellkategorie.

Diese Herkunftsangaben belegen keine Nutzungsrechte. Eigentümer, Veröffentlichungs-
und Personenfreigaben stehen für alle Medien weiterhin extern aus. Das vollständige
Inventar liegt in [`media-manifest.json`](media-manifest.json) und
[`docs/MEDIA_MANIFEST.md`](docs/MEDIA_MANIFEST.md); technische Nachweise und
Freigabegrenzen stehen in [`docs/VERIFICATION_MATRIX.md`](docs/VERIFICATION_MATRIX.md)
und [`docs/RELEASE_CHECKLIST.md`](docs/RELEASE_CHECKLIST.md).
