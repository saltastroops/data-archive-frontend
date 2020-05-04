const cache: any = jest.genMockFromModule("../cache");

cache.readQuery = jest.fn();
cache.writeQuery = jest.fn();

export default cache;
