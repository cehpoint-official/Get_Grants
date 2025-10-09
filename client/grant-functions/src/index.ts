import { onDocumentCreated, onDocumentWritten } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { https } from "firebase-functions/v1";
import axios from "axios";
import { defineSecret } from "firebase-functions/params";

import Razorpay from "razorpay";

// Define the secret parameter for Gemini API key
const geminiApiKey = defineSecret("GEMINI_API_KEY");

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



// =================================================================
// ================== SMART GRANT FINDER ===========================
// =================================================================

/**
 * Interface for source website documents
 */
interface SourceWebsite {
  id: string;
  name: string;
  url: string;
}


/**
 * Interface for AI-extracted grant data
 */
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
  const rawKey = (geminiApiKey.value?.() ?? geminiApiKey.value()) as string | undefined;
  const apiKey = (rawKey || "").trim();

  if (!apiKey) {
    logger.error("GEMINI_API_KEY is empty or not provided. Skipping AI extraction.");
    throw new Error("Missing GEMINI_API_KEY");
  }
  // mask all but last 4 characters for diagnostics
  const masked = apiKey.length >= 8 ? `${"*".repeat(apiKey.length - 4)}${apiKey.slice(-4)}` : "****";
  logger.info(`Using GEMINI_API_KEY (masked): ${masked} | length=${apiKey.length}`);

  const { GoogleGenerativeAI } = require("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(apiKey);
  // ===========================================
  // === YAHAN PAR BADLAAV KIYA GAYA HAI ===
  // ===========================================
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
}

/**
 * Call Google Gemini API to extract grant links from a website
 */
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
    ${html.substring(0, 10000)} // Limit to first 10k chars to avoid token limits
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse the JSON response
    const cleanText = text.replace(/```json|```/g, '').trim();
    const links = JSON.parse(cleanText);
    
    if (Array.isArray(links)) {
      return links.filter(link => typeof link === 'string' && link.startsWith('http'));
    }
    
    return [];
  } catch (error) {
    logger.error("Error extracting grant links:", error);
    return [];
  }
}

/**
 * Call Google Gemini API to extract grant details from a grant page
 */
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
    ${html.substring(0, 15000)} // Limit to first 15k chars
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse the JSON response
    const cleanText = text.replace(/```json|```/g, '').trim();
    const grantData = JSON.parse(cleanText);
    
    // Validate required fields
    if (grantData.title && grantData.organization) {
      return grantData as ExtractedGrantData;
    }
    
    return null;
  } catch (error) {
    logger.error("Error extracting grant details:", error);
    return null;
  }
}

/**
 * Check if a grant with the given sourceUrl already exists in pendingGrants
 */
async function isDuplicateGrant(sourceUrl: string): Promise<boolean> {
  try {
    const snapshot = await db.collection('pendingGrants')
      .where('sourceUrl', '==', sourceUrl)
      .limit(1)
      .get();
    
    return !snapshot.empty;
  } catch (error) {
    logger.error("Error checking for duplicate grant:", error);
    return false;
  }
}

/**
 * Save extracted grant data to pendingGrants collection
 */
async function savePendingGrant(grantData: ExtractedGrantData, sourceUrl: string): Promise<void> {
  try {
    await db.collection('pendingGrants').add({
      ...grantData,
      sourceUrl,
      status: "pending_review",
      createdAt: admin.firestore.Timestamp.now(),
    });
    
    logger.info(`Saved pending grant: ${grantData.title}`);
  } catch (error) {
    logger.error("Error saving pending grant:", error);
  }
}

/**
 * Smart Grant Finder - Scheduled Cloud Function
 * Runs every 24 hours to discover new grants from source websites
 */
export const smartGrantFinder = onSchedule(
  { schedule: "every 24 hours", secrets: [geminiApiKey] },
  async () => {
    logger.info("Starting smart grant discovery process...");
    
    try {
      // Step 1: Fetch all source websites
      const sourceWebsitesSnapshot = await db.collection('sourceWebsites').get();
      
      if (sourceWebsitesSnapshot.empty) {
        logger.info("No source websites configured. Skipping grant discovery.");
        return;
      }
      
      const sourceWebsites: SourceWebsite[] = sourceWebsitesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as SourceWebsite));
      
      logger.info(`Found ${sourceWebsites.length} source websites to process`);
      
      // Step 2: Process each source website
      for (const website of sourceWebsites) {
        try {
          logger.info(`Processing website: ${website.name} (${website.url})`);
          
          // Fetch the main page HTML
          const response = await axios.get(website.url, {
            timeout: 30000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
          });
          
          const html = response.data;
          
          // Step 3: Extract grant links using AI
          const grantLinks = await extractGrantLinks(html, website.url);
          logger.info(`Found ${grantLinks.length} potential grant links from ${website.name}`);
          
          // Step 4: Process each grant link
          for (const grantUrl of grantLinks) {
            try {
              // Check if this grant already exists
              const isDuplicate = await isDuplicateGrant(grantUrl);
              if (isDuplicate) {
                logger.info(`Skipping duplicate grant: ${grantUrl}`);
                continue;
              }
              
              // Fetch the grant detail page
              const grantResponse = await axios.get(grantUrl, {
                timeout: 30000,
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
              });
              
              const grantHtml = grantResponse.data;
              
              // Step 5: Extract grant details using AI
              const grantData = await extractGrantDetails(grantHtml, grantUrl);
              
              if (grantData) {
                // Step 6: Save as pending grant
                await savePendingGrant(grantData, grantUrl);
                logger.info(`Successfully processed grant: ${grantData.title}`);
              } else {
                logger.warn(`Failed to extract grant data from: ${grantUrl}`);
              }
              
              // Add a small delay to avoid overwhelming the target websites
              await new Promise(resolve => setTimeout(resolve, 2000));
              
            } catch (error) {
              logger.error(`Error processing grant URL ${grantUrl}:`, error);
              continue;
            }
          }
          
        } catch (error) {
          logger.error(`Error processing website ${website.name}:`, error);
          continue;
        }
      }
      
      logger.info("Smart grant discovery process completed successfully");
      
    } catch (error) {
      logger.error("Error in smart grant discovery process:", error);
    }
  }
);

// =================================================================
// ================== EXISTING FUNCTIONS ===========================
// =================================================================

// client/grant-functions/src/index.ts



// ... (aapka existing code)

function getRazorpayInstance(): Razorpay {
  const keyId = process.env.RAZORPAY_KEY_ID || (functions.config()?.razorpay?.key_id as string | undefined);
  const keySecret = process.env.RAZORPAY_KEY_SECRET || (functions.config()?.razorpay?.key_secret as string | undefined);

  if (!keyId || !keySecret) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Razorpay credentials are not configured."
    );
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

// Function to create a Razorpay order
export const createOrder = https.onCall(async (request) => {
    const amount = request.data.amount;
    const currency = "INR";

    const options = {
        amount: amount * 100, // amount in the smallest currency unit
        currency,
        receipt: `receipt_order_${new Date().getTime()}`,
    };

    try {
        const razorpay = getRazorpayInstance();
        const order = await razorpay.orders.create(options);
        return { orderId: order.id };
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        throw new functions.https.HttpsError("internal", "Could not create order.");
    }
});

// Function to verify the payment
export const verifyPayment = https.onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }
  
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    plan,
  } = request.data;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const crypto = require("crypto");
    const keySecret = process.env.RAZORPAY_KEY_SECRET || (functions.config()?.razorpay?.key_secret as string | undefined);
    if (!keySecret) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Razorpay credentials are not configured."
      );
    }

    const expectedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(body.toString())
        .digest("hex");

    if (expectedSignature === razorpay_signature) {
        // Payment is successful
        const userId = request.auth.uid;
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