import { onSchedule } from "firebase-functions/v2/scheduler";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// Yeh function har roz subah 1 baje chalega
export const updategrantstatuses = onSchedule("every 24 hours", async (event) => {
  logger.info("Starting scheduled grant status update.");

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const grantsRef = db.collection("grants");
  const snapshot = await grantsRef.get();
  const batch = db.batch();

  snapshot.forEach(doc => {
      const grant = doc.data();
      if (grant.deadline) {
          const deadline = (grant.deadline as admin.firestore.Timestamp).toDate();
          const startDate = grant.startDate 
              ? (grant.startDate as admin.firestore.Timestamp).toDate() 
              : (grant.createdAt as admin.firestore.Timestamp).toDate();
          
          deadline.setHours(0, 0, 0, 0);
          startDate.setHours(0, 0, 0, 0);

          let newStatus = grant.status;
          const sevenDaysFromNow = new Date();
          sevenDaysFromNow.setDate(now.getDate() + 7);

          if (now > deadline) {
              newStatus = "Expired";
          } else if (now < startDate) {
              newStatus = "Upcoming";
          } else if (deadline <= sevenDaysFromNow) {
              newStatus = "Closing Soon";
          } else {
              newStatus = "Active";
          }

          if (newStatus !== grant.status) {
              const grantDocRef = grantsRef.doc(doc.id);
              batch.update(grantDocRef, { status: newStatus });
              logger.info(`Updating grant ${doc.id} from ${grant.status} to ${newStatus}`);
          }
      }
  });

  try {
    await batch.commit();
    logger.info("Grant statuses updated successfully.");
  } catch (error) {
    logger.error("Error committing batch for grant status updates:", error);
  }
});

// Function to notify admin when a new premium support inquiry is created
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
      // Get admin emails from the database or use hardcoded list
      const adminEmails = [
        'admin@getgrants.in',
        'kamini9926@gmail.com',
        'aroranir12@gmail.com'
      ];

      // Send email notifications to admins
      for (const email of adminEmails) {
        await sendEmailNotification(email, inquiryData, inquiryId);
      }

      // Send SMS notification to primary admin (if SMS service is configured)
      await sendSMSNotification(inquiryData, inquiryId);

      logger.info(`Notifications sent for inquiry ${inquiryId}`);
    } catch (error) {
      logger.error(`Error sending notifications for inquiry ${inquiryId}:`, error);
    }
  }
);

// Function to send email notification to admin
async function sendEmailNotification(adminEmail: string, inquiryData: any, inquiryId: string) {
  // In a real implementation, you would use a service like SendGrid, Mailgun, or AWS SES
  // For now, we'll just log the email content
  
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

Specific Needs:
${inquiryData.specificNeeds}

${inquiryData.message ? `Additional Message:\n${inquiryData.message}` : ''}

Please respond to this inquiry within 24 hours.

---
Get Grants Platform
  `;

  logger.info(`Email notification for ${adminEmail}:`, emailContent);
  
  // TODO: Implement actual email sending service
  // Example with SendGrid:
  // const sgMail = require('@sendgrid/mail');
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  // 
  // const msg = {
  //   to: adminEmail,
  //   from: 'noreply@getgrants.in',
  //   subject: 'New Premium Support Inquiry',
  //   text: emailContent,
  // };
  // 
  // await sgMail.send(msg);
}

// Function to send SMS notification to admin
async function sendSMSNotification(inquiryData: any, inquiryId: string) {
  // In a real implementation, you would use a service like Twilio, AWS SNS, or similar
  // For now, we'll just log the SMS content
  
  const smsContent = `New Premium Support Inquiry from ${inquiryData.name} (${inquiryData.phone}). Plan: ${inquiryData.currentPlan}, Budget: ${inquiryData.budget}. Please check admin dashboard.`;
  
  logger.info(`SMS notification:`, smsContent);
  
  // TODO: Implement actual SMS sending service
  // Example with Twilio:
  // const twilio = require('twilio');
  // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  // 
  // await client.messages.create({
  //   body: smsContent,
  //   from: process.env.TWILIO_PHONE_NUMBER,
  //   to: process.env.ADMIN_PHONE_NUMBER
  // });
}

// Function to notify user when admin responds to their inquiry
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
      // Send email notification to user
      await sendUserEmailNotification(inquiryData.email, inquiryData.adminResponse, inquiryData.name);
      
      // Send SMS notification to user
      await sendUserSMSNotification(inquiryData.phone, inquiryData.name);

      logger.info(`User notifications sent for inquiry ${inquiryId}`);
    } catch (error) {
      logger.error(`Error sending user notifications for inquiry ${inquiryId}:`, error);
    }
  }
);

// Function to send email notification to user
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
  
  // TODO: Implement actual email sending service
}

// Function to send SMS notification to user
async function sendUserSMSNotification(userPhone: string, userName: string) {
  const smsContent = `Hi ${userName}, we've responded to your premium support inquiry. Please check your email for details. - Get Grants Team`;
  
  logger.info(`User SMS notification to ${userPhone}:`, smsContent);
  
  // TODO: Implement actual SMS sending service
}