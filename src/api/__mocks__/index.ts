const mockBaseAxiosClient = jest.genMockFromModule("..");

const baseAxiosClient: any = ((mockBaseAxiosClient as any).mockBaseAxiosClient = jest.fn());

export { baseAxiosClient };
