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

The code is stored as a SHA-256 hash and the WhatsApp link is base64-encoded
at the top of [`js/script.js`](js/script.js), so neither is sitting around
as plain text in the source:

```js
const WHATSAPP_GROUP_URL_B64 = "aHR0cHM6Ly9jaGF0LndoYXRzYXBwLmNvbS9EN0hHY1NSR0hBekhHU0ozUTlZZTBw";
const RAFFLE_CODE_SHA256 = "0c691a6ae1bf2bfd74d25ade9ea3f460edf92a90ffbf50e12383db8730f8d4a4";
```

To change either value:

- **WhatsApp link**: base64-encode the new URL, e.g. in a browser console
  run `btoa("https://your-new-link")`, and paste the result in.
- **Raffle code**: compute its SHA-256 hex hash of the *uppercased, trimmed*
  code, e.g. in a browser console run
  `crypto.subtle.digest("SHA-256", new TextEncoder().encode("YOUR-CODE")).then(b => console.log(Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2,"0")).join("")))`,
  and paste the resulting hex string in.

Then commit and push to `main` — GitHub Pages redeploys automatically
within a minute or two.

Note: this is client-side obfuscation, not real security (fine for a fun
gimmick tied to a physical gift) — anyone who runs the same hashing/decoding
logic themselves could still recover both the code and the link.

## Local preview

Just open `index.html` in a browser, or serve the folder locally, e.g.:

```bash
python -m http.server 8000
```

then visit `http://localhost:8000`.

## Deployment

This repo is deployed via GitHub Pages, serving the `main` branch root. Any
push to `main` updates the live site automatically.
