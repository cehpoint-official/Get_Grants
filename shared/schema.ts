import { z } from "zod";

// --- User & Payment Schemas ---

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  fullName: z.string().optional(),
  phoneNumber: z.string().optional(),
  createdAt: z.date(),
  savedGrants: z.array(z.string()).optional(),
  subscriptionPlan: z.string().optional().default('Free'),
  subscriptionStatus: z.string().optional().default('Inactive'),
  subscriptionExpiresOn: z.date().optional().nullable(),
});

export const insertUserSchema = userSchema.omit({ id: true, createdAt: true });

export const paymentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  date: z.date(),
  amount: z.number(),
  status: z.string(),
  plan: z.string(),
});

// --- Blog Post Schemas ---

export const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  category: z.string(),
  author: z.string(),
  imageUrl: z.string().optional(),
  createdAt: z.date(),
  published: z.boolean().default(true),
  status: z.enum(["pending", "published", "rejected"]).optional().default("published"),
  authorName: z.string().optional(),
  authorEmail: z.string().email().optional(),
});

export const insertPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  author: z.string().min(1, "Author is required"),
  imageUrl: z.string().optional(),
  status: z.enum(["pending", "published", "rejected"]).optional(),
  authorName: z.string().optional(),
  authorEmail: z.string().email().optional(),
});


// --- Grant & Application Schemas ---

export const grantSchema = z.object({
  id: z.string(),
  title: z.string(),
  organization: z.string(),
  status: z.enum(["Active", "Expired", "Upcoming", "Closing Soon"]),
  description: z.string(),
  overview: z.string(),
  startDate: z.date().optional(),
  deadline: z.date(),
  fundingAmount: z.string(),
  eligibility: z.string(),
  documents: z.array(z.object({ title: z.string(), description: z.string(), required: z.boolean() })),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
  contactEmail: z.string().email(),
  applyLink: z.string().url(),
  category: z.string(),
  createdAt: z.date(),
  isPremium: z.boolean().default(false),
});

export const insertGrantSchema = z.object({
  title: z.string().min(3, "Title is required"),
  organization: z.string().min(3, "Organization is required"),
  description: z.string().min(20, "Short description is required (min 20 chars)"),
  overview: z.string().min(50, "Grant overview is required (min 50 chars)"),
  startDate: z.string().optional(),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  fundingAmount: z.string().min(1, "Funding amount is required"),
  eligibility: z.string().min(20, "Eligibility criteria are required"),
  documents: z.array(z.object({ title: z.string().min(1, "Title is required"), description: z.string().min(1, "Description is required"), required: z.boolean() })).min(1, "At least one document is required"),
  faqs: z.array(z.object({ question: z.string().min(1), answer: z.string().min(1) })).optional(),
  contactEmail: z.string().email("A valid contact email is required"),
  applyLink: z.string().url("A valid application URL is required"),
  category: z.string().min(1, "Category is required"),
  isPremium: z.boolean().optional(),
});

export const applicationSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  email: z.string().email(),
  helpDescription: z.string().min(1, "This field is required"),
  supportAreas: z.array(z.string()),
  submittedAt: z.union([z.date(), z.any()]),
  status: z.string().optional().default('Pending'),
  userId: z.string().optional(),
  startupName: z.string().optional(),
  founderName: z.string().optional(),
  stage: z.string().optional(),
  sector: z.string().optional(),
  dpiit: z.string().optional(),
});

export const insertApplicationSchema = applicationSchema.omit({ id: true, submittedAt: true });


// --- Calendar Event Schemas ---

export const eventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional().default(""),
  start: z.date(),
  end: z.date(),
  allDay: z.boolean().default(false),
  location: z.string().optional(),
  createdAt: z.date(),
});

export const insertEventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  start: z.union([z.date(), z.string()]),
  end: z.union([z.date(), z.string()]),
  allDay: z.boolean().optional(),
  location: z.string().optional(),
});

// --- Inquiry Schemas ---
export const premiumInquirySchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    companyName: z.string().optional(),
    currentPlan: z.string(),
    budget: z.string(),
    timeline: z.string(),
    specificNeeds: z.string(),
    message: z.string().optional(),
    status: z.enum(['new', 'in_progress', 'meeting_scheduled', 'meeting_done', 'responded', 'closed']),
    adminResponse: z.string().optional(),
    userId: z.string().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const inquiryMessageSchema = z.object({
    id: z.string(),
    inquiryId: z.string(),
    sender: z.enum(['user', 'admin']),
    senderId: z.string().optional(),
    text: z.string(),
    createdAt: z.date(),
});

// --- Testimonial Schemas ---
export const testimonialSchema = z.object({
    id: z.string(),
    author: z.string(),
    title: z.string(),
    quote: z.string(),
    amountSecured: z.string(),
    createdAt: z.date(),
});

export const insertTestimonialSchema = testimonialSchema.omit({ id: true, createdAt: true });


// --- All Types ---
export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Payment = z.infer<typeof paymentSchema>;
export type Post = z.infer<typeof postSchema>;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Application = z.infer<typeof applicationSchema>;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Grant = z.infer<typeof grantSchema>;
export type InsertGrant = z.infer<typeof insertGrantSchema>;
export type CalendarEvent = z.infer<typeof eventSchema>;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type InquiryMessage = z.infer<typeof inquiryMessageSchema>;
export type PremiumInquiry = z.infer<typeof premiumInquirySchema>;
export type Testimonial = z.infer<typeof testimonialSchema>;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;