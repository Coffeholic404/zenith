import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Auth Result from API
export interface AuthResult {
  token: string;
  expiresAt: string;
  refreshToken: string;
  role: string;
}

export interface User {
  id: string;
  result: AuthResult;
  type: string;
  full_name: string;
  email: string;
  isActive: boolean;
  role: string;
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
declare module 'next-auth' {
  interface Session {
    user: User;
    error?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: User;
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    error?: string;
  }
}

async function refreshAccessToken(token: any) {
  try {
    const response = await fetch(`${process.env.BASIC_URL}/api/Account/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        refreshToken: token.refreshToken
      })
    });

    const data = await response.json();

    if (!response.ok || !data.isSuccess) {
      throw new Error('Failed to refresh token');
    }

    const newExpiresAt = new Date(data.result.expiresAt).getTime();

    return {
      ...token,
      accessToken: data.result.token,
      refreshToken: data.result.refreshToken,
      expiresAt: newExpiresAt,
      user: {
        ...token.user,
        role: data.result.role || token.user.role,
        result: {
          token: data.result.token,
          refreshToken: data.result.refreshToken,
          expiresAt: data.result.expiresAt,
          role: data.result.role || token.user.result.role
        }
      }
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError'
    };
  }
}

const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60 // 7 days (to allow refresh token to work)
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials: any): Promise<User | null> {
        try {
          const { data } = credentials;
          const parsedData = JSON.parse(data);

          if (!parsedData || !parsedData.isSuccess) {
            throw new Error('Invalid response data');
          }

          const result = parsedData.result;

          // Create user object with token info
          const user: User = {
            id: result.token, // Using token as ID since we don't have a user ID
            result: {
              token: result.token,
              refreshToken: result.refreshToken,
              expiresAt: result.expiresAt,
              role: result.role
            },
            type: 'credentials',
            full_name: '',
            email: '',
            isActive: true,
            role: result.role,
            roles: []
          };

          return user;
        } catch (err) {
          console.error('Authorization error:', err);
          throw new Error('Login Failed');
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        const customUser = user as User;
        token.user = customUser;
        token.accessToken = customUser.result.token;
        token.refreshToken = customUser.result.refreshToken;
        token.expiresAt = new Date(customUser.result.expiresAt).getTime();
      }

      // Return previous token if the access token has not expired yet
      const now = Date.now();
      const bufferTime = 60 * 1000; // 1 minute buffer before expiry

      if (token.expiresAt && now < token.expiresAt - bufferTime) {
        return token;
      }

      // Access token has expired, try to refresh it
      console.log('Access token expired, refreshing...');
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user = token.user as User;

      // Update session with latest token info
      if (session.user && session.user.result) {
        session.user.result.token = token.accessToken as string;
        session.user.result.refreshToken = token.refreshToken as string;
      }

      // Pass error to client if refresh failed
      if (token.error) {
        session.error = token.error as string;
      }

      return session;
    }
  },
  pages: {
    signIn: '/login'
  },
  debug: process.env.NODE_ENV === 'development'
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST, authOptions };
