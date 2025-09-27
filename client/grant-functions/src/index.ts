import { onDocumentCreated, onDocumentWritten } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

import Razorpay from "razorpay";

admin.initializeApp();
const db = admin.firestore();

const ADMIN_EMAILS: string[] = (process.env.ADMIN_EMAILS || "admin@getgrants.in,kamini9926@gmail.com,aroranir12@gmail.com").split(",").map(e => e.trim());

/**
 * Helper Function: Retrieves FCM tokens for all active premium users.
 * This avoids repeating the same query logic in multiple functions.
 * @returns A promise that resolves to an array of unique FCM tokens.
 */
const getPremiumUserTokens = async (): Promise<string[]> => {
    const tokens = new Set<string>();
    const now = admin.firestore.Timestamp.now();

    // Query 1: Users with a specific premium status
    const statusSnap = await db.collection('users')
      .where('subscriptionStatus', 'in', ['premium', 'active'])
      .get();
    statusSnap.forEach(doc => {
        const user = doc.data();
        if (user.fcmToken && user.notificationConsentGiven === true) {
            tokens.add(user.fcmToken);
        }
    });

    // Query 2: Users with a future subscription end date
    const endDateSnap = await db.collection('users')
      .where('subscriptionEndDate', '>', now)
      .get();
    endDateSnap.forEach(doc => {
        const user = doc.data();
        if (user.fcmToken && user.notificationConsentGiven === true) {
            tokens.add(user.fcmToken);
        }
    });

    return Array.from(tokens);
};

// =================================================================
// ============== NEW & UPDATED NOTIFICATION LOGIC =================
// =================================================================

/**
 * FEATURE: Send a welcome notification when a user's subscriptionStatus becomes 'premium'.
 */
export const onUserUpgradeToPremiumV2 = onDocumentWritten("users/{userId}", async (event) => {
    const beforeData = event.data?.before.data();
    const afterData = event.data?.after.data();

    // Proceed only if the document was updated and data exists
    if (!beforeData || !afterData) {
        return;
    }

    const justBecamePremium = afterData.subscriptionStatus === 'premium' && beforeData.subscriptionStatus !== 'premium';
    
    if (justBecamePremium && afterData.fcmToken) {
        logger.info(`User ${afterData.fullName} upgraded to premium. Sending welcome notification.`);

        const message = {
            notification: {
                title: "🎉 Welcome to Premium!",
                body: "Thank you for subscribing. You now have access to all premium features.",
            },
            token: afterData.fcmToken,
        };
        
        // Using a timeout to prevent the notification from feeling too instantaneous
        setTimeout(async () => {
            try {
                await admin.messaging().send(message);
                logger.info(`Welcome notification sent successfully to ${afterData.fullName}.`);
            } catch (error) {
                logger.error("Error sending welcome notification:", error);
            }
        }, 5000); // 5-second delay
    }
});


/**
 * Notify premium users when a new grant is created.
 */
export const notifyPremiumUsersOnNewGrantV2 = onDocumentCreated("grants/{grantId}", async (event) => {
    const grant = event.data?.data();
    if (!grant) {
        logger.error("No grant data found");
        return;
    }

    try {
        const tokens = await getPremiumUserTokens();
        if (tokens.length > 0) {
            const message = {
                notification: {
                    title: `🚀 New Grant Added: ${grant.title}`,
                    body: `Funding Amount: ${grant.fundingAmount}. Check it out now!`,
                },
                tokens,
            };
            const response = await admin.messaging().sendEachForMulticast(message);
            logger.info(`Successfully sent ${response.successCount} notifications for new grant ${event.params.grantId}`);
        }
    } catch (e) {
        logger.error('notifyPremiumUsersOnNewGrant error', e);
    }
});

// =================================================================
// ================= EXISTING NOTIFICATION LOGIC ===================
// =================================================================
// (Your other functions remain below, now using the helper function where applicable)


export const notifyAdminNewPremiumInquiryV2 = onDocumentCreated("premiumInquiries/{inquiryId}", async (event) => {
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
});

export const notifyUserAdminResponseV2 = onDocumentCreated("premiumInquiries/{inquiryId}/messages/{messageId}", async (event) => {
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
});

export const notifyPremiumUsersOnPostPublishV2 = onDocumentWritten("posts/{postId}", async (event) => {
    const before = event.data?.before?.data();
    const after = event.data?.after?.data();
    if (!after) return;
    const becamePublished = after.status === 'published' && (!before || before.status !== 'published');
    if (!becamePublished) return;

    try {
        const tokens = await getPremiumUserTokens();
        if (tokens.length > 0) {
            const message = {
                notification: {
                    title: `✍️ New Blog Post: ${after.title}`,
                    body: `A new article has been published. Read it now on Get Grants!`
                },
                tokens
            };
            const response = await admin.messaging().sendEachForMulticast(message);
            logger.info(`Sent ${response.successCount} publish notifications for post ${event.params.postId}`);
        }
    } catch (e) {
        logger.error('notifyPremiumUsersOnPostPublish error', e);
    }
});

export const remindPremiumUsersBeforeExpiryV2 = onSchedule({ schedule: 'every day 09:00' }, async () => {
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

        const tokens = await getPremiumUserTokens();
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

export const notifyPremiumUsersOnGrantUpdateV2 = onDocumentWritten("grants/{grantId}", async (event) => {
    const before = event.data?.before?.data();
    const after = event.data?.after?.data();
    if (!after || !before) return; // Only handle updates

    const changedFields: string[] = [];
    if (before.title !== after.title) changedFields.push('title');
    if (before.deadline?.toMillis() !== after.deadline?.toMillis()) changedFields.push('deadline');
    if (before.fundingAmount !== after.fundingAmount) changedFields.push('funding amount');
    
    if (changedFields.length === 0) return;

    try {
        const tokens = await getPremiumUserTokens();
        if (tokens.length === 0) return;

        const changedText = `The ${changedFields.join(', ')} has been updated.`;
        const message = {
            notification: {
                title: `✏️ Grant Updated: ${after.title}`,
                body: `${changedText} Check the latest details.`,
            },
            tokens,
        };
        const response = await admin.messaging().sendEachForMulticast(message);
        logger.info(`Sent ${response.successCount} grant update notifications for ${event.params.grantId}`);
    } catch (e) {
        logger.error('notifyPremiumUsersOnGrantUpdate error', e);
    }
});



// client/grant-functions/src/index.ts



// ... (aapka existing code)

const razorpay = new Razorpay({
    key_id: functions.config().razorpay.key_id,
    key_secret: functions.config().razorpay.key_secret,
});

// Function to create a Razorpay order
export const createOrder = functions.https.onCall(async (data, context) => {
    const amount = data.amount;
    const currency = "INR";

    const options = {
        amount: amount * 100, // amount in the smallest currency unit
        currency,
        receipt: `receipt_order_${new Date().getTime()}`,
    };

    try {
        const order = await razorpay.orders.create(options);
        return { orderId: order.id };
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        throw new functions.https.HttpsError("internal", "Could not create order.");
    }
});

// Function to verify the payment
export const verifyPayment = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "You must be logged in.");
    }

    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        plan, // { name, price, duration }
    } = data;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const crypto = require("crypto");
    const expectedSignature = crypto
        .createHmac("sha256", functions.config().razorpay.key_secret)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        // Payment is successful
        const userId = context.auth.uid;
        const userRef = admin.firestore().collection("users").doc(userId);

        // 1. Save payment details
        await admin.firestore().collection("payments").add({
            userId,
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            planName: plan.name,
            amount: plan.price,
            status: "success",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // 2. Update user's subscription
        const subscriptionEndDate = new Date();
        if (plan.duration === "1-Month") {
            subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
        } else if (plan.duration === "3-Month") {
            subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 3);
        }

        await userRef.update({
            subscriptionStatus: "premium",
            subscriptionPlan: plan.name,
            subscriptionEndDate: admin.firestore.Timestamp.fromDate(subscriptionEndDate),
        });

        return { status: "success" };
    } else {
        throw new functions.https.HttpsError("invalid-argument", "Payment verification failed.");
    }
});