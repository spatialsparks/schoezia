# Schoezia — A Wedding Surprise for Joel & Marzia 🍷

A one-page "scratch card" reveal website, built as the digital companion to a
physical scratch card gift. Scanning the QR code on the card brings you here,
where you can scratch to reveal the prize (a weekend getaway in the
vineyards) and unlock a private WhatsApp group to help everyone find a date
in 2027 that works.

**Live site:** https://spatialsparks.github.io/schoezia/

## Structure

```
index.html        Page markup (hero/scratch card, prize, availability, footer)
css/style.css      All styling, animations, responsive layout
js/script.js       Scratch-card interaction, confetti, scroll reveal, raffle-code gate
images/            Generated illustration assets
```

No build step, no dependencies — just static files served directly by
GitHub Pages.

## The raffle-code gate

The "Save the Date" section is gated behind a code entered by the visitor.
The idea: each physical scratch card has a raffle ticket code printed in its
bottom-left corner, and entering it here reveals the "Join The WhatsApp
Group" button.

Both the code and the WhatsApp invite link live at the top of
[`js/script.js`](js/script.js):

```js
const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/D7HGcSRGHAzHGSJ3Q9Ye0p";
const RAFFLE_CODE = "002026-07-18";
```

Update either value and push to `main` to change them — GitHub Pages
redeploys automatically within a minute or two.

Note: this is a client-side check only (fine for a fun gimmick tied to a
physical gift), not real security — anyone who reads the page source can
find the code and link.

## Local preview

Just open `index.html` in a browser, or serve the folder locally, e.g.:

```bash
python -m http.server 8000
```

then visit `http://localhost:8000`.

## Deployment

This repo is deployed via GitHub Pages, serving the `main` branch root. Any
push to `main` updates the live site automatically.
