import NextAuth, { type NextAuthOptions } from 'next-auth';
import TwitchProvider from 'next-auth/providers/twitch';
import { getOrCreateUser, upsertTwitchAccount } from '@/lib/database';
import type { User } from 'next-auth';

if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET) {
  throw new Error('Missing Twitch OAuth configuration');
}

export const authOptions: NextAuthOptions = {
  providers: [
    TwitchProvider({
      clientId: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email || !account) return false;

      try {
        // Get or create user in database
        const dbUser = await getOrCreateUser(
          user.email,
          user.name || 'User',
          user.image
        );

        // Update Twitch account
        if (account.provider === 'twitch') {
          await upsertTwitchAccount(
            dbUser.id,
            account.providerAccountId,
            account.login || user.name || 'unknown',
            user.name || 'Unknown',
            account.access_token || '',
            account.refresh_token,
            user.image
          );
        }

        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      if (account && account.provider === 'twitch') {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.twitchId = account.providerAccountId;
        token.twitchUsername = account.login || user?.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.twitchId = token.twitchId as string;
        session.user.twitchUsername = token.twitchUsername as string;
      }
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
