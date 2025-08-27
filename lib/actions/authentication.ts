"use server";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

type RegisterState = {
  errors?: {
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    general?: string[];
  };
  success?: boolean;
  signInInfo?: {
    email: string;
    password: string;
  };
};

const userRegisterschema = z
  .object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email format"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must include at least one uppercase letter")
      .regex(/[a-z]/, "Password must include at least one lowercase letter")
      .regex(/[0-9]/, "Password must include at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must include at least one special character"
      ),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Attach the error to this field
  });

export const authenticate = async (
  prevState: string | undefined,
  formData: FormData
) => {
  try {
    await signIn("credentials", formData);
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

export const register = async (
  prevState: RegisterState | undefined,
  formData: FormData
): Promise<RegisterState> => {
  const validatedFields = userRegisterschema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),

    // Learn: this still needs to be here unless zod would think it is blank and
    // errors: required would appear
    confirmPassword: formData.get("confirmPassword"),
  });

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const { email, password } = validatedFields.data;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        errors: { email: ["This email is already registered."] },
      };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return { success: true, signInInfo: { email: email, password: password } };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      errors: { general: ["Something went wrong. Please try again."] },
    };
  }
};

export async function createGuestUser(): Promise<{ success: boolean }> {
  try {
    const prefix =
      new Date().toISOString().slice(0, 10).replace(/-/g, "") + nanoid(8);
    const email = prefix + process.env.GUEST_EMAIL!;
    const password = process.env.GUEST_PASSWORD!;
    // Delete the previous guests data, start fresh
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      await prisma.user.delete({
        where: { email },
      });
      // Cascade will delete their todos too
    }

    // Re-create user
    await prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
      },
    });

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
