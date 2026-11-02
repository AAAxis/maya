# מאיה – מסע לריפוי עצמי

Static one-page site (Hebrew, RTL). No build step: `index.html` + `img/`.

## Run locally
Open `index.html` in a browser, or run `npx serve .`

## Deploy
Import this repo in Vercel (Framework preset: **Other**, no build command, output directory `.`).
Every push to `main` redeploys.

## To do
- Replace the placeholder photos in `img/` (cropped from the design mockup) with full-resolution originals.


## Contact form → email (Resend)
`api/contact.js` is a Vercel serverless function that emails each form submission via [Resend](https://resend.com).

Set these in Vercel → Project → Settings → Environment Variables, then redeploy:

| Variable | Required | Default |
|---|---|---|
| `RESEND_API_KEY` | yes | – |
| `CONTACT_TO` | no | `kahlonmeirav@gmail.com` |
| `RESEND_FROM` | no | `Maya Website <noreply@montigate.com>` |

The sender domain `montigate.com` is verified in Resend, so mail can be delivered to any recipient.
