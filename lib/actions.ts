"use server";
import { auth, signIn } from "@/auth";
import { JSONContent } from "@tiptap/react";
import { AuthError } from "next-auth";
import prisma from "./prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

export type DayDisplayState = {
  todoId: string;
  day: number; // if 0, we mean no date
  month: number;
  year: number;
  content: JSONContent;
};

export type MonthDisplayFormat = {
  todos?: DayDisplayState[];
  error: string;
};

export type TodoForTodoId = {
  date?: Date;
  todos: JSONContent;
  error?: string;
};

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

export const displayMonth = async (
  yearMonth: string
): Promise<MonthDisplayFormat> => {
  if (!yearMonth || typeof yearMonth !== "string") {
    return { error: "Invalid input: Missing year-month" };
  }

  try {
    const [yearStr, monthStr] = yearMonth.split("-");
    const [year, month] = [Number(yearStr), Number(monthStr)];
    const numOfDays = new Date(year, month, 0).getDate();
    const dayOfWeek = new Date(year, month - 1, 1).getDay();
    const session = await auth();

    if (!session?.user?.id) throw new Error("User not authenticated");
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const todos = await prisma.todo.findMany({
      where: {
        userId: session.user.id,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    const arr: DayDisplayState[] = [];
    for (let i = 1; i <= numOfDays; i++) {
      arr.push({
        todoId: "",
        day: i,
        month: month,
        year: year,
        content: { type: "doc", content: [] },
      });
    }

    for (const e of todos) {
      const day = Number(e.date.toDateString().split(" ")[2]);
      arr[day - 1].todoId = e.todoId;
      arr[day - 1].content = e.content as JSONContent;
    }

    const emptyCard: DayDisplayState[] = [];
    for (let i = 1; i < dayOfWeek; i++) {
      emptyCard.push({
        todoId: "",
        day: 100 + i,
        month: 0,
        year: 0,
        content: {},
      });
    }
    const retTodos = [...emptyCard, ...arr];
    const ret: MonthDisplayFormat = {
      todos: retTodos,
      error: "",
    };

    return ret;
  } catch (err) {
    return { error: `${err}` };
  }
};

export const fetchTodosGivenId = async (
  date: string
): Promise<TodoForTodoId> => {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return {
        todos: {},
        error: "User is not logged in",
      };
    }
    const [year, month, day] = date.split("-");
    const todoDate = new Date(
      Date.UTC(Number(year), Number(month) - 1, Number(day), 0, 0, 0)
    );
    const todos = await prisma.todo.findMany({
      where: {
        date: todoDate,
        userId: session.user.id,
      },
    });

    if (todos.length === 0) {
      return {
        todos: { type: "doc", content: [] },
      };
    }
    if (todos.length > 1)
      throw new Error("Stored more than 1 todo record for this day");

    return {
      todos: todos[0].content as JSONContent,
      date: todos[0].date,
    };
  } catch (err) {
    return {
      todos: { type: "doc", content: [] },
      error: `${err}`,
    };
  }
};

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

// save todo: content: string, date: string, todoId: string|undefine

export const saveTodo = async (content: JSONContent, date: string) => {
  const session = await auth();
  if (!session?.user?.id) throw new Error("User not authenticated");
  const userId = session.user.id;

  const [year, month, day] = date.split("-").map(Number);
  const todoDate = new Date(Date.UTC(year, month - 1, day));

  try {
    await prisma.todo.upsert({
      where: {
        userId_date: {
          userId,
          date: todoDate,
        },
      },
      update: {
        content,
      },
      create: {
        userId,
        date: todoDate,
        content,
      },
    });
  } catch (error) {
    console.error("The error is:", error);
    throw new Error("Failed to save todo");
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
