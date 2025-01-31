"use server";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcrypt";
import prisma from "./lib/prisma";

// const users = [
//   {
//     email: "test@outlook.com",
//     password: "$2a$12$YvOQ.WawaNopqJkFBjE.Oeiw06VMenQ1ejit5ypt0ycOPiTY5tIqG",
//   }, // mycalendar123!
//   {
//     email: "test2@outlook.com",
//     password: "$2a$12$WQO5ih9mQZ3mSajlB3FlauPHnMWe7Hby4ieC6gBzKVFzDGNfSZfeO",
//   }, // yourcalendar123!
// ];

const getUser = async (email: string) => {
  const res = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (res) return res;
  throw new Error("No such user");
};

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string() })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) return user;
        }
        console.log("Invalid email/password");
        return null;
      },
    }),
  ],
});
