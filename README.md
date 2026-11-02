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
| `CONTACT_TO` | no | `dima@holylabs.net` |
| `RESEND_FROM` | no | `Maya Website <onboarding@resend.dev>` |

`onboarding@resend.dev` can only deliver to the email that owns the Resend account. To send to anyone else, verify your domain in Resend and set `RESEND_FROM`, e.g. `Maya Website <site@holylabs.net>`.
