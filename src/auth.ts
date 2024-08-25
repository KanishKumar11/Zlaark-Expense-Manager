import NextAuth from "next-auth";
import google from "next-auth/providers/google";
import github from "next-auth/providers/github";
import credentials from "next-auth/providers/credentials";
import User from "./models/User";
import {
  getUserByEmail,
  handleEmailSignIn,
  handleGithubSignIn,
  handleUserSignIn,
} from "./lib/actions";
import bcrypt from "bcryptjs";

interface Credentials {
  email: string;
  password: string;
  fullName?: string;
  avatar?: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    google,
    github,
    credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "your-email@example.com",
        },
        password: { label: "Password", type: "password" },
        fullName: { label: "Full name", type: "text" },
      },
      async authorize(credentials) {
        const { fullName, email, password } = credentials as Credentials;
        const existingUser = await getUserByEmail(email);
        if (!existingUser) {
          const avatar = "";
          const user = await handleEmailSignIn(
            fullName,
            email,
            avatar,
            password
          );
          return {
            id: user._doc._id.toString(),
            email: user._doc.email,
            fullName: user._doc.fullName,
            avatar,
          };
        }

        return {
          id: existingUser._id.toString(),
          email: existingUser.email,
          fullName: existingUser.fullName,
          avatar: existingUser.avatar,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      session.user.avatar = token.avatar;
      session.user.fullName = token.fullName;
      session.user.email = token.email;
      session.user.id = token.id;
      delete session.user.name;
      delete session.user.image;
      console.log(session);
      return session;
    },
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        const user = await handleUserSignIn(profile);
        return user;
      }
      {
        if (account?.provider === "github") {
          console.log(profile);
          const user = await handleGithubSignIn(profile);
          return user;
        }
      }
      {
        if (account?.provider === "credentials") {
          console.log(profile);
        }
      }
      console.log(account);
      return true;
    },
    async jwt({ token, user, account }) {
      if (account) {
        // await connectDb();
        const existingUser = await User.findOne({ email: user.email });
        token.accessToken = account.access_token;
        token = { ...existingUser._doc };
        token.id = existingUser._id.toString();
        delete token.name;
        delete token.picture;
      }
      return token;
    },
  },
});
