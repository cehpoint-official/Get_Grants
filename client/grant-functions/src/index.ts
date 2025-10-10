import { onDocumentCreated, onDocumentWritten } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { onMessagePublished } from "firebase-functions/v2/pubsub";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { https } from "firebase-functions/v1";
import axios from "axios";
import { defineSecret } from "firebase-functions/params";
import Razorpay from "razorpay";
import { PubSub } from "@google-cloud/pubsub";

const geminiApiKey = defineSecret("GEMINI_API_KEY");

admin.initializeApp();
const db = admin.firestore();

const ADMIN_EMAILS: string[] = (process.env.ADMIN_EMAILS || "admin@getgrants.in,kamini9926@gmail.com").split(",").map(e => e.trim());
const WEBSITE_PROCESSING_TOPIC = "website-processing-topic";

const getPremiumUserTokens = async (): Promise<string[]> => {
    const tokens = new Set<string>();
    const now = admin.firestore.Timestamp.now();
    const statusSnap = await db.collection('users').where('subscriptionStatus', 'in', ['premium', 'active']).get();
    statusSnap.forEach(doc => {
        const user = doc.data();
        if (user.fcmToken && user.notificationConsentGiven === true) {
            tokens.add(user.fcmToken);
        }
    });
    const endDateSnap = await db.collection('users').where('subscriptionEndDate', '>', now).get();
    endDateSnap.forEach(doc => {
        const user = doc.data();
        if (user.fcmToken && user.notificationConsentGiven === true) {
            tokens.add(user.fcmToken);
        }
    });
    return Array.from(tokens);
};

export const onUserUpgradeToPremiumV2 = onDocumentWritten("users/{userId}", async (event) => {
    const beforeData = event.data?.before.data();
    const afterData = event.data?.after.data();
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
        setTimeout(async () => {
            try {
                await admin.messaging().send(message);
                logger.info(`Welcome notification sent successfully to ${afterData.fullName}.`);
            } catch (error) {
                logger.error("Error sending welcome notification:", error);
            }
        }, 5000);
    }
});

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
    if (!after || !before) return;
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

interface SourceWebsite {
    id: string;
    name: string;
    url: string;
}

interface ExtractedGrantData {
    title: string;
    organization: string;
    description: string;
    overview: string;
    deadline: string;
    fundingAmount: string;
    eligibility: string;
    applyLink: string;
    category: string;
}

function getGeminiModel() {
    const apiKey = geminiApiKey.value();
    if (!apiKey) {
        logger.error("GEMINI_API_KEY is not available.");
        throw new Error("Missing GEMINI_API_KEY");
    }
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

async function extractGrantLinks(html: string, baseUrl: string): Promise<string[]> {
    try {
        const model = getGeminiModel();
        const prompt = `
        Analyze the following HTML content and extract all grant-related links.
        Look for links that lead to specific grant detail pages, application pages, or grant announcements.
        Base URL: ${baseUrl}
        Return ONLY a JSON array of absolute URLs. Each URL should be a complete, valid URL.
        If no grant links are found, return an empty array.
        HTML Content:
        ${html.substring(0, 10000)}
        `;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const cleanText = text.replace(/```json|```/g, "").trim();
        const links = JSON.parse(cleanText);
        if (Array.isArray(links)) {
            return links.filter(link => typeof link === "string" && link.startsWith("http"));
        }
        return [];
    } catch (error) {
        logger.error("Full error in extractGrantLinks:", error);
        return [];
    }
}

async function extractGrantDetails(html: string, url: string): Promise<ExtractedGrantData | null> {
    try {
        const model = getGeminiModel();
        const prompt = `
        Extract grant information from the following HTML content and return it as a JSON object.
        URL: ${url}
        Extract the following fields:
        - title: Grant title/name
        - organization: Organization offering the grant
        - description: Short description (2-3 sentences)
        - overview: Detailed overview of the grant
        - deadline: Application deadline (format as YYYY-MM-DD if possible)
        - fundingAmount: Funding amount (include currency if mentioned)
        - eligibility: Eligibility criteria
        - applyLink: Application link (use the provided URL if not found)
        - category: Grant category (choose from: Technology, Healthcare, Education, Environment, Sustainability, Fintech, Agriculture, Retail, Diversity, Social)
        Return ONLY a valid JSON object with these exact field names. If any field cannot be determined, use "Not specified".
        HTML Content:
        ${html.substring(0, 15000)}
        `;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const cleanText = text.replace(/```json|```/g, "").trim();
        const grantData = JSON.parse(cleanText);
        if (grantData.title && grantData.organization) {
            return grantData as ExtractedGrantData;
        }
        return null;
    } catch (error) {
        logger.error("Error extracting grant details:", error);
        return null;
    }
}


async function isDuplicateGrant(sourceUrl: string): Promise<boolean> {
  try {
    const snapshot = await db.collection("pendingGrants").where("sourceUrl", "==", sourceUrl).limit(1).get();
    return !snapshot.empty;
  } catch (error) {
    logger.error("Error checking for duplicate grant:", error);
    return false;
  }
}


async function savePendingGrant(grantData: ExtractedGrantData, sourceUrl: string): Promise<void> {
    try {
        let deadlineTimestamp: admin.firestore.Timestamp | null = null;
        if (grantData.deadline && grantData.deadline.toLowerCase() !== 'not specified' && grantData.deadline.toLowerCase() !== 'n/a') {
            try {
                const date = new Date(grantData.deadline);
                if (!isNaN(date.getTime())) {
                    deadlineTimestamp = admin.firestore.Timestamp.fromDate(date);
                } else {
                    logger.warn(`Could not parse deadline string: "${grantData.deadline}". Saving as null.`);
                }
            } catch (e) {
                logger.error(`Error converting deadline string "${grantData.deadline}" to Date:`, e);
            }
        }

        await db.collection("pendingGrants").add({
            ...grantData,
            deadline: deadlineTimestamp,
            sourceUrl,
            status: "pending_review",
            createdAt: admin.firestore.Timestamp.now(),
        });

        logger.info(`Saved pending grant: ${grantData.title}`);
    } catch (error) {
        logger.error("Error saving pending grant:", error);
    }
}

export const smartGrantFinderV2 = onSchedule({
    schedule: "every 24 hours",
    secrets: [geminiApiKey],
    timeoutSeconds: 60,
    memory: "256MiB",
}, async () => {
    logger.info("V3 Starting smart grant discovery orchestration...");
    try {
        const sourceWebsitesSnapshot = await db.collection("sourceWebsites").get();
        if (sourceWebsitesSnapshot.empty) {
            logger.info("No source websites configured. Skipping.");
            return;
        }

        const pubSubClient = new PubSub();

        const websites: SourceWebsite[] = sourceWebsitesSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                url: data.url,
            };
        });

        const promises = websites.map(website => {
            const messageBuffer = Buffer.from(JSON.stringify(website), "utf8");
            return pubSubClient.topic(WEBSITE_PROCESSING_TOPIC).publishMessage({ data: messageBuffer });
        });

        await Promise.all(promises);
        logger.info(`Successfully published ${websites.length} websites to the processing topic.`);
    } catch (error) {
        logger.error("Error in smart grant orchestration:", error);
    }
});

export const processSingleWebsite = onMessagePublished({
    topic: WEBSITE_PROCESSING_TOPIC,
    secrets: [geminiApiKey],
    timeoutSeconds: 540,
    memory: "1GiB",
}, async (event) => {
    try {
        if (!event.data.message.data) {
            logger.error("Received an empty message.");
            return;
        }
        const websiteString = Buffer.from(event.data.message.data, "base64").toString("utf8");
        const website: SourceWebsite = JSON.parse(websiteString);
        logger.info(`Processing website: ${website.name} (${website.url})`);
        const response = await axios.get(website.url, { timeout: 30000, headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" } });
        const html = response.data;
        const grantLinks = await extractGrantLinks(html, website.url);
        logger.info(`Found ${grantLinks.length} potential grant links from ${website.name}`);
        for (const grantUrl of grantLinks) {
            try {
                const isDuplicate = await isDuplicateGrant(grantUrl);
                if (isDuplicate) {
                    logger.info(`Skipping duplicate grant: ${grantUrl}`);
                    continue;
                }
                
                const grantResponse = await axios.get(grantUrl, { timeout: 30000, headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" } });
                const grantHtml = grantResponse.data;
                const grantData = await extractGrantDetails(grantHtml, grantUrl);
                if (grantData) {
                    await savePendingGrant(grantData, grantUrl);
                } else {
                    logger.warn(`Failed to extract grant data from: ${grantUrl}`);
                }
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (linkError) {
                logger.error(`Error processing individual grant link ${grantUrl}:`, linkError);
                continue;
            }
        }
        logger.info(`Finished processing website: ${website.name}`);
    } catch (error) {
        logger.error("Error processing single website from Pub/Sub message:", error);
    }
});

function getRazorpayInstance(): Razorpay {
    // Use test keys for development
    const keyId = process.env.RAZORPAY_KEY_ID || (functions.config()?.razorpay?.key_id as string | undefined) || "rzp_test_RQWXlGknPFoGZP";
    const keySecret = process.env.RAZORPAY_KEY_SECRET || (functions.config()?.razorpay?.key_secret as string | undefined) || "HSCJ2ep0Q6gP1L0Agz6l4p3a";
    if (!keyId || !keySecret) {
        throw new functions.https.HttpsError(
            "failed-precondition",
            "Razorpay credentials are not configured."
        );
    }
    return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export const createOrder = https.onRequest((req, res) => {
    // Set CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.set('Access-Control-Max-Age', '3600');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    const { amount } = req.body;
    if (!amount) {
        res.status(400).send('Amount is required');
        return;
    }

    const currency = "INR";
    const options = {
        amount: amount * 100,
        currency,
        receipt: `receipt_order_${new Date().getTime()}`,
    };

    try {
        const razorpay = getRazorpayInstance();
        razorpay.orders.create(options)
            .then((order: any) => {
                res.status(200).json({ orderId: order.id });
            })
            .catch((error: any) => {
                console.error("Error creating Razorpay order:", error);
                res.status(500).json({ error: "Could not create order." });
            });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ error: "Could not create order." });
    }
});

export const verifyPayment = https.onRequest(async (req, res) => {
    // Set CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.set('Access-Control-Max-Age', '3600');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        plan,
        userId
    } = req.body;

    if (!userId) {
        res.status(401).json({ error: "User ID is required" });
        return;
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !plan) {
        res.status(400).json({ error: "Missing required payment data" });
        return;
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const crypto = require("crypto");
    const keySecret = process.env.RAZORPAY_KEY_SECRET || (functions.config()?.razorpay?.key_secret as string | undefined) || "HSCJ2ep0Q6gP1L0Agz6l4p3a";
    
    if (!keySecret) {
        res.status(500).json({ error: "Razorpay credentials are not configured." });
        return;
    }

    const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        try {
            const userRef = admin.firestore().collection("users").doc(userId);
            await admin.firestore().collection("payments").add({
                userId,
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                planName: plan.name,
                amount: plan.price,
                status: "success",
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });
            
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
            
            res.status(200).json({ status: "success" });
        } catch (error) {
            console.error("Error updating user subscription:", error);
            res.status(500).json({ error: "Failed to update subscription" });
        }
    } else {
        res.status(400).json({ error: "Payment verification failed." });
    }
});

