"use server";
import { auth } from "@/auth";
import { JSONContent } from "@tiptap/react";
import prisma from "../prisma";
import { TodoForTodoId } from "../definitions";

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
