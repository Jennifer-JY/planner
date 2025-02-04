"use server";
import { signIn } from "@/auth";
import { JSONContent } from "@tiptap/react";
import { AuthError } from "next-auth";

// Try to make it tuple (maybe)
type DayDisplayState = {
  day: number;
  month: number;
  year: number;
  content: JSONContent;
};

export type MonthDisplayState = {
  todos?: DayDisplayState[];
  error: string;
};

export const displayMonth = async (
  prevState: MonthDisplayState,
  formData: FormData
): Promise<MonthDisplayState> => {
  console.log(formData);
  for (const f of formData.entries()) {
    console.log(`key: ${f[0]}, value: ${f[1]}`);
  }
  return prevState;
};

export const authenticate = async (
  prevState: string | undefined,
  formData: FormData
) => {
  try {
    await signIn("credentials", formData);
    console.log("singed in??");
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
};
