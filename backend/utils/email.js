import nodemailer from 'nodemailer'

// Uses a Gmail account + App Password (not your normal Gmail password).
// Set EMAIL_USER, EMAIL_PASS, and ADMIN_EMAIL in your .env / Render environment.
let transporter = null

function getTransporter() {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  }
  return transporter
}

// Fails silently (logs a warning) if email isn't configured or sending fails —
// email is a nice-to-have and should never break registration/approval flows.
export async function sendMail(to, subject, html) {
  const t = getTransporter()
  if (!t) {
    console.warn('Email not configured (EMAIL_USER/EMAIL_PASS missing) — skipping:', subject)
    return
  }
  try {
    await t.sendMail({
      from: `"MediNear" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    })
  } catch (err) {
    console.error('Failed to send email:', err.message)
  }
}

export function newApplicationEmail(pharmacy) {
  return {
    subject: `New pharmacy application: ${pharmacy.name}`,
    html: `
      <h2>New pharmacy registered on MediNear</h2>
      <p><strong>${pharmacy.name}</strong> just submitted an application and is waiting for review.</p>
      <ul>
        <li>Owner: ${pharmacy.ownerName || '-'}</li>
        <li>Phone: ${pharmacy.phone}</li>
        <li>Address: ${pharmacy.address}</li>
        <li>Licence number: ${pharmacy.licenceNumber || '-'}</li>
      </ul>
      <p>Log in to the Admin Console to approve or reject it.</p>
    `,
  }
}

export function approvedEmail(pharmacy) {
  return {
    subject: 'Your pharmacy has been approved on MediNear',
    html: `
      <h2>You're live on MediNear!</h2>
      <p>Hi ${pharmacy.ownerName || ''},</p>
      <p><strong>${pharmacy.name}</strong> has been approved. Patients can now find your stock in search.</p>
      <p>Sign in to your dashboard to start managing inventory.</p>
    `,
  }
}

export function rejectedEmail(pharmacy) {
  return {
    subject: 'Update on your MediNear application',
    html: `
      <h2>Application update</h2>
      <p>Hi ${pharmacy.ownerName || ''},</p>
      <p>Unfortunately your application for <strong>${pharmacy.name}</strong> was not approved. If you believe this is a mistake, please contact support.</p>
    `,
  }
}
