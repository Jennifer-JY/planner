import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Editor } from "@tiptap/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

jest.mock("next/font/google", () => ({
  __esModule: true,
  Roboto: jest.fn(() => ({
    style: { fontFamily: "Roboto" },
  })),
  Caveat_Brush: jest.fn(() => ({
    style: { fontFamily: "Caveat Brush" },
  })),
  Merriweather: jest.fn(() => ({
    style: { fontFamily: "Merriweather" },
  })),
}));

const mockEditor = () => {
  const selectBold = jest.fn();
  const selectItalic = jest.fn();
  const selectColor = jest.fn();
  const selectFont = jest.fn();
  const selectHighlight = jest.fn();
  let currentColor = "#000000";
  const api = {
    toggleBold: () => ({ run: selectBold }),
    toggleItalic: () => ({ run: selectItalic }),
    setColor: (c: string) => ({
      run: () => {
        selectColor(c);
        currentColor = c;
      },
    }),
    setFontFamily: (f: string) => ({ run: () => selectFont(f) }),
    toggleHighlight: (h: string) => ({ run: () => selectHighlight(h) }),
    focus: () => api,
  };

  const editor = {
    state: {
      selection: null,
    },
    getAttributes: () => ({ color: currentColor }),
    chain: () => ({ focus: api.focus }),
  } as unknown as Editor;

  return {
    editor,
    selectBold,
    selectItalic,
    selectColor,
    selectFont,
    selectHighlight,
  };
};

import Menu from "@/app/ui/components/editor/menu/menu";

describe("TipTap Menu", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("set the bold/italic when selected", async () => {
    const { editor, selectBold, selectItalic } = mockEditor();
    render(
      <Menu
        editor={editor}
        currentEditorState={{ isBold: false, isItalic: false }}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /bold/i }));
    expect(selectBold).toHaveBeenCalledTimes(1);
    expect(selectItalic).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: /italic/i }));
    expect(selectItalic).toHaveBeenCalledTimes(1);
  });

  it("set the color when changed", async () => {
    const { editor, selectColor } = mockEditor();
    render(
      <Menu
        editor={editor}
        currentEditorState={{ isBold: false, isItalic: false }}
      />
    );

    const colorInput = screen.getByLabelText(/text color/i) as HTMLInputElement;
    expect(colorInput.value.toLowerCase()).toBe("#000000");

    fireEvent.change(colorInput, { target: { value: "#123456" } });
    await waitFor(() => {
      expect(colorInput.value.toLowerCase()).toBe("#123456");
    });
    expect(selectColor).toHaveBeenCalledTimes(1);
    expect(selectColor).toHaveBeenCalledWith("#123456");
  });
  it("sets selected fonts", async () => {
    const { editor, selectFont } = mockEditor();
    render(
      <Menu
        editor={editor}
        currentEditorState={{ isBold: false, isItalic: false }}
      />
    );
    const combo = screen.getByRole("combobox", { name: /font/ });
    const roboto = screen.getByRole("option", { name: "Roboto" });

    await userEvent.selectOptions(combo, roboto);

    expect(selectFont).toHaveBeenCalledTimes(1);
    expect(selectFont).toHaveBeenCalledWith("Roboto");
  });

  it("set highlighter", async () => {
    const { editor, selectHighlight } = mockEditor();
    render(
      <Menu
        editor={editor}
        currentEditorState={{ isBold: false, isItalic: false }}
      />
    );
    const combo = screen.getByRole("combobox", { name: /highlighter/ });
    const greenHighlighter = screen.getByRole("option", { name: "Green" });
    await userEvent.selectOptions(combo, greenHighlighter);
    expect(selectHighlight).toHaveBeenCalledTimes(1);
    expect(selectHighlight).toHaveBeenCalledWith({ color: "#98FF98" });
  });
});
