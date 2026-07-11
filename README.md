# Schoezia — A Wedding Surprise for Joel & Marzia 🍷

A one-page "scratch card" reveal website, built as the digital companion to a
physical scratch card gift. Scanning the QR code on the card brings you here,
where you can scratch to reveal the prize (a weekend getaway in the
vineyards) and help everyone find a date in 2027 that works.

**Live site:** https://spatialsparks.github.io/schoezia/

## Structure

```
index.html        Page markup (hero/scratch card, prize, availability, footer)
css/style.css      All styling, animations, responsive layout
js/script.js       Scratch-card interaction, confetti, scroll reveal, Doodle link
images/            Generated illustration assets
```

No build step, no dependencies — just static files served directly by
GitHub Pages.

## Setting the real availability poll link

The "Add My Availability" button currently points at a placeholder. Once you
create the actual poll (Doodle, Framadate, Rallly, Crab Fit, etc.):

1. Open [`js/script.js`](js/script.js).
2. Replace the placeholder value:

   ```js
   const DOODLE_POLL_URL = "REPLACE_ME_WITH_DOODLE_LINK";
   ```

   with your real poll URL, e.g.:

   ```js
   const DOODLE_POLL_URL = "https://doodle.com/en/poll/xxxxxxx";
   ```

3. Commit and push to `main` — GitHub Pages redeploys automatically within a
   minute or two.

## Local preview

Just open `index.html` in a browser, or serve the folder locally, e.g.:

```bash
python -m http.server 8000
```

then visit `http://localhost:8000`.

## Deployment

This repo is deployed via GitHub Pages, serving the `main` branch root. Any
push to `main` updates the live site automatically.
