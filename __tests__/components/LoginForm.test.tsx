import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

jest.mock("@/lib/actions/authentication", () => ({
  authenticate: jest.fn(),
}));

import LoginForm from "@/app/ui/components/authentication/login";
import React from "react";

describe("rendering - LoginForm", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("contains the required filed", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/E-mail/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "LogIn" })).toBeInTheDocument();
    expect(screen.getByText(/Register/)).toBeInTheDocument();
  });
  it("disables logIn button when pending", async () => {
    jest.spyOn(React, "useActionState" as any).mockReturnValue([
      undefined,
      () => jest.fn(),
      true, // isPending
    ]);
    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/E-mail/), "mock@outlook.com");
    await userEvent.type(screen.getByLabelText(/Password/), "mock123@MOCk");

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: "LogIn" })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /Logging.*/ })
      ).toBeInTheDocument();
    });
  });
  it("it displays error message", async () => {
    jest.spyOn(React, "useActionState" as any).mockReturnValue([
      "error message here",
      () => jest.fn(),
      false, // isPending
    ]);
    render(<LoginForm />);
    expect(await screen.findByText(/Error/)).toBeInTheDocument();
  });
  it("submits the form data to formAction", async () => {
    const formActionMock = jest.fn();
    jest
      .spyOn(React, "useActionState" as any)
      .mockReturnValue([undefined, formActionMock, false]);
    render(<LoginForm />);
    await userEvent.type(screen.getByLabelText(/E-mail/), "mock@outlook.com");
    await userEvent.type(screen.getByLabelText(/Password/), "mock123@MOCk");
    await userEvent.click(screen.getByRole("button", { name: "LogIn" }));
    expect(formActionMock).toHaveBeenCalledTimes(1);
    const fd = formActionMock.mock.calls[0][0] as FormData;
    expect(fd.get("email")).toBe("mock@outlook.com");
    expect(fd.get("password")).toBe("mock123@MOCk");
    expect(fd.get("redirectTo")).toBe("/after");
  });
});
