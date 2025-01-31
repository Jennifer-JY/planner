"use server";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const authenticate = async (
  prevState: string | undefined,
  formData: FormData
) => {
  try {
    signIn("credentials", formData);
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

export const displayMonth = async (
  prevState: string | undefined,
  formData: FormData
) => {
  console.log(formData);
  for (const f of formData.entries()) {
    console.log(`key: ${f[0]}, value: ${f[1]}`);
  }
  return "thanks";
};
