// Vercel serverless function: POST /api/contact
// Sends contact-form submissions by email through Resend.
// Required env var (set in Vercel → Settings → Environment Variables):
//   RESEND_API_KEY   your Resend API key
// Optional:
//   CONTACT_TO       recipient(s), comma-separated (default: dima@holylabs.net)
//   RESEND_FROM      sender, must be on a domain verified in Resend
//                    (default: "Maya Website <onboarding@resend.dev>")

const LIMITS = { name: 120, phone: 40, email: 200, topic: 80, message: 5000 };

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  let body = req.body || {};
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  // Honeypot: real visitors never fill this hidden field.
  if (body.website) return res.status(200).json({ ok: true });

  const data = {};
  for (const [key, max] of Object.entries(LIMITS)) {
    data[key] = String(body[key] ?? '').trim().slice(0, max);
  }

  if (!data.name || !data.email) {
    return res.status(400).json({ ok: false, error: 'נא למלא שם ואימייל' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return res.status(400).json({ ok: false, error: 'כתובת האימייל אינה תקינה' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set');
    return res.status(500).json({ ok: false, error: 'השליחה אינה זמינה כרגע' });
  }

  const to = (process.env.CONTACT_TO || 'dima@holylabs.net').split(',').map((s) => s.trim()).filter(Boolean);
  const from = process.env.RESEND_FROM || 'Maya Website <onboarding@resend.dev>';

  const rows = [
    ['שם', data.name],
    ['אימייל', data.email],
    ['טלפון', data.phone || '—'],
    ['נושא', data.topic || '—'],
  ];

  const html = `<div dir="rtl" style="font-family:Arial,sans-serif;font-size:15px;color:#4a3a2c">
  <h2 style="margin:0 0 12px">פנייה חדשה מהאתר</h2>
  <table style="border-collapse:collapse">
    ${rows.map(([k, v]) => `<tr><td style="padding:4px 0 4px 16px;color:#a37a3e"><b>${k}</b></td><td style="padding:4px 0">${esc(v)}</td></tr>`).join('')}
  </table>
  <p style="margin:16px 0 4px;color:#a37a3e"><b>הודעה</b></p>
  <p style="margin:0;white-space:pre-wrap">${esc(data.message || '—')}</p>
</div>`;

  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n') + `\n\nהודעה:\n${data.message || '—'}`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to,
        reply_to: data.email,
        subject: `פנייה חדשה מהאתר: ${data.name}${data.topic ? ` (${data.topic})` : ''}`,
        html,
        text,
      }),
    });
    if (!r.ok) {
      console.error('Resend error', r.status, await r.text());
      return res.status(502).json({ ok: false, error: 'השליחה נכשלה, נסי שוב מאוחר יותר' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend request failed', err);
    return res.status(502).json({ ok: false, error: 'השליחה נכשלה, נסי שוב מאוחר יותר' });
  }
};
