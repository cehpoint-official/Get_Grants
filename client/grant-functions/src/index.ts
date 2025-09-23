import { onDocumentCreated, onDocumentWritten } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

const ADMIN_EMAILS: string[] = (process.env.ADMIN_EMAILS || "admin@getgrants.in,kamini9926@gmail.com,aroranir12@gmail.com").split(",").map(e => e.trim());

export const notifyAdminNewPremiumInquiry = onDocumentCreated(
  "premiumInquiries/{inquiryId}",
  async (event) => {
    const inquiryData = event.data?.data();
    if (!inquiryData) {
      logger.error("No inquiry data found for new premium inquiry.");
      return;
    }

    logger.info(`New premium support inquiry received: ${event.params.inquiryId}`);

    try {
      const adminUsersSnap = await db.collection('users').where('email', 'in', ADMIN_EMAILS).get();
      
      const tokens: string[] = [];
      adminUsersSnap.forEach(doc => {
        const user = doc.data();
        if (user.fcmToken) {
          tokens.push(user.fcmToken);
        }
      });

      if (tokens.length > 0) {
        const message = {
          notification: {
            title: "📬 New Premium Inquiry",
            body: `Inquiry from ${inquiryData.name}. Please respond within 24 hours.`,
          },
          tokens: tokens,
        };

        const response = await admin.messaging().sendEachForMulticast(message);
        logger.info(`Successfully sent ${response.successCount} notifications to admins for new inquiry.`);
      }
    } catch (error) {
      logger.error(`Error sending notifications to admin for inquiry ${event.params.inquiryId}:`, error);
    }
  }
);

export const notifyUserAdminResponse = onDocumentCreated(
  "premiumInquiries/{inquiryId}/messages/{messageId}",
  async (event) => {
    const messageData = event.data?.data();
    const inquiryId = event.params.inquiryId;

    if (!messageData || messageData.sender !== 'admin') {
      return;
    }

    logger.info(`Admin response sent for inquiry: ${inquiryId}`);

    try {
      const inquiryDoc = await db.collection('premiumInquiries').doc(inquiryId).get();
      const inquiryData = inquiryDoc.data();

      if (inquiryData && inquiryData.userId) {
        const userDoc = await db.collection('users').doc(inquiryData.userId).get();
        const userData = userDoc.data();

        if (userData && userData.fcmToken) {
          const message = {
            notification: {
              title: `💬 Reply from Get Grants Support`,
              body: `You have a new message regarding your inquiry.`,
            },
            token: userData.fcmToken,
          };
          
          await admin.messaging().send(message);
          logger.info(`Successfully sent notification to user ${inquiryData.userId} for admin response.`);
        }
      }
    } catch (error) {
      logger.error(`Error sending notification to user for inquiry ${inquiryId}:`, error);
    }
  }
);

export const notifyPremiumUsersOnNewGrant = onDocumentCreated("grants/{grantId}", async (event) => {
  const grant = event.data?.data();
  if (!grant) {
    logger.error("No grant data found");
    return;
  }

  try {
    const now = admin.firestore.Timestamp.now();
    const tokens: string[] = [];

    // Users with premium-like status
    const statusSnap = await db.collection('users')
      .where('subscriptionStatus', 'in', ['premium', 'active'])
      .get();
    statusSnap.forEach(doc => {
      const user = doc.data();
      if (user.fcmToken && user.notificationConsentGiven === true) tokens.push(user.fcmToken);
    });

    // Users with active subscriptionEndDate
    const endDateSnap = await db.collection('users')
      .where('subscriptionEndDate', '>', now)
      .get();
    endDateSnap.forEach(doc => {
      const user = doc.data();
      if (user.fcmToken && user.notificationConsentGiven === true) tokens.push(user.fcmToken);
    });

    if (tokens.length > 0) {
      const message = {
        notification: {
          title: `🚀 New Grant Added: ${grant.title}`,
          body: `Funding Amount: ${grant.fundingAmount}. Check it out now!`,
        },
        tokens: tokens,
      };

      const response = await admin.messaging().sendEachForMulticast(message);
      logger.info(`Successfully sent ${response.successCount} notifications for new grant ${event.params.grantId}`);
    }
  } catch (e) {
    logger.error('notifyPremiumUsersOnNewGrant error', e);
  }
});

export const notifyPremiumUsersOnNewPost = onDocumentCreated("posts/{postId}", async (event) => {
  // Replaced by onDocumentWritten below to also handle publish updates
  const post = event.data?.data();
  if (!post || post.status !== 'published') return;
  try {
    const now = admin.firestore.Timestamp.now();
    const tokens: string[] = [];
    const statusSnap = await db.collection('users').where('subscriptionStatus', 'in', ['premium', 'active']).get();
    statusSnap.forEach(doc => { const u = doc.data(); if (u.fcmToken && u.notificationConsentGiven === true) tokens.push(u.fcmToken); });
    const endDateSnap = await db.collection('users').where('subscriptionEndDate', '>', now).get();
    endDateSnap.forEach(doc => { const u = doc.data(); if (u.fcmToken && u.notificationConsentGiven === true) tokens.push(u.fcmToken); });
    if (tokens.length > 0) {
      const message = { notification: { title: `✍️ New Blog Post: ${post.title}`, body: `A new article has been published. Read it now on Get Grants!` }, tokens };
      const response = await admin.messaging().sendEachForMulticast(message);
      logger.info(`Successfully sent ${response.successCount} notifications for new post ${event.params.postId}`);
    }
  } catch (e) {
    logger.error('notifyPremiumUsersOnNewPost error', e);
  }
});

// Also trigger when an existing post is published (status changes to 'published')
export const notifyPremiumUsersOnPostPublish = onDocumentWritten("posts/{postId}", async (event) => {
  const before = event.data?.before?.data() as any | undefined;
  const after = event.data?.after?.data() as any | undefined;
  if (!after) return;
  const becamePublished = after.status === 'published' && (!before || before.status !== 'published');
  if (!becamePublished) return;

  try {
    const now = admin.firestore.Timestamp.now();
    const tokens: string[] = [];
    const statusSnap = await db.collection('users').where('subscriptionStatus', 'in', ['premium', 'active']).get();
    statusSnap.forEach(doc => { const u = doc.data(); if (u.fcmToken && u.notificationConsentGiven === true) tokens.push(u.fcmToken); });
    const endDateSnap = await db.collection('users').where('subscriptionEndDate', '>', now).get();
    endDateSnap.forEach(doc => { const u = doc.data(); if (u.fcmToken && u.notificationConsentGiven === true) tokens.push(u.fcmToken); });

    if (tokens.length > 0) {
      const message = { notification: { title: `✍️ New Blog Post: ${after.title}`, body: `A new article has been published. Read it now on Get Grants!` }, tokens };
      const response = await admin.messaging().sendEachForMulticast(message);
      logger.info(`Sent ${response.successCount} publish notifications for post ${event.params.postId}`);
    }
  } catch (e) {
    logger.error('notifyPremiumUsersOnPostPublish error', e);
  }
});

export const remindPremiumUsersBeforeExpiry = onSchedule({ schedule: 'every day 09:00' }, async () => {
  const now = admin.firestore.Timestamp.now();
  const inThreeDays = admin.firestore.Timestamp.fromMillis(now.toMillis() + 3 * 24 * 60 * 60 * 1000);
  try {
    const grantsSnap = await db.collection('grants')
      .where('deadline', '>=', now)
      .where('deadline', '<=', inThreeDays)
      .get();

    if (grantsSnap.empty) {
        logger.info("No grants nearing deadline today.");
        return;
    }
    
    const now2 = admin.firestore.Timestamp.now();
    const tokens: string[] = [];
    const statusSnap2 = await db.collection('users').where('subscriptionStatus', 'in', ['premium', 'active']).get();
    statusSnap2.forEach(doc => { const u = doc.data(); if (u.fcmToken && u.notificationConsentGiven === true) tokens.push(u.fcmToken); });
    const endDateSnap2 = await db.collection('users').where('subscriptionEndDate', '>', now2).get();
    endDateSnap2.forEach(doc => { const u = doc.data(); if (u.fcmToken && u.notificationConsentGiven === true) tokens.push(u.fcmToken); });

    if (tokens.length === 0) {
        logger.info("No premium users with FCM tokens to notify.");
        return;
    }

    for (const grantDoc of grantsSnap.docs) {
      const grant = grantDoc.data();
      const message = {
        notification: {
          title: `🔔 Reminder: Deadline Approaching!`,
          body: `The grant "${grant.title}" is closing soon. Apply before the deadline!`,
        },
        tokens: tokens,
      };
      await admin.messaging().sendEachForMulticast(message);
    }

    logger.info(`Sent deadline reminders for ${grantsSnap.size} grants to ${tokens.length} users.`);
  } catch (e) {
    logger.error('remindPremiumUsersBeforeExpiry error', e);
  }
});