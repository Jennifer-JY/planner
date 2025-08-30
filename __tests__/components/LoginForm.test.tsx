import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

// Force callbackUrl for redirectTo hidden field
jest.mock("next/navigation", () => {
  const actual = jest.requireActual("next/navigation");
  return {
    ...actual,
    useSearchParams: () => new URLSearchParams("?callbackUrl=/after"),
  };
});

// Mock server action
jest.mock("@/lib/actions/authentication", () => ({
  authenticate: jest.fn(),
}));

// Robustly mock useActionState even if the component destructures it
const mockUseActionState = jest.fn();
jest.mock("react", () => {
  const actual = jest.requireActual("react");
  return {
    ...actual,
    useActionState: (...args: any[]) => mockUseActionState(...args),
  };
});

// Import AFTER mocks
import LoginForm from "@/app/ui/components/authentication/login";

describe("LoginForm", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("contains the required fields and primary action", () => {
    mockUseActionState.mockReturnValue([undefined, jest.fn(), false]); // not pending
    render(<LoginForm />);

    // Use exact match for label and/or restrict to input to avoid matching the "Show password" button
    expect(screen.getByLabelText(/^E-mail$/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/^Password$/i, { selector: "input" })
    ).toBeInTheDocument();

    // Single submit button with "Log in"
    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();

    // Link to register
    expect(screen.getByRole("link", { name: /Register/i })).toBeInTheDocument();
  });

  it("shows a disabled button with 'Logging in...' text when pending", async () => {
    mockUseActionState.mockReturnValue([undefined, jest.fn(), true]); // isPending
    render(<LoginForm />);
    const btn = await screen.findByRole("button", {
      name: /Logging in\.\.\./i,
    });
    expect(btn).toBeDisabled();
    expect(
      screen.queryByRole("button", { name: "Log in" })
    ).not.toBeInTheDocument();
  });

  it("displays the error message text", async () => {
    mockUseActionState.mockReturnValue([
      "error message here",
      jest.fn(),
      false,
    ]);
    render(<LoginForm />);
    expect(await screen.findByText("error message here")).toBeInTheDocument();
  });

  it("submits the form data to formAction", async () => {
    const formActionMock = jest.fn();
    mockUseActionState.mockReturnValue([undefined, formActionMock, false]);
    render(<LoginForm />);

    await userEvent.type(
      screen.getByLabelText(/^E-mail$/i),
      "mock@outlook.com"
    );
    await userEvent.type(
      screen.getByLabelText(/^Password$/i, { selector: "input" }),
      "mock123@MOCk"
    );
    await userEvent.click(screen.getByRole("button", { name: "Log in" }));

    expect(formActionMock).toHaveBeenCalledTimes(1);
    const fd = formActionMock.mock.calls[0][0] as FormData;
    expect(fd.get("email")).toBe("mock@outlook.com");
    expect(fd.get("password")).toBe("mock123@MOCk");
    expect(fd.get("redirectTo")).toBe("/after");
  });
});
