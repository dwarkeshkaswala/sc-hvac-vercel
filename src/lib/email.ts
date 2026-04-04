import nodemailer from "nodemailer";

/**
 * Send contact-form notification to the business inbox.
 *
 * SMTP credentials are read from environment variables:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
 *
 * The "from" address uses SMTP_USER (or SMTP_FROM if set separately).
 * All submissions go to info@shreejihvac.com.
 */

const RECIPIENT = "info@shreejihvac.com";

function getTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export async function sendContactEmail(data: ContactFormData) {
  const transport = getTransport();

  const html = `
<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
  <h2 style="margin:0 0 16px;font-size:20px;color:#111">New Contact Form Submission</h2>
  <table style="width:100%;border-collapse:collapse">
    <tr>
      <td style="padding:8px 12px;font-size:13px;color:#666;font-weight:600;width:110px;vertical-align:top">Name</td>
      <td style="padding:8px 12px;font-size:14px;color:#111">${escapeHtml(data.name)}</td>
    </tr>
    <tr style="background:#f9fafb">
      <td style="padding:8px 12px;font-size:13px;color:#666;font-weight:600;vertical-align:top">Email</td>
      <td style="padding:8px 12px;font-size:14px;color:#111">
        <a href="mailto:${escapeHtml(data.email)}" style="color:#0000B8">${escapeHtml(data.email)}</a>
      </td>
    </tr>
    <tr>
      <td style="padding:8px 12px;font-size:13px;color:#666;font-weight:600;vertical-align:top">Phone</td>
      <td style="padding:8px 12px;font-size:14px;color:#111">${data.phone ? escapeHtml(data.phone) : "<em style='color:#999'>Not provided</em>"}</td>
    </tr>
    <tr style="background:#f9fafb">
      <td style="padding:8px 12px;font-size:13px;color:#666;font-weight:600;vertical-align:top">Service</td>
      <td style="padding:8px 12px;font-size:14px;color:#111">${escapeHtml(data.service)}</td>
    </tr>
    <tr>
      <td style="padding:8px 12px;font-size:13px;color:#666;font-weight:600;vertical-align:top">Message</td>
      <td style="padding:8px 12px;font-size:14px;color:#111;white-space:pre-line">${escapeHtml(data.message)}</td>
    </tr>
  </table>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0 12px" />
  <p style="font-size:11px;color:#999;margin:0">
    Sent from shreejicooling.com contact form · ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
  </p>
</div>`;

  await transport.sendMail({
    from: `"Shreeji Cooling Website" <${process.env.SMTP_FROM ?? process.env.SMTP_USER}>`,
    to: RECIPIENT,
    replyTo: data.email,
    subject: `New inquiry from ${data.name} — ${data.service}`,
    html,
  });
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
