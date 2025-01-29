import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnCalendar = nextUrl.pathname.startsWith("/calendar");
      if (isOnCalendar) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/calendar", nextUrl));
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
