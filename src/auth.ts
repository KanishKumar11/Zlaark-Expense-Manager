import NextAuth from "next-auth";
import google from "next-auth/providers/google";
import github from "next-auth/providers/github";
import User from "./models/User";
import { handleGithubSignIn, handleUserSignIn } from "./lib/actions";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [google, github],
  callbacks: {
    async session({ session, token, user }) {
      session.user.avatar = token.avatar;
      session.user.fullName = token.fullName;
      session.user.email = token.email;
      session.user.id = token.id;
      delete session.user.name;
      delete session.user.image;

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
