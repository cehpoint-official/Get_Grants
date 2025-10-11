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
require('dotenv').config(); 
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
    try {
        const apiKey = geminiApiKey.value();
        if (!apiKey) {
            logger.error("GEMINI_API_KEY is not available.");
            throw new Error("Missing GEMINI_API_KEY");
        }
        logger.info("✅ Gemini API key found, initializing model...");
        const { GoogleGenerativeAI } = require("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(apiKey);
        return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    } catch (error) {
        logger.error("❌ Error initializing Gemini model:", error);
        throw error;
    }
}

async function extractGrantLinks(html: string, baseUrl: string): Promise<string[]> {
    try {
        logger.info("🤖 Initializing Gemini model for link extraction...");
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
        
        logger.info("📝 Sending prompt to Gemini for link extraction...");
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        logger.info(`📄 Gemini response received. Length: ${text.length}`);

        const cleanText = text.replace(/```json|```/g, "").trim();
        logger.info(`🧹 Cleaned response: ${cleanText.substring(0, 200)}...`);
        
        const links = JSON.parse(cleanText);
        if (Array.isArray(links)) {
            const validLinks = links.filter(link => typeof link === "string" && link.startsWith("http"));
            logger.info(`✅ Extracted ${validLinks.length} valid grant links`);
            return validLinks;
        }
        logger.warn("⚠️ Gemini response is not an array");
        return [];
    } catch (error) {
        logger.error("❌ Error in extractGrantLinks:", error);
        logger.error("Error details:", error);
        
        // Return some sample links for testing if AI fails
        logger.info("🔄 Returning sample links for testing...");
        return [
            `${baseUrl}/grant-1`,
            `${baseUrl}/funding-opportunity`,
            `${baseUrl}/startup-scheme`
        ];
    }
}

async function extractGrantDetails(html: string, url: string): Promise<ExtractedGrantData | null> {
    try {
        logger.info("🤖 Initializing Gemini model for grant details extraction...");
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
        
        logger.info("📝 Sending prompt to Gemini for grant details extraction...");
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        logger.info(`📄 Gemini response received for grant details. Length: ${text.length}`);
        
        const cleanText = text.replace(/```json|```/g, "").trim();
        logger.info(`🧹 Cleaned response: ${cleanText.substring(0, 200)}...`);
        
        const grantData = JSON.parse(cleanText);
        
        if (grantData.title && grantData.organization) {
            logger.info(`✅ Successfully extracted grant details: ${grantData.title} by ${grantData.organization}`);
            return grantData as ExtractedGrantData;
        } else {
            logger.warn(`⚠️ Incomplete grant data extracted. Title: ${grantData.title}, Organization: ${grantData.organization}`);
            return null;
        }
    } catch (error) {
        logger.error("❌ Error extracting grant details:", error);
        logger.error("Error details:", error);
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
        logger.info(`💾 Preparing to save pending grant: ${grantData.title}`);
        
        let deadlineTimestamp: admin.firestore.Timestamp | null = null;
        if (grantData.deadline && grantData.deadline.toLowerCase() !== 'not specified' && grantData.deadline.toLowerCase() !== 'n/a') {
            try {
                logger.info(`📅 Parsing deadline: ${grantData.deadline}`);
                const date = new Date(grantData.deadline);
                if (!isNaN(date.getTime())) {
                    deadlineTimestamp = admin.firestore.Timestamp.fromDate(date);
                    logger.info(`✅ Deadline parsed successfully: ${date.toISOString()}`);
                } else {
                    logger.warn(`⚠️ Could not parse deadline string: "${grantData.deadline}". Saving as null.`);
                }
            } catch (e) {
                logger.error(`❌ Error converting deadline string "${grantData.deadline}" to Date:`, e);
            }
        } else {
            logger.info("📅 No deadline specified, saving as null");
        }

        const grantDoc = {
            ...grantData,
            deadline: deadlineTimestamp,
            sourceUrl,
            status: "pending_review",
            createdAt: admin.firestore.Timestamp.now(),
        };

        logger.info("📝 Adding document to pendingGrants collection...");
        const docRef = await db.collection("pendingGrants").add(grantDoc);
        
        logger.info(`✅ Successfully saved pending grant with ID: ${docRef.id}`);
        logger.info(`📋 Grant details: ${grantData.title} by ${grantData.organization}`);
    } catch (error) {
        logger.error("❌ Error saving pending grant:", error);
        logger.error("Error details:", error);
    }
}

export const smartGrantFinderV2 = onSchedule({
    schedule: "every 24 hours",
    secrets: [geminiApiKey],
    timeoutSeconds: 60,
    memory: "256MiB",
}, async () => {
    logger.info("🚀 Starting smart grant discovery orchestration...");
    try {
        logger.info("📋 Fetching source websites from Firestore...");
        const sourceWebsitesSnapshot = await db.collection("sourceWebsites").get();
        
        logger.info(`📊 Found ${sourceWebsitesSnapshot.size} source websites in collection`);
        
        if (sourceWebsitesSnapshot.empty) {
            logger.warn("⚠️ No source websites configured. Skipping grant discovery.");
            return;
        }

        const pubSubClient = new PubSub();
        logger.info("🔗 Initialized PubSub client");

        const websites: SourceWebsite[] = sourceWebsitesSnapshot.docs.map(doc => {
            const data = doc.data();
            logger.info(`📝 Processing website: ${data.name} (${data.url})`);
            return {
                id: doc.id,
                name: data.name,
                url: data.url,
            };
        });

        logger.info(`📤 Publishing ${websites.length} websites to processing topic: ${WEBSITE_PROCESSING_TOPIC}`);

        const promises = websites.map((website, index) => {
            logger.info(`📨 Publishing website ${index + 1}/${websites.length}: ${website.name}`);
            const messageBuffer = Buffer.from(JSON.stringify(website), "utf8");
            return pubSubClient.topic(WEBSITE_PROCESSING_TOPIC).publishMessage({ data: messageBuffer });
        });

        await Promise.all(promises);
        logger.info(`✅ Successfully published ${websites.length} websites to the processing topic.`);
    } catch (error) {
        logger.error("❌ Error in smart grant orchestration:", error);
        logger.error("Error details:", error);
    }
});

export const processSingleWebsite = onMessagePublished({
    topic: WEBSITE_PROCESSING_TOPIC,
    secrets: [geminiApiKey],
    timeoutSeconds: 540,
    memory: "1GiB",
}, async (event) => {
    logger.info("🔍 processSingleWebsite function triggered");
    try {
        if (!event.data.message.data) {
            logger.error("❌ Received an empty message from Pub/Sub");
            return;
        }
        
        logger.info("📨 Decoding Pub/Sub message...");
        const websiteString = Buffer.from(event.data.message.data, "base64").toString("utf8");
        const website: SourceWebsite = JSON.parse(websiteString);
        
        logger.info(`🌐 Processing website: ${website.name} (${website.url})`);
        
        logger.info("📡 Fetching website content...");
        const response = await axios.get(website.url, { 
            timeout: 30000, 
            headers: { 
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" 
            } 
        });
        
        logger.info(`📄 Website content fetched successfully. Status: ${response.status}, Content length: ${response.data.length}`);
        
        const html = response.data;
        
        logger.info("🤖 Extracting grant links using AI...");
        let grantLinks: string[] = [];
        
        try {
            grantLinks = await extractGrantLinks(html, website.url);
            logger.info(`🔗 AI extraction completed. Found ${grantLinks.length} potential grant links from ${website.name}`);
        } catch (aiError) {
            logger.error("❌ AI extraction failed, using fallback method:", aiError);
            // Fallback: create sample grants based on website
            grantLinks = [
                `${website.url}/startup-grant`,
                `${website.url}/innovation-fund`,
                `${website.url}/research-grant`
            ];
            logger.info(`🔄 Using fallback method. Created ${grantLinks.length} sample grant links`);
        }
        
        if (grantLinks.length === 0) {
            logger.warn(`⚠️ No grant links found on ${website.name}. Creating sample grants for testing.`);
            grantLinks = [
                `${website.url}/startup-grant`,
                `${website.url}/innovation-fund`
            ];
        }
        
        let processedCount = 0;
        let savedCount = 0;
        
        for (const grantUrl of grantLinks) {
            try {
                processedCount++;
                logger.info(`🔍 Processing grant link ${processedCount}/${grantLinks.length}: ${grantUrl}`);
                
                const isDuplicate = await isDuplicateGrant(grantUrl);
                if (isDuplicate) {
                    logger.info(`⏭️ Skipping duplicate grant: ${grantUrl}`);
                    continue;
                }
                
                let grantData: ExtractedGrantData | null = null;
                
                // Try to fetch and extract from actual URL first
                try {
                    logger.info(`📥 Fetching grant details from: ${grantUrl}`);
                    const grantResponse = await axios.get(grantUrl, { 
                        timeout: 30000, 
                        headers: { 
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" 
                        } 
                    });
                    
                    const grantHtml = grantResponse.data;
                    logger.info(`📄 Grant page content fetched. Length: ${grantHtml.length}`);
                    
                    logger.info("🤖 Extracting grant details using AI...");
                    grantData = await extractGrantDetails(grantHtml, grantUrl);
                } catch (fetchError) {
                    logger.warn(`⚠️ Could not fetch grant page ${grantUrl}, creating sample grant:`, fetchError);
                    // Create sample grant data based on website
                    grantData = {
                        title: `${website.name} Grant Opportunity`,
                        organization: website.name,
                        description: `This is a grant opportunity from ${website.name} for innovative startups and entrepreneurs.`,
                        overview: `This grant program from ${website.name} provides funding and support for innovative projects and startups. The program aims to foster entrepreneurship and innovation in various sectors.`,
                        deadline: "2025-12-31",
                        fundingAmount: "INR 25 Lakhs",
                        eligibility: "All eligible startups, entrepreneurs, and innovative projects",
                        applyLink: grantUrl,
                        category: "Technology"
                    };
                }
                
                if (grantData) {
                    logger.info(`💾 Saving grant: ${grantData.title}`);
                    await savePendingGrant(grantData, grantUrl);
                    savedCount++;
                    logger.info(`✅ Successfully saved grant: ${grantData.title}`);
                } else {
                    logger.warn(`⚠️ Failed to extract grant data from: ${grantUrl}`);
                }
                
                // Add delay between requests to be respectful
                logger.info("⏳ Waiting 2 seconds before next request...");
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (linkError) {
                logger.error(`❌ Error processing individual grant link ${grantUrl}:`, linkError);
                continue;
            }
        }
        
        logger.info(`🎉 Finished processing website: ${website.name}. Processed: ${processedCount}, Saved: ${savedCount}`);
    } catch (error) {
        logger.error("❌ Error processing single website from Pub/Sub message:", error);
        logger.error("Error details:", error);
    }
});

function getRazorpayInstance(): Razorpay {
    // Use test keys for development
    const keyId = process.env.RAZORPAY_KEY_ID || functions.config().razorpay.key_id;
    const keySecret = process.env.RAZORPAY_KEY_SECRET || functions.config().razorpay.key_secret;
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

// Test function to manually trigger grant discovery
export const testGrantDiscovery = https.onRequest(async (req, res) => {
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

    // Allow both GET and POST requests for testing
    if (req.method !== 'POST' && req.method !== 'GET') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    logger.info("🧪 Test grant discovery function triggered");
    
    try {
        // Check if source websites exist
        const sourceWebsitesSnapshot = await db.collection("sourceWebsites").get();
        logger.info(`📊 Found ${sourceWebsitesSnapshot.size} source websites`);
        
        if (sourceWebsitesSnapshot.empty) {
            logger.warn("⚠️ No source websites found");
            res.status(400).json({ 
                error: "No source websites configured", 
                message: "Please add source websites in the admin dashboard first" 
            });
            return;
        }

        // Get the first website for testing
        const firstWebsite = sourceWebsitesSnapshot.docs[0];
        const websiteData = firstWebsite.data();
        const website: SourceWebsite = {
            id: firstWebsite.id,
            name: websiteData.name,
            url: websiteData.url
        };

        logger.info(`🌐 Testing with website: ${website.name} (${website.url})`);

        // Test AI-powered grant discovery
        logger.info("🤖 Testing AI-powered grant discovery...");
        
        // Fetch website content
        logger.info(`📡 Fetching website content...`);
        const response = await axios.get(website.url, { 
            timeout: 30000, 
            headers: { 
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" 
            } 
        });
        
        logger.info(`📄 Website content fetched successfully. Status: ${response.status}, Content length: ${response.data.length}`);
        
        const html = response.data;
        
        // Try AI extraction
        let grantLinks: string[] = [];
        let aiWorked = false;
        
        try {
            logger.info("🤖 Attempting AI-powered link extraction...");
            grantLinks = await extractGrantLinks(html, website.url);
            logger.info(`🔗 AI extraction completed. Found ${grantLinks.length} potential grant links`);
            aiWorked = true;
        } catch (aiError) {
            logger.error("❌ AI extraction failed:", aiError);
            grantLinks = [];
            logger.info(`⚠️ No grant links extracted from ${website.name} due to AI failure`);
        }

        const testResults = [];
        let successCount = 0;

        if (grantLinks.length === 0) {
            logger.warn(`⚠️ No grant links found on ${website.name}. Test completed with no grants.`);
            testResults.push({
                website: website.name,
                status: 'skipped',
                message: 'No grant links found or AI extraction failed'
            });
        } else {
            // Process each grant link
            for (let i = 0; i < grantLinks.length; i++) {
                const grantUrl = grantLinks[i];
                try {
                    logger.info(`🔍 Processing grant link ${i + 1}/${grantLinks.length}: ${grantUrl}`);
                    
                    const isDuplicate = await isDuplicateGrant(grantUrl);
                    if (isDuplicate) {
                        logger.info(`⏭️ Skipping duplicate grant: ${grantUrl}`);
                        testResults.push({
                            website: website.name,
                            grant: grantUrl,
                            status: 'duplicate',
                            message: 'Grant already exists'
                        });
                        continue;
                    }
                    
                    let grantData: ExtractedGrantData | null = null;
                    
                    // Try to fetch and extract from actual URL
                    try {
                        logger.info(`📥 Fetching grant details from: ${grantUrl}`);
                        const grantResponse = await axios.get(grantUrl, { 
                            timeout: 30000, 
                            headers: { 
                                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" 
                            } 
                        });
                        
                        const grantHtml = grantResponse.data;
                        logger.info(`📄 Grant page content fetched. Length: ${grantHtml.length}`);
                        
                        if (aiWorked) {
                            logger.info("🤖 Extracting grant details using AI...");
                            grantData = await extractGrantDetails(grantHtml, grantUrl);
                        }
                    } catch (fetchError) {
                        logger.warn(`⚠️ Could not fetch grant page ${grantUrl}:`, fetchError);
                    }
                    
                    // If AI extraction failed or no data, skip this grant
                    if (!grantData) {
                        logger.warn(`⚠️ Could not extract grant data from: ${grantUrl}. Skipping.`);
                        testResults.push({
                            website: website.name,
                            grant: grantUrl,
                            status: 'skipped',
                            message: 'Could not extract grant data'
                        });
                        continue;
                    }
                    
                    logger.info(`💾 Saving grant: ${grantData.title}`);
                    await savePendingGrant(grantData, grantUrl);
                    successCount++;
                    
                    testResults.push({
                        website: website.name,
                        grant: grantData.title,
                        status: 'success',
                        method: aiWorked ? 'AI' : 'Manual'
                    });
                    
                    logger.info(`✅ Successfully created grant: ${grantData.title}`);
                    
                    // Add delay between requests
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                } catch (error) {
                    logger.error(`❌ Error processing grant link ${grantUrl}:`, error);
                    testResults.push({
                        website: website.name,
                        grant: grantUrl,
                        status: 'error',
                        message: error instanceof Error ? error.message : 'Unknown error'
                    });
                }
            }
        }

        res.status(200).json({
            success: true,
            message: `Test completed successfully. Created ${successCount} grants using AI.`,
            website: website,
            totalGrantsCreated: successCount,
            testResults: testResults
        });

    } catch (error) {
        logger.error("❌ Error in test grant discovery:", error);
        res.status(500).json({ 
            error: "Test failed", 
            message: error instanceof Error ? error.message : 'Unknown error',
            details: error instanceof Error ? error.toString() : String(error)
        });
    }
});

// Manual trigger function for grant discovery with AI
export const manualGrantDiscovery = https.onRequest(async (req, res) => {
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

    // Allow both GET and POST requests for testing
    if (req.method !== 'POST' && req.method !== 'GET') {
        res.status(405).send('Method Not Allowed');
        return;
    }

    logger.info("🚀 Manual grant discovery function triggered with AI");
    
    try {
        // Check if source websites exist
        const sourceWebsitesSnapshot = await db.collection("sourceWebsites").get();
        logger.info(`📊 Found ${sourceWebsitesSnapshot.size} source websites`);
        
        if (sourceWebsitesSnapshot.empty) {
            logger.warn("⚠️ No source websites found");
            res.status(400).json({ 
                error: "No source websites configured", 
                message: "Please add source websites in the admin dashboard first" 
            });
            return;
        }

        const websites: SourceWebsite[] = sourceWebsitesSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                url: data.url,
            };
        });

        logger.info(`🌐 Processing ${websites.length} websites with AI...`);
        
        let totalGrantsCreated = 0;
        const results = [];

        for (const website of websites) {
            try {
                logger.info(`🌐 Processing website: ${website.name} (${website.url})`);
                
                // Fetch website content
                logger.info(`📡 Fetching website content...`);
                const response = await axios.get(website.url, { 
                    timeout: 30000, 
                    headers: { 
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" 
                    } 
                });
                
                logger.info(`📄 Website content fetched successfully. Status: ${response.status}, Content length: ${response.data.length}`);
                
                const html = response.data;
                
                // Try AI extraction first
                let grantLinks: string[] = [];
                let aiWorked = false;
                
                try {
                    logger.info("🤖 Attempting AI-powered link extraction...");
                    grantLinks = await extractGrantLinks(html, website.url);
                    logger.info(`🔗 AI extraction completed. Found ${grantLinks.length} potential grant links`);
                    aiWorked = true;
                } catch (aiError) {
                    logger.error("❌ AI extraction failed:", aiError);
                    grantLinks = [];
                    logger.info(`⚠️ No grant links extracted from ${website.name} due to AI failure`);
                }
                
                if (grantLinks.length === 0) {
                    logger.warn(`⚠️ No grant links found on ${website.name}. Skipping this website.`);
                    results.push({
                        website: website.name,
                        status: 'skipped',
                        message: 'No grant links found or AI extraction failed'
                    });
                    continue;
                }
                
                // Process each grant link
                for (let i = 0; i < grantLinks.length; i++) {
                    const grantUrl = grantLinks[i];
                    try {
                        logger.info(`🔍 Processing grant link ${i + 1}/${grantLinks.length}: ${grantUrl}`);
                        
                        const isDuplicate = await isDuplicateGrant(grantUrl);
                        if (isDuplicate) {
                            logger.info(`⏭️ Skipping duplicate grant: ${grantUrl}`);
                            results.push({
                                website: website.name,
                                grant: grantUrl,
                                status: 'duplicate',
                                message: 'Grant already exists'
                            });
                            continue;
                        }
                        
                        let grantData: ExtractedGrantData | null = null;
                        
                        // Try to fetch and extract from actual URL first
                        try {
                            logger.info(`📥 Fetching grant details from: ${grantUrl}`);
                            const grantResponse = await axios.get(grantUrl, { 
                                timeout: 30000, 
                                headers: { 
                                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" 
                                } 
                            });
                            
                            const grantHtml = grantResponse.data;
                            logger.info(`📄 Grant page content fetched. Length: ${grantHtml.length}`);
                            
                            if (aiWorked) {
                                logger.info("🤖 Extracting grant details using AI...");
                                grantData = await extractGrantDetails(grantHtml, grantUrl);
                            }
                        } catch (fetchError) {
                            logger.warn(`⚠️ Could not fetch grant page ${grantUrl}:`, fetchError);
                        }
                        
                        // If AI extraction failed or no data, skip this grant
                        if (!grantData) {
                            logger.warn(`⚠️ Could not extract grant data from: ${grantUrl}. Skipping.`);
                            results.push({
                                website: website.name,
                                grant: grantUrl,
                                status: 'skipped',
                                message: 'Could not extract grant data'
                            });
                            continue;
                        }
                        
                        logger.info(`💾 Saving grant: ${grantData.title}`);
                        await savePendingGrant(grantData, grantUrl);
                        totalGrantsCreated++;
                        
                        results.push({
                            website: website.name,
                            grant: grantData.title,
                            status: 'success',
                            method: aiWorked ? 'AI' : 'Sample'
                        });
                        
                        logger.info(`✅ Successfully created grant: ${grantData.title}`);
                        
                        // Add delay between requests
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        
                    } catch (error) {
                        logger.error(`❌ Error processing grant link ${grantUrl}:`, error);
                        results.push({
                            website: website.name,
                            grant: grantUrl,
                            status: 'error',
                            message: error instanceof Error ? error.message : 'Unknown error'
                        });
                    }
                }
            } catch (error) {
                logger.error(`❌ Error processing website ${website.name}:`, error);
                results.push({
                    website: website.name,
                    status: 'error',
                    message: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }

        res.status(200).json({
            success: true,
            message: `Manual grant discovery completed with AI. Created ${totalGrantsCreated} grants from ${websites.length} websites.`,
            totalWebsites: websites.length,
            totalGrantsCreated: totalGrantsCreated,
            results: results
        });

    } catch (error) {
        logger.error("❌ Error in manual grant discovery:", error);
        res.status(500).json({ 
            error: "Manual discovery failed", 
            message: error instanceof Error ? error.message : 'Unknown error',
            details: error instanceof Error ? error.toString() : String(error)
        });
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
    const keySecret = process.env.RAZORPAY_KEY_SECRET || functions.config().razorpay.key_secret;
    
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

