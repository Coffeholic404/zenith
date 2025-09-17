import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextResponse } from "next/server";

export interface User {
    id: string;
    result: any;
    type: string;
    full_name: string;
    email: string;
    isActive: boolean;
    roles: Array<{
        resource: string;
        resource_ar: string;
        icon: string;
        permissions: Array<{
            action: string;
            possession: string;
        }>;
    }>;
}

// Extend the default NextAuth types
declare module "next-auth" {
    interface Session {
        user: User;
    }
    interface JWT {
        user: User;
    }
}

const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 24 hours
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {},
            async authorize(credentials: any): Promise<User | null> {
                try {
                    const { data } = credentials;
                    const user: User = JSON.parse(data);
                    if (!user) throw new Error("Invalid user data");
                    return user;
                } catch (err) {
                    throw new Error("Login Failed");
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.user = user;
            return token;
        },
        async session({ session, token }) {
            session.user = token.user as User;
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST, authOptions };
