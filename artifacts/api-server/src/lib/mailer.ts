import nodemailer from "nodemailer";
import { logger } from "./logger.js";

const SMTP_HOST  = process.env["SMTP_HOST"]  || "";
const SMTP_PORT  = Number(process.env["SMTP_PORT"] || 587);
const SMTP_USER  = process.env["SMTP_USER"]  || "";
const SMTP_PASS  = process.env["SMTP_PASS"]  || "";
const FROM_EMAIL = process.env["FROM_EMAIL"] || "noreply@bookmysquad.in";
const ADMIN_EMAIL = "bookmysquad0@gmail.com";

const isConfigured = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS);

const transporter = isConfigured
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
  : null;

if (isConfigured) {
  logger.info("Email service configured");
} else {
  logger.info("Email service not configured — set SMTP_HOST, SMTP_USER, SMTP_PASS to enable");
}

export async function sendBookingConfirmation(to: string, booking: {
  name: string;
  vendorName: string;
  packageName: string;
  eventDate: string;
  eventType: string;
  advancePaid: boolean;
  advanceAmount: number;
}) {
  if (!transporter) return;
  try {
    await transporter.sendMail({
      from: `Book My Squad <${FROM_EMAIL}>`,
      to,
      subject: `Booking Confirmed — ${booking.vendorName}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;background:#080604;color:#fff;padding:32px;border:1px solid rgba(212,175,55,0.3);border-radius:4px;">
          <div style="margin-bottom:24px;">
            <span style="font-family:serif;font-size:22px;color:#d4af37;letter-spacing:0.1em;">Book My Squad</span>
          </div>
          <h2 style="color:#d4af37;font-size:20px;margin:0 0 8px;">Booking Confirmed ✦</h2>
          <p style="color:#aaa;margin:0 0 24px;font-size:14px;">Hi ${booking.name}, your booking has been received. Here's a summary:</p>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr style="border-bottom:1px solid rgba(255,255,255,0.06);">
              <td style="padding:10px 0;color:#888;font-size:13px;width:40%;">Vendor</td>
              <td style="padding:10px 0;color:#d4af37;font-size:13px;font-weight:600;">${booking.vendorName}</td>
            </tr>
            <tr style="border-bottom:1px solid rgba(255,255,255,0.06);">
              <td style="padding:10px 0;color:#888;font-size:13px;">Package</td>
              <td style="padding:10px 0;color:#fff;font-size:13px;">${booking.packageName}</td>
            </tr>
            <tr style="border-bottom:1px solid rgba(255,255,255,0.06);">
              <td style="padding:10px 0;color:#888;font-size:13px;">Event Type</td>
              <td style="padding:10px 0;color:#fff;font-size:13px;">${booking.eventType}</td>
            </tr>
            <tr style="border-bottom:1px solid rgba(255,255,255,0.06);">
              <td style="padding:10px 0;color:#888;font-size:13px;">Event Date</td>
              <td style="padding:10px 0;color:#fff;font-size:13px;">${booking.eventDate}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#888;font-size:13px;">Advance</td>
              <td style="padding:10px 0;font-size:13px;color:${booking.advancePaid ? "#50e3c2" : "#aaa"};">${booking.advancePaid ? `₹${booking.advanceAmount.toLocaleString("en-IN")} paid (refundable)` : "Not paid — pending confirmation"}</td>
            </tr>
          </table>
          <p style="color:#666;font-size:12px;border-top:1px solid rgba(255,255,255,0.06);padding-top:16px;">
            Questions? Reply to this email or visit <a href="https://bookmysquad.in" style="color:#d4af37;">bookmysquad.in</a>
          </p>
        </div>
      `,
    });
    logger.info({ to, vendorName: booking.vendorName }, "Booking confirmation email sent");

    // Admin notification
    await transporter.sendMail({
      from: `Book My Squad <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `[New Booking] ${booking.vendorName} — ${booking.name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;background:#0d0b08;color:#e5e0d8;padding:32px;border:1px solid rgba(212,175,55,0.3);">
          <h2 style="color:#d4af37;margin:0 0 16px;">New Booking Received</h2>
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <tr><td style="padding:8px 0;color:#a89880;width:35%;">Customer</td><td>${booking.name} &lt;${to}&gt;</td></tr>
            <tr><td style="padding:8px 0;color:#a89880;">Vendor</td><td>${booking.vendorName}</td></tr>
            <tr><td style="padding:8px 0;color:#a89880;">Package</td><td>${booking.packageName}</td></tr>
            <tr><td style="padding:8px 0;color:#a89880;">Event Type</td><td>${booking.eventType}</td></tr>
            <tr><td style="padding:8px 0;color:#a89880;">Event Date</td><td>${booking.eventDate}</td></tr>
            <tr><td style="padding:8px 0;color:#a89880;">Advance</td><td style="color:${booking.advancePaid ? "#50e3c2" : "#aaa"}">${booking.advancePaid ? `₹${booking.advanceAmount.toLocaleString("en-IN")} PAID` : "Not paid"}</td></tr>
          </table>
        </div>`,
    });
    logger.info({ admin: ADMIN_EMAIL }, "Admin booking alert sent");
  } catch (err) {
    logger.error({ err, to }, "Failed to send booking confirmation email");
  }
}

export async function sendEnquiryReceipt(to: string, enquiry: {
  name: string;
  subject: string;
  message: string;
}) {
  if (!transporter) return;
  try {
    await transporter.sendMail({
      from: `Book My Squad <${FROM_EMAIL}>`,
      to,
      subject: `Enquiry Received — ${enquiry.subject}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;background:#080604;color:#fff;padding:32px;border:1px solid rgba(212,175,55,0.3);border-radius:4px;">
          <div style="margin-bottom:24px;">
            <span style="font-family:serif;font-size:22px;color:#d4af37;letter-spacing:0.1em;">Book My Squad</span>
          </div>
          <h2 style="color:#d4af37;font-size:20px;margin:0 0 8px;">Enquiry Received ✦</h2>
          <p style="color:#aaa;margin:0 0 20px;font-size:14px;">Hi ${enquiry.name}, we've received your enquiry and will get back to you within 24 hours.</p>
          <div style="background:rgba(212,175,55,0.05);border-left:2px solid #d4af37;padding:14px 18px;margin-bottom:24px;">
            <p style="color:#888;font-size:11px;margin:0 0 6px;text-transform:uppercase;letter-spacing:0.1em;">Your message</p>
            <p style="color:#ddd;font-size:13px;margin:0;line-height:1.6;">${enquiry.message}</p>
          </div>
          <p style="color:#666;font-size:12px;border-top:1px solid rgba(255,255,255,0.06);padding-top:16px;">
            Team Book My Squad · <a href="https://bookmysquad.in" style="color:#d4af37;">bookmysquad.in</a>
          </p>
        </div>
      `,
    });
    logger.info({ to, subject: enquiry.subject }, "Enquiry receipt email sent");

    // Admin notification
    await transporter.sendMail({
      from: `Book My Squad <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `[New Enquiry] ${enquiry.subject} — ${enquiry.name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;background:#0d0b08;color:#e5e0d8;padding:32px;border:1px solid rgba(212,175,55,0.3);">
          <h2 style="color:#d4af37;margin:0 0 16px;">New Enquiry Received</h2>
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <tr><td style="padding:8px 0;color:#a89880;width:30%;">From</td><td>${enquiry.name} &lt;${to}&gt;</td></tr>
            <tr><td style="padding:8px 0;color:#a89880;">Type</td><td>${enquiry.subject}</td></tr>
          </table>
          <div style="margin-top:16px;background:rgba(212,175,55,0.05);border-left:2px solid #d4af37;padding:14px 18px;">
            <p style="color:#ddd;font-size:13px;margin:0;line-height:1.6;">${enquiry.message}</p>
          </div>
        </div>`,
    });
    logger.info({ admin: ADMIN_EMAIL }, "Admin enquiry alert sent");
  } catch (err) {
    logger.error({ err, to }, "Failed to send enquiry receipt email");
  }
}
