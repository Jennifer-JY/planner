import { JSONContent } from "@tiptap/react";

export type User = {
  email: string;
  password: string;
};

export type Todo = {
  id?: string;
  title: string;
  content: string;
  yearMonth: string;
  day: number;
  order: number;
};

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
