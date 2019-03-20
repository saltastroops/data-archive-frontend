const mockAxios = jest.genMockFromModule("axios");

(mockAxios as any).create = jest.fn(() => mockAxios);

export default mockAxios;
