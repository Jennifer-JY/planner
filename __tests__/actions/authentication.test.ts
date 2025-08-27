/**
 * @jest-environment node
 */

import prisma from "@/lib/prisma";
import { signIn } from "@/auth";
import {
  authenticate,
  createGuestUser,
  register,
} from "@/lib/actions/authentication";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

describe("authenticate", () => {
  it("returns 'Invalid credentials.' on CredentialsSignin", async () => {
    (signIn as jest.Mock).mockRejectedValueOnce(
      new (require("next-auth").AuthError)("CredentialsSignin")
    );
    const res = await authenticate(undefined, new FormData());
    expect(res).toBe("Invalid credentials.");
  });

  it("returns 'Something went wrong.' for other AuthError", async () => {
    (signIn as jest.Mock).mockRejectedValueOnce(
      new (require("next-auth").AuthError)("OAuthAccountNotLinked")
    );
    const res = await authenticate(undefined, new FormData());
    expect(res).toBe("Something went wrong.");
  });

  it("rethrows non-AuthError", async () => {
    (signIn as jest.Mock).mockRejectedValueOnce(new Error("boom"));
    await expect(authenticate(undefined, new FormData())).rejects.toThrow(
      "boom"
    );
  });
});

describe("register", () => {
  it("returns error when input field is invalid", async () => {
    const formData = new FormData();
    formData.append("email", "e");
    formData.append("password", "000");
    formData.append("confirmPassword", "000");
    const ret = await register(undefined, formData);
    expect(ret).toMatchObject({
      errors: {
        email: ["Invalid email format"],
        password: expect.arrayContaining([
          "Password must be at least 8 characters",
          "Password must include at least one uppercase letter",
          "Password must include at least one lowercase letter",
          // number is present in "000", so no number error expected
          "Password must include at least one special character",
        ]),
      },
    });
    expect((ret as any).success).toBeUndefined();
    // No confirmPassword error here because "000" === "000"
    expect(ret.errors?.confirmPassword).toBeUndefined();
  });

  it("returns confirmPassword error when passwords don't match", async () => {
    const fd = new FormData();
    fd.set("email", "user@example.com");
    fd.set("password", "Abcdef1!");
    fd.set("confirmPassword", "Abcdef1?");

    const ret = await register(undefined, fd);

    expect(ret).toMatchObject({
      errors: { confirmPassword: ["Passwords do not match"] },
    });
  });

  it("returns error when email already exists", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({ id: "u1" });

    const fd = new FormData();
    fd.set("email", "user@example.com");
    fd.set("password", "Abcdef1!");
    fd.set("confirmPassword", "Abcdef1!");

    const ret = await register(undefined, fd);

    expect(ret).toEqual({
      errors: { email: ["This email is already registered."] },
    });
  });
});

describe("creatGuestUser", () => {
  const OLD_ENV = process.env;

  beforeAll(() => {
    process.env = { ...OLD_ENV };
    process.env.GUEST_EMAIL = "+guest@example.com";
    process.env.GUEST_PASSWORD = "guestPW!";
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  beforeEach(() => {
    jest.useFakeTimers();
    // ISO date prefix will be "20250203"
    jest.setSystemTime(new Date("2025-02-03T12:34:56Z"));
    (nanoid as jest.Mock).mockReturnValue("ABCDEFGH"); // nanoid(8) -> "ABCDEFGH"
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPW");
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("deletes existing guest, recreates, and signs in (success path when user exists)", async () => {
    // Arrange
    const expectedEmail = "20250203ABCDEFGH" + process.env.GUEST_EMAIL;
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({ id: "u1" });
    (prisma.user.delete as jest.Mock).mockResolvedValueOnce({ id: "u1" });
    (prisma.user.create as jest.Mock).mockResolvedValueOnce({ id: "u2" });
    (signIn as jest.Mock).mockResolvedValueOnce(undefined);

    // Act
    const res = await createGuestUser();

    // Assert
    expect(res).toEqual({ success: true });

    // find existing
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: expectedEmail },
    });

    // delete old
    expect(prisma.user.delete).toHaveBeenCalledWith({
      where: { email: expectedEmail },
    });

    // create new (hashed password)
    expect(bcrypt.hash).toHaveBeenCalledWith(process.env.GUEST_PASSWORD, 10);
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: { email: expectedEmail, password: "hashedPW" },
    });

    // sign in (no redirect)
    expect(signIn).toHaveBeenCalledWith("credentials", {
      email: expectedEmail,
      password: process.env.GUEST_PASSWORD,
      redirect: false,
    });
  });

  it("creates and signs in when no existing guest", async () => {
    const expectedEmail = "20250203ABCDEFGH" + process.env.GUEST_EMAIL;
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
    (prisma.user.create as jest.Mock).mockResolvedValueOnce({ id: "u1" });
    (signIn as jest.Mock).mockResolvedValueOnce(undefined);

    const res = await createGuestUser();

    expect(res).toEqual({ success: true });
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: expectedEmail },
    });
    expect(prisma.user.delete).not.toHaveBeenCalled(); // nothing to delete
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: { email: expectedEmail, password: "hashedPW" },
    });
    expect(signIn).toHaveBeenCalledWith("credentials", {
      email: expectedEmail,
      password: process.env.GUEST_PASSWORD,
      redirect: false,
    });
  });

  it("returns { success: false } when something throws", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
    (prisma.user.create as jest.Mock).mockRejectedValueOnce(
      new Error("db down")
    );

    const res = await createGuestUser();

    expect(res).toEqual({ success: false });
  });
});
