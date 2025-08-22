import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import React from "react";

jest.mock("@/lib/actions", () => ({
  register: jest.fn(),
}));

jest.mock("@/auth", () => ({
  signIn: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams("?callbackUrl=/after"),
}));

jest.mock("react", () => {
  const actual = jest.requireActual("react");
  return {
    ...actual,
    useActionState: jest.fn(),
  };
});

const mockUseActionState = React.useActionState as jest.Mock;

import RegisterForm from "@/app/ui/components/authentication/register";
import { signIn } from "@/auth";

describe("RegisterForm", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders all the inputs and button", () => {
    mockUseActionState.mockReturnValue([undefined, jest.fn(), false]);
    render(<RegisterForm />);

    expect(screen.getByLabelText(/E-mail/)).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Register" }));
  });
  it("shows error message when there's errors with the email and password fields", async () => {
    mockUseActionState.mockReturnValue([
      {
        errors: {
          email: ["email format is wrong"],
          password: ["password must be more than 6 chars"],
          confirmPassword: ["confirmed password does not match password"],
          general: ["registration failed"],
        },
      }, // retMessage
      () => jest.fn(), // formAction
      false, // isPending
    ]);
    render(<RegisterForm />);
    expect(
      await screen.findByText(/email format is wrong/)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/password must be more than 6 chars/)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/confirmed password does not match password/)
    ).toBeInTheDocument();
    expect(await screen.findByText(/registration failed/)).toBeInTheDocument();
  });
  it("successfully sumbit the register form and sign in", async () => {
    const formActionMock = jest.fn();
    mockUseActionState.mockReturnValue([undefined, formActionMock, false]);

    render(<RegisterForm />);

    await userEvent.type(screen.getByLabelText(/E-mail/), "mock@outlook.com");
    await userEvent.type(screen.getByLabelText("Password"), "mock123!MOCK");
    await userEvent.type(
      screen.getByLabelText(/Confirm Password/),
      "mock123!MOCK"
    );

    await userEvent.click(screen.getByRole("button", { name: "Register" }));
    expect(formActionMock).toHaveBeenCalledTimes(1);

    const fd = formActionMock.mock.calls[0][0] as FormData;
    expect(fd.get("email")).toBe("mock@outlook.com");
    expect(fd.get("password")).toBe("mock123!MOCK");
    expect(fd.get("confirmPassword")).toBe("mock123!MOCK");
    expect(fd.get("redirectTo")).toBe("/after");
    expect(signIn).not.toHaveBeenCalled();
  });
  it("calls signIn function when the register is successful", () => {
    mockUseActionState.mockReturnValue([
      {
        success: true,
        signInInfo: { email: "mock@outlook.com", password: "mock123!MOCK" },
      },
      jest.fn(),
      false,
    ]);

    render(<RegisterForm />);

    expect(signIn).toHaveBeenCalledWith("credentials", {
      email: "mock@outlook.com",
      password: "mock123!MOCK",
      callbackUrl: "/after",
    });
  });
});
