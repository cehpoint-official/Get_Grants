import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import sgMail from "@sendgrid/mail";
import twilio from "twilio";

admin.initializeApp();
const db = admin.firestore();

// Configure external providers with placeholders
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || "YOUR_SENDGRID_API_KEY_HERE";
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || "YOUR_SENDGRID_FROM_EMAIL_HERE";
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "YOUR_TWILIO_ACCOUNT_SID_HERE";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "YOUR_TWILIO_AUTH_TOKEN_HERE";
const TWILIO_FROM_NUMBER = process.env.TWILIO_FROM_NUMBER || "+1YOUR_TWILIO_NUMBER_HERE";
const ADMIN_EMAILS: string[] = (process.env.ADMIN_EMAILS || "YOUR_ADMIN_EMAIL_1_HERE,YOUR_ADMIN_EMAIL_2_HERE").split(",").map(e => e.trim());
const ADMIN_PHONE = process.env.ADMIN_PHONE || "+1YOUR_ADMIN_PHONE_HERE";

try { if (SENDGRID_API_KEY && !SENDGRID_API_KEY.startsWith("YOUR_")) sgMail.setApiKey(SENDGRID_API_KEY); } catch {}
const twilioClient = (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && !TWILIO_ACCOUNT_SID.startsWith("YOUR_"))
  ? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
  : null as any;

export const notifyAdminNewPremiumInquiry = onDocumentCreated(
  "premiumInquiries/{inquiryId}",
  async (event) => {
    const inquiryData = event.data?.data();
    const inquiryId = event.params.inquiryId;

    if (!inquiryData) {
      logger.error("No inquiry data found");
      return;
    }

    logger.info(`New premium support inquiry received: ${inquiryId}`);

    try {
      for (const email of ADMIN_EMAILS) {
        await sendEmailToAdmin(email, inquiryData, inquiryId);
      }
      await sendSMS(ADMIN_PHONE, `New Premium Inquiry ${inquiryId}: ${inquiryData.name} ${inquiryData.phone}`);

      logger.info(`Notifications sent for inquiry ${inquiryId}`);
    } catch (error) {
      logger.error(`Error sending notifications for inquiry ${inquiryId}:`, error);
    }
  }
);

async function sendEmailToAdmin(adminEmail: string, inquiryData: any, inquiryId: string) {
  const emailContent = `
    New Premium Support Inquiry Received!

    Inquiry ID: ${inquiryId}
    Name: ${inquiryData.name}
    Email: ${inquiryData.email}
    Phone: ${inquiryData.phone}
    Company: ${inquiryData.companyName || 'N/A'}
    Current Plan: ${inquiryData.currentPlan}
    Budget: ${inquiryData.budget}
    Timeline: ${inquiryData.timeline}
    Specific Needs: ${inquiryData.specificNeeds}
    ${inquiryData.message ? `Additional Message:\n${inquiryData.message}` : ''}

    Please respond to this inquiry within 24 hours.
    ---
    Get Grants Platform
  `;

  if (!SENDGRID_API_KEY.startsWith("YOUR_") && !SENDGRID_FROM_EMAIL.startsWith("YOUR_")) {
    await sgMail.send({
      to: adminEmail,
      from: SENDGRID_FROM_EMAIL,
      subject: `New Premium Inquiry: ${inquiryId}`,
      text: emailContent,
    });
  } else {
    logger.info(`(DRY-RUN) Email to ${adminEmail}:`, emailContent);
  }
}

async function sendSMS(to: string, body: string) {
  if (twilioClient && !TWILIO_FROM_NUMBER.startsWith("+1YOUR_")) {
    await twilioClient.messages.create({ to, from: TWILIO_FROM_NUMBER, body });
  } else {
    logger.info(`(DRY-RUN) SMS to ${to}: ${body}`);
  }
}

export const notifyUserAdminResponse = onDocumentCreated(
  "premiumInquiries/{inquiryId}",
  async (event) => {
    const inquiryData = event.data?.data();
    const inquiryId = event.params.inquiryId;

    if (!inquiryData || inquiryData.status !== 'responded' || !inquiryData.adminResponse) {
      return;
    }

    logger.info(`Admin response sent for inquiry: ${inquiryId}`);

    try {
      await sendEmailToUser(inquiryData.email, inquiryData.adminResponse, inquiryData.name);
      await sendSMS(inquiryData.phone, `Hi ${inquiryData.name}, we've responded to your premium inquiry. Please check your email. - Get Grants`);
      logger.info(`User notifications sent for inquiry ${inquiryId}`);
    } catch (error) {
      logger.error(`Error sending user notifications for inquiry ${inquiryId}:`, error);
    }
  }
);

async function sendEmailToUser(userEmail: string, adminResponse: string, userName: string) {
  const emailContent = `
    Hello ${userName},

    Thank you for your premium support inquiry. Our team has responded to your request:

    ${adminResponse}

    If you have any further questions, please don't hesitate to contact us.

    Best regards,
    Get Grants Support Team
    ---
    Get Grants Platform
  `;
  if (!SENDGRID_API_KEY.startsWith("YOUR_") && !SENDGRID_FROM_EMAIL.startsWith("YOUR_")) {
    await sgMail.send({
      to: userEmail,
      from: SENDGRID_FROM_EMAIL,
      subject: `We've responded to your Premium Support inquiry`,
      text: emailContent,
    });
  } else {
    logger.info(`(DRY-RUN) User email to ${userEmail}:`, emailContent);
  }
}

// New Grant → notify premium users
export const notifyPremiumUsersOnNewGrant = onDocumentCreated("grants/{grantId}", async (event) => {
  const grant = event.data?.data();
  const grantId = event.params.grantId;
  if (!grant) return;

  try {
    const premiumUsersSnap = await db.collection('users').where('subscriptionStatus', '==', 'premium').get();
    const emails: string[] = [];
    const phones: string[] = [];
    premiumUsersSnap.forEach(doc => {
      const u = doc.data();
      if (u.notifyEmail && u.email) emails.push(u.email);
      if (u.notifyWhatsapp && u.phone) phones.push(u.phone);
    });

    const subject = `New Grant: ${grant.title}`;
    const text = `A new grant has been added:\n\nTitle: ${grant.title}\nOrg: ${grant.organization || 'N/A'}\nFunding: ${grant.fundingAmount || 'N/A'}\nDeadline: ${grant.deadline || 'N/A'}\nStatus: ${grant.status || 'N/A'}\n\nOpen the app to view full details.`;

    for (const email of emails) {
      await sendGenericEmail(email, subject, text);
    }
    for (const phone of phones) {
      await sendSMS(phone, `New grant: ${grant.title}. Deadline: ${grant.deadline || 'N/A'}.`);
    }
    logger.info(`Notified ${emails.length} emails and ${phones.length} phones for new grant ${grantId}`);
  } catch (e) {
    logger.error('notifyPremiumUsersOnNewGrant error', e);
  }
});

async function sendGenericEmail(to: string, subject: string, text: string) {
  if (!SENDGRID_API_KEY.startsWith("YOUR_") && !SENDGRID_FROM_EMAIL.startsWith("YOUR_")) {
    await sgMail.send({ to, from: SENDGRID_FROM_EMAIL, subject, text });
  } else {
    logger.info(`(DRY-RUN) Email to ${to}: ${subject}\n${text}`);
  }
}

// Scheduled job for expiry reminders (runs daily at 09:00 UTC)
export const remindPremiumUsersBeforeExpiry = onSchedule({ schedule: 'every day 09:00' }, async () => {
  const now = admin.firestore.Timestamp.now();
  const inThreeDays = admin.firestore.Timestamp.fromMillis(now.toMillis() + 3 * 24 * 60 * 60 * 1000);
  try {
    const grantsSnap = await db.collection('grants')
      .where('deadline', '>=', now)
      .where('deadline', '<=', inThreeDays)
      .get();

    if (grantsSnap.empty) return;

    const premiumUsersSnap = await db.collection('users').where('subscriptionStatus', '==', 'premium').get();
    const emails: string[] = [];
    const phones: string[] = [];
    premiumUsersSnap.forEach(doc => {
      const u = doc.data();
      if (u.notifyEmail && u.email) emails.push(u.email);
      if (u.notifyWhatsapp && u.phone) phones.push(u.phone);
    });

    for (const grantDoc of grantsSnap.docs) {
      const grant = grantDoc.data();
      const subject = `Reminder: ${grant.title} deadline approaching`;
      const text = `The grant "${grant.title}" is closing soon. Deadline: ${grant.deadline}.\n\nOpen Get Grants to apply in time.`;
      for (const email of emails) await sendGenericEmail(email, subject, text);
      for (const phone of phones) await sendSMS(phone, `Reminder: ${grant.title} deadline ${grant.deadline}`);
    }

    logger.info(`Sent expiry reminders for ${grantsSnap.size} grants to ${emails.length} emails and ${phones.length} phones.`);
  } catch (e) {
    logger.error('remindPremiumUsersBeforeExpiry error', e);
  }
});