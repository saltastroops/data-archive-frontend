import mockAxios from "axios";
import api from "../api/api";

afterEach(() => {
  (mockAxios.post as any).mockReset();
});

describe("Api", () => {
  it("makes a login request", async () => {
    // Mocking the axios post request
    (mockAxios.post as any).mockImplementationOnce(
      async () =>
        await {
          data: {
            message: "You have been logged in.",
            success: true,
          },
          status: 200,
        }
    );

    const response = await api.login({
      password: "test123",
      username: "test",
    });

    // Expect the axios post request to have been called once.
    expect(mockAxios.post).toHaveBeenCalledTimes(1);

    // Expect the axios post to have been called with the correct arguments.
    expect(mockAxios.post).toHaveBeenCalledWith("/auth/login", {
      password: "test123",
      username: "test",
    });

    // Expect the HTTP response to have been returned.
    expect(response.data.success).toBe(true);
    expect(response.data.message).toContain("logged in");
  });
});
