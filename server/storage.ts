import type { User, InsertUser } from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = (this.currentId++).toString();
    const user: User = { 
      id,
      email: insertUser.email,
      fullName: insertUser.fullName,
      createdAt: new Date(),
      
      phoneNumber: insertUser.phoneNumber,
      savedGrants: [],
      subscriptionPlan: 'Free',
      subscriptionStatus: 'Inactive',
      subscriptionExpiresOn: null,
    };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();