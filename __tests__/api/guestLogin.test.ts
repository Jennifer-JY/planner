/**
 * @jest-environment node
 */

jest.mock("@/lib/actions", () => ({
  createGuestUser: jest.fn(),
}));

import { GET } from "@/app/api/guest-login/route";
import { createGuestUser } from "@/lib/actions";

describe("guestLogin route", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("returns success true and 200 when guest user is created susccessfully", async () => {
    (createGuestUser as jest.Mock).mockResolvedValueOnce({ id: "guest-1" });

    const response = await GET();
    const body = await response.json();
    expect(createGuestUser).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
  });
  it("return 500 when creating guest user is failed", async () => {
    (createGuestUser as jest.Mock).mockRejectedValueOnce({
      error: "Creating guest user failed",
    });

    const response = await GET();
    const body = await response.json();
    expect(createGuestUser).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(500);
    expect(body.success).toBe(false);
  });
});
