# מאיה – מסע לריפוי עצמי

Static site (Hebrew, RTL). No build step.

- `index.html` – home page
- `story.html` – הסיפור שלי
- `method.html` – אר"ד, השיטה המחברת
- `styles.css` – shared styles
- `img/` – images (`home-hero.jpg`, `story.jpg`, `method-circle.jpg` are the main photos)

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
| `CONTACT_TO` | no | `mayaor1515@gmail.com,dima@holylabs.net` |
| `RESEND_FROM` | no | `Maya Website <noreply@montigate.com>` |

The sender domain `montigate.com` is verified in Resend, so mail can be delivered to any recipient.
