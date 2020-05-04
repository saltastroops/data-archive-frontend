describe("mocking window.matchMedia", () => {
  it("should work", () => {
    // Do nothing. This test is included only to keep Jest happy.
  });
});

window.matchMedia = jest.fn().mockImplementation(query => {
  return {
    addListener: jest.fn(),
    matches: true,
    media: query,
    onchange: null,
    removeListener: jest.fn()
  };
});

export default window;
