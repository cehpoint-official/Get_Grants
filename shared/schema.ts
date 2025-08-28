import { z } from "zod";

// Firebase User schema 
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string().optional(),
  createdAt: z.date(),
});

// Firebase Post schema 
export const postSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  category: z.string(),
  author: z.string(),
  imageUrl: z.string().optional(),
  createdAt: z.date(),
  published: z.boolean().default(true),
});

// Grant structure
export const grantSchema = z.object({
  id: z.string(),
  title: z.string(),
  organization: z.string(),
  status: z.enum(["Active", "Expired"]),
  description: z.string(),
  overview: z.string(),
  deadline: z.date(),
  fundingAmount: z.string(),
  eligibility: z.string(),
  documents: z.array(z.object({ name: z.string(), required: z.boolean() })),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })),
  contactEmail: z.string().email(),
  applyLink: z.string().url(),
  category: z.string(),
  createdAt: z.date(),
});

// Insert schemas for form validation 
export const insertUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().optional(),
});

export const insertPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  author: z.string().min(1, "Author is required"),
  imageUrl: z.string().optional(),
});

//  validate  schema
export const insertGrantSchema = z.object({
  title: z.string().min(3, "Title is required"),
  organization: z.string().min(3, "Organization is required"),
  status: z.enum(["Active", "Expired"]),
  description: z.string().min(20, "Short description is required (min 20 chars)"),
  overview: z.string().min(50, "Grant overview is required (min 50 chars)"),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  fundingAmount: z.string().min(1, "Funding amount is required"),
  eligibility: z.string().min(20, "Eligibility criteria are required"),
  documents: z.array(z.object({ name: z.string().min(1), required: z.boolean() })).min(1, "At least one document is required"),
  faqs: z.array(z.object({ question: z.string().min(1), answer: z.string().min(1) })).optional(),
  contactEmail: z.string().email("A valid contact email is required"),
  applyLink: z.string().url("A valid application URL is required"),
  category: z.string().min(1, "Category is required"),
});

//  Updated Firebase Grant Application Schema 
export const applicationSchema = z.object({
  id: z.string(),
  startupName: z.string(),
  founderName: z.string(),
  phone: z.string(),
  email: z.string().email(),
  stage: z.string(),
  sector: z.string(),
  dpiit: z.string(),
  helpDescription: z.string().min(1, "This field is required"),
  submittedAt: z.union([z.date(), z.any()]),
});

// Types 
export type Application = z.infer<typeof applicationSchema>;
export type User = z.infer<typeof userSchema>;
export type Post = z.infer<typeof postSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertPost = z.infer<typeof insertPostSchema>;
export type Grant = z.infer<typeof grantSchema>; 
export type InsertGrant = z.infer<typeof insertGrantSchema>;