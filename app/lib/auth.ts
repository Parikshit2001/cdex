import { Session } from "next-auth";
import Google from "next-auth/providers/google";
import prisma from "../db";
import { Keypair } from "@solana/web3.js";

export interface session extends Session {
  user: {
    email: string;
    image: string;
    name: string;
    uid: string;
  };
}

export const authConfig = {
  secret: process.env.NEXT_AUTH_SECRET || "secr3t",
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    signIn: async ({ user, account, profile }: any) => {
      if (account.provider !== "google") {
        return false;
      }

      const email: string = user.email;
      if (!email) {
        return false;
      }

      const userDB = await prisma.user.findFirst({
        where: {
          username: email,
        },
      });
      if (userDB) {
        return true;
      }

      const keypair = Keypair.generate();
      const publicKey = keypair.publicKey.toBase58();
      const privateKey = keypair.secretKey;

      await prisma.user.create({
        data: {
          username: email,
          sub: account.providerAccountId,
          name: user.name,
          profilePicture: user.image,
          provider: "Google",
          solWallet: {
            create: {
              publicKey: publicKey,
              privateKey: privateKey.toString(),
            },
          },
          inrWallet: {
            create: {
              balance: 0,
            },
          },
        },
      });

      return true;
    },
    async jwt({ token, account }: any) {
      const user = await prisma.user.findFirst({
        where: {
          sub: token.sub ?? "",
        },
      });
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
    session({ session, token }: any): session {
      // Send properties to the client, like an access_token and user id from a provider.
      const newSession: session = session as session;
      if (newSession.user && token.uid) {
        newSession.user.uid = token.uid;
      }
      return newSession;
    },
  },
};
