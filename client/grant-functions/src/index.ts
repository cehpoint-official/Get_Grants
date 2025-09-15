import { onSchedule } from "firebase-functions/v2/scheduler";
import { onDocumentCreated, onDocumentWritten } from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import { onCall } from "firebase-functions/v2/https";
import * as functions from "firebase-functions";
import { google } from "googleapis";

admin.initializeApp();
const db = admin.firestore();

// --- GOOGLE SHEETS & DOCS SETUP ---
// 1. Apne Google Cloud Project mein "Google Sheets API" aur "Google Docs API" enable karein.
// 2. Ek service account banayein aur uski JSON key file download karein.
// 3. Us JSON key file ko apne functions directory mein rakhein (e.g., service-account.json).
// 4. Neeche diye gaye `auth` object mein `keyFile` ka path sahi karein.
// 5. Ek Google Sheet aur ek Google Doc banayein aur unki ID neeche `SHEET_ID` aur `DOCUMENT_ID` mein daalein.
// 6. Us Sheet aur Doc ko service account ke email address ke saath "Editor" ke role mein share karein.

const auth = new google.auth.GoogleAuth({
  keyFile: "./service-account.json", // <-- Service account key ka path
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/documents",
  ],
});

const sheets = google.sheets({ version: "v4", auth });
const docs = google.docs({ version: "v1", auth });

const SHEET_ID = "YOUR_GOOGLE_SHEET_ID"; // <-- Apni Google Sheet ki ID yahan daalein
const DOCUMENT_ID = "YOUR_GOOGLE_DOC_ID"; // <-- Apne Google Doc ki ID yahan daalein

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
}

// Function to send SMS notification to admin
async function sendSMSNotification(inquiryData: any, inquiryId: string) {
  // In a real implementation, you would use a service like Twilio, AWS SNS, or similar
  // For now, we'll just log the SMS content
  
  const smsContent = `New Premium Support Inquiry from ${inquiryData.name} (${inquiryData.phone}). Plan: ${inquiryData.currentPlan}, Budget: ${inquiryData.budget}. Please check admin dashboard.`;
  
  logger.info(`SMS notification:`, smsContent);
  
  // TODO: Implement actual SMS sending service
}

// Function to notify user when admin responds to their inquiry
export const notifyUserAdminResponse = onDocumentWritten(
  "premiumInquiries/{inquiryId}",
  async (event) => {
    const inquiryDataBefore = event.data?.before.data();
    const inquiryDataAfter = event.data?.after.data();
    const inquiryId = event.params.inquiryId;

    if (!inquiryDataAfter || inquiryDataAfter.status !== 'responded' || !inquiryDataAfter.adminResponse) {
      return;
    }

    // Check if the status has just been changed to 'responded'
    if (inquiryDataBefore?.status === 'responded' && inquiryDataAfter.status === 'responded') {
        // If the status was already 'responded', do not send another notification
        return;
    }

    logger.info(`Admin response sent for inquiry: ${inquiryId}`);

    try {
      // Send email notification to user
      await sendUserEmailNotification(inquiryDataAfter.email, inquiryDataAfter.adminResponse, inquiryDataAfter.name);
      
      // Send SMS notification to user
      await sendUserSMSNotification(inquiryDataAfter.phone, inquiryDataAfter.name);

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

// New function to save contact form messages
export const saveContactMessage = onCall(async (request) => {
    if (!request.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "You must be logged in to send a message."
        );
    }

    const { name, email, subject, message } = request.data;
    const uid = request.auth.uid;

    if (!name || !email || !subject || !message) {
        throw new functions.https.HttpsError(
            "invalid-argument",
            "Please fill out all fields."
        );
    }

    try {
        const docRef = await db.collection("contactMessages").add({
            name,
            email,
            subject,
            message,
            userId: uid,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return { success: true, messageId: docRef.id };
    } catch (error) {
        logger.error("Error saving contact message:", error);
        throw new functions.https.HttpsError(
            "internal",
            "There was an error sending your message. Please try again."
        );
    }
});

// New trigger to update Google Sheets/Docs when a contact message is created
export const onContactMessageCreate = onDocumentCreated("contactMessages/{messageId}", async (event) => {
    const messageData = event.data?.data();
    if (!messageData) {
        logger.error("No data found for the new contact message.");
        return;
    }
    
    const { name, email, subject, message, createdAt } = messageData;
    const submissionDate = createdAt.toDate().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
    
    // 1. Append data to Google Sheet
    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: "Sheet1!A:E", // Assuming data will go in columns A to E
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[submissionDate, name, email, subject, message]],
            },
        });
        logger.info(`Successfully appended data to Google Sheet for message from ${email}`);
    } catch (error) {
        logger.error("Error updating Google Sheet:", error);
    }

    // 2. Prepend data to Google Doc
    try {
        const requests = [{
            insertText: {
                location: { index: 1 }, // This will add text at the beginning of the document
                text: `--- New Submission ---\nDate: ${submissionDate}\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}\n\n`,
            },
        }];
        await docs.documents.batchUpdate({
            documentId: DOCUMENT_ID,
            requestBody: { requests },
        });
        logger.info(`Successfully updated Google Doc for message from ${email}`);
    } catch (error) {
        logger.error("Error updating Google Doc:", error);
    }
});