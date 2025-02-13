"use server";
import { auth, signIn } from "@/auth";
import { JSONContent } from "@tiptap/react";
import { AuthError } from "next-auth";
import prisma from "./prisma";

type DayDisplayState = {
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
