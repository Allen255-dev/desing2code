import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";

// Helper function to check if database is available
async function isDatabaseAvailable() {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return true;
    } catch (error) {
        console.error('[NextAuth] Database connection check failed:', error);
        return false;
    }
}

export const authOptions: NextAuthOptions = {
    // Conditionally use adapter - will be undefined if DB is unavailable
    adapter: process.env.DATABASE_URL ? (PrismaAdapter(prisma) as any) : undefined,
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID ?? "",
            clientSecret: process.env.GITHUB_SECRET ?? "",
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log('[NextAuth] Authorize attempt for email:', credentials?.email);
                if (!credentials?.email || !credentials?.password) {
                    console.log('[NextAuth] Missing credentials');
                    return null;
                }

                try {
                    // Check if database is available
                    const dbAvailable = await isDatabaseAvailable();

                    if (!dbAvailable) {
                        console.log('[NextAuth] Database unavailable, using mock user for development');
                        // Return a mock user for development when DB is down
                        return {
                            id: 'dev-user-' + credentials.email.replace(/[^a-zA-Z0-9]/g, '-'),
                            email: credentials.email,
                            name: credentials.email.split('@')[0],
                            plan: 'starter',
                            role: 'developer',
                        };
                    }

                    // Database is available, proceed normally
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email }
                    });

                    if (!user) {
                        console.log('[NextAuth] User not found, creating new user');
                        const newUser = await prisma.user.create({
                            data: {
                                email: credentials.email,
                                name: credentials.email.split('@')[0],
                            }
                        });
                        console.log('[NextAuth] User created successfully');
                        return newUser;
                    }

                    console.log('[NextAuth] User found, returning user');
                    return user;
                } catch (error) {
                    console.error('[NextAuth] Error in authorize callback:', error);
                    // Fallback to mock user on any error
                    console.log('[NextAuth] Falling back to mock user due to error');
                    return {
                        id: 'dev-user-' + credentials.email.replace(/[^a-zA-Z0-9]/g, '-'),
                        email: credentials.email,
                        name: credentials.email.split('@')[0],
                        plan: 'starter',
                        role: 'developer',
                    };
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login',
        error: '/login',
    },
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id;
                token.plan = user.plan || 'starter';
                token.role = user.role || 'developer';
            }
            return token;
        },
        async session({ session, token }: any) {
            if (session.user) {
                session.user.id = token.id;
                session.user.plan = token.plan;
                session.user.role = token.role;
            }
            return session;
        },
    },
};
