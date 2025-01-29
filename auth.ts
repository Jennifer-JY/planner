"use server";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcrypt";

const users = [
  {
    email: "iloveplanning@outlook.com",
    password: "$2a$12$YvOQ.WawaNopqJkFBjE.Oeiw06VMenQ1ejit5ypt0ycOPiTY5tIqG",
  }, // mycalendar123!
  {
    email: "ilovepizzamore@gmail.com",
    password: "$2a$12$WQO5ih9mQZ3mSajlB3FlauPHnMWe7Hby4ieC6gBzKVFzDGNfSZfeO",
  }, // yourcalendar123!
];

const getUser = (email: string) => {
  const res = users.filter((u) => u.email === email);
  if (res) return res[0];
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
          const user = getUser(email);
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
