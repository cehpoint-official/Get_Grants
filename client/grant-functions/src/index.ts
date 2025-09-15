import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

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
      const adminEmails = [
        'admin@getgrants.in',
        'kamini9926@gmail.com',
        'aroranir12@gmail.com'
      ];

      for (const email of adminEmails) {
        await sendEmailNotification(email, inquiryData, inquiryId);
      }

      await sendSMSNotification(inquiryData, inquiryId);

      logger.info(`Notifications sent for inquiry ${inquiryId}`);
    } catch (error) {
      logger.error(`Error sending notifications for inquiry ${inquiryId}:`, error);
    }
  }
);

async function sendEmailNotification(adminEmail: string, inquiryData: any, inquiryId: string) {
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

  logger.info(`Email notification for ${adminEmail}:`, emailContent);
}

async function sendSMSNotification(inquiryData: any, inquiryId: string) {
  const smsContent = `New Premium Support Inquiry from ${inquiryData.name} (${inquiryData.phone}). Plan: ${inquiryData.currentPlan}, Budget: ${inquiryData.budget}. Please check admin dashboard.`;
  
  logger.info(`SMS notification:`, smsContent);
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
      await sendUserEmailNotification(inquiryData.email, inquiryData.adminResponse, inquiryData.name);
      await sendUserSMSNotification(inquiryData.phone, inquiryData.name);
      logger.info(`User notifications sent for inquiry ${inquiryId}`);
    } catch (error) {
      logger.error(`Error sending user notifications for inquiry ${inquiryId}:`, error);
    }
  }
);

async function sendUserEmailNotification(userEmail: string, adminResponse: string, userName: string) {
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

  logger.info(`User email notification for ${userEmail}:`, emailContent);
}

async function sendUserSMSNotification(userPhone: string, userName: string) {
  const smsContent = `Hi ${userName}, we've responded to your premium support inquiry. Please check your email for details. - Get Grants Team`;
  
  logger.info(`User SMS notification to ${userPhone}:`, smsContent);
}