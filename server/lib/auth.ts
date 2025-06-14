import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from '@prisma/extension-accelerate';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
}).$extends(withAccelerate());

export const auth = betterAuth({
  baseURL: process.env.BASE_URL,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  trustedOrigins: [
    'http://localhost:5173',
    'http://127.0.0.1:8787',
    'http://localhost:2020',
    'https://frontend-syndicate.vercel.app',
    'https://pos-syndicate.elitedev.tech',
    'https://backend-syndicate.onrender.com'
  ],
  socialProviders: {
    google: {
      prompt: "select_account", 
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    },
  },
  advanced: {
    useSecureCookies: true,
    defaultCookieAttributes: {
      secure: true, // Required for sameSite: "none"
      httpOnly: true,
      sameSite: "none", // Allows cross-origin cookie sharing
      partitioned: false , // CRITICAL: Must be false for OAuth flows
      path: '/',
    },
  },
});
