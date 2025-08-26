/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import type { JSONContent } from "@tiptap/react";
import { saveTodo } from "@/lib/actions";
import "@testing-library/jest-dom";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useParams: () => ({ date: "2025-01-09" }),
  useRouter: () => ({ push: pushMock }),
}));

jest.mock("@/lib/actions", () => ({
  saveTodo: jest.fn(),
}));

jest.mock("@/app/ui/components/editor/menu/menu", () => ({
  __esModule: true,
  default: () => <div data-testid="menu-stub" />,
}));

const getJSONMock = jest.fn(() => ({
  type: "doc",
  content: [{ type: "paragraph", content: [{ type: "text", text: "hello" }] }],
}));
const isActiveMock = jest.fn().mockReturnValue(false);

jest.mock("@tiptap/react", () => {
  return {
    useEditor: jest.fn(() => ({
      getJSON: getJSONMock,
      isActive: isActiveMock,
    })),
    useEditorState: jest.fn(({ selector }) =>
      selector({ editor: { isActive: isActiveMock } })
    ),
    EditorContent: (props: any) => <div data-testid="editor" {...props} />,
  };
});

import Tiptap from "@/app/ui/components/editor/tiptap";
import { useRouter } from "next/navigation";

describe("<Tiptap /> save flow", () => {
  const initialContent: JSONContent = {
    type: "doc",
    content: [{ type: "paragraph", content: [{ type: "text", text: "init" }] }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls saveTodo with editor JSON and date, then navigates", async () => {
    (saveTodo as jest.Mock).mockResolvedValueOnce(undefined);

    render(<Tiptap content={initialContent} />);

    const btn = screen.getByRole("button", { name: /save/i });
    expect(btn).toBeEnabled();

    fireEvent.click(btn);

    // Button shows Saving... and is disabled during the await
    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();

    await waitFor(() => {
      // saveTodo gets editor JSON and the date from useParams()
      expect(saveTodo).toHaveBeenCalledWith(
        getJSONMock.mock.results[0]?.value ?? expect.any(Object),
        "2025-01-09"
      );
    });

    expect(pushMock).toHaveBeenCalledWith("/calendar");

    // Button returns to normal
    expect(screen.getByRole("button", { name: /save/i })).toBeEnabled();
  });

  it("shows an error when saveTodo rejects", async () => {
    (saveTodo as jest.Mock).mockRejectedValueOnce(new Error("DB error"));

    render(<Tiptap content={initialContent} />);

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    // Error message appears
    expect(await screen.findByText(/failed to save/i)).toBeInTheDocument();

    // Router wasn't called
    const { useRouter } = jest.requireMock("next/navigation");
    expect(useRouter().push).not.toHaveBeenCalled();
  });
});
