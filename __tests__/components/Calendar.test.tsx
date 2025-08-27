import { render, screen } from "@testing-library/react";
import { displayMonth } from "@/lib/actions/calendar";
import { DayDisplayState } from "@/lib/definitions";
import "@testing-library/jest-dom";

jest.mock("@/lib/actions/calendar", () => ({
  displayMonth: jest.fn(),
}));

import Calendar from "@/app/ui/components/calendar/calendar";

describe("Calendar", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("renders the calendar with saved todos", async () => {
    (displayMonth as jest.Mock).mockResolvedValue(getSampleRetVal());
    const ui = await Calendar({ propMonthYear: "2025-08" });
    render(ui);
    expect(screen.getByText("Mon")).toBeInTheDocument();
    expect(screen.getByText("Tue")).toBeInTheDocument();
    expect(screen.getByText("Wed")).toBeInTheDocument();
    expect(screen.getByText("Thur")).toBeInTheDocument();
    expect(screen.getByText("Fri")).toBeInTheDocument();
    expect(screen.getByText("Sat")).toBeInTheDocument();
    expect(screen.getByText("Sun")).toBeInTheDocument();

    // a couple of day numbers show up
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("todo for day 1")).toBeInTheDocument();
    expect(screen.getByText("14")).toBeInTheDocument();
    expect(screen.getByText("todo for day 14")).toBeInTheDocument();
    expect(screen.getByText("31")).toBeInTheDocument();
    expect(screen.getByText("todo for day 31")).toBeInTheDocument();
  });

  it("links to the editor page when a specific day card is clicked", async () => {
    (displayMonth as jest.Mock).mockResolvedValue(getSampleRetVal());
    const ui = await Calendar({ propMonthYear: "2025-08" });
    render(ui);
    const link14 = screen.getByRole("link", { name: /14/ });
    expect(link14).toHaveAttribute("href", "/calendar/2025-8-14/edit");
  });
});

const getSampleRetVal = () => {
  const todos: DayDisplayState[] = [
    { todoId: "", day: 101, month: 0, year: 0, content: {} },
    { todoId: "", day: 102, month: 0, year: 0, content: {} },
  ];

  for (let i = 1; i < 32; i++) {
    const todo: DayDisplayState = {
      todoId: `id-${i}`,
      day: i,
      month: 8,
      year: 2025,
      content: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: `todo for day ${i}` }],
          },
        ],
      },
    };
    todos.push(todo);
  }
  return { todos: todos, error: "" };
};
