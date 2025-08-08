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

// ✅ Updated Firebase Grant Application Schema
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

export type Application = z.infer<typeof applicationSchema>;
export type User = z.infer<typeof userSchema>;
export type Post = z.infer<typeof postSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertPost = z.infer<typeof insertPostSchema>;
