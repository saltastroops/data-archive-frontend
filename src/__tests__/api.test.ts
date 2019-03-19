import mockAxios from "axios";
import api from "../api/api";

afterEach(() => {
  (mockAxios.post as any).mockReset();
});

describe("Api", () => {
  it("logs in the user into the system", async () => {
    // Mocking the axios post request
    (mockAxios.post as any).mockImplementationOnce(
      async () =>
        await {
          data: {
            message: "You have been logged in.",
            success: true
          },
          status: 200
        }
    );

    const response = await api.auth.login({
      password: "test123",
      username: "test"
    });

    // Expect the axios post request to have been called once.
    expect(mockAxios.post).toHaveBeenCalledTimes(1);

    // Expect the axios post to have been called with the correct arguments.
    expect(mockAxios.post).toHaveBeenCalledWith("/auth/login", {
      password: "test123",
      username: "test"
    });

    // Expect the response success to be true.
    expect(response.data.success).toBe(true);

    // Expect the successful logged in response message
    expect(response.data.message).toContain("logged in");
  });
});
