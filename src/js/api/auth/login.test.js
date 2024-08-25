import { login } from "./login";
import { save } from "../../storage";
import { headers } from "../headers";
import { apiPath } from "../constants";

jest.mock("../../storage", () => ({
  save: jest.fn(),
}));

jest.mock("../headers", () => ({
  headers: jest.fn(() => ({})),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({ accessToken: "testToken", profileData: "testData" }),
  }),
);

describe("login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("stores a token when provided with valid credentials", async () => {
    const email = "test@test.com";
    const password = "1234";

    const profile = await login(email, password);

    expect(fetch).toHaveBeenCalledWith(`${apiPath}/social/auth/login`, {
      method: "post",
      body: JSON.stringify({ email, password }),
      headers: headers("application/json"),
    });

    expect(save).toHaveBeenCalledWith("token", "testToken");
    expect(save).toHaveBeenCalledWith("profile", { profileData: "testData" });
    expect(profile).toEqual({ profileData: "testData" });
  });
});