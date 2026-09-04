import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      twitchId?: string;
      twitchUsername?: string;
    };
    accessToken?: string;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
    twitchId?: string;
    twitchUsername?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    twitchId?: string;
    twitchUsername?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}
