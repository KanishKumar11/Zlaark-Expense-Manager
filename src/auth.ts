import NextAuth, { Session } from "next-auth";
import credentials from "next-auth/providers/credentials";
import google from "next-auth/providers/google";
import { connectDb } from "./lib/connectDb";
import User, { IUser } from "./models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [google, credentials],
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
        console.log("profile:", profile);
        await connectDb();
        const existingUser = await User.findOne({ email: profile?.email });
        if (!existingUser) {
          const newUser = new User({
            fullName: profile?.name,
            email: profile?.email,
            avatar: profile?.picture,
          });
          const savedUser = await newUser.save();

          console.log(savedUser);
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account) {
        await connectDb();
        const existingUser = await User.findOne({ email: user.email });
        token.accessToken = account.access_token;
        token = { ...existingUser._doc };
        token.id = existingUser._id.toString();
        console.log(token);
        delete token.name;
        delete token.picture;
      }
      return token;
    },
  },
});
