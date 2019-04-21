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
