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
