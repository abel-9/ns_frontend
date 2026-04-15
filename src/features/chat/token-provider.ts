export interface ChatTokenProvider {
  getToken: () => Promise<string>;
}

export const createMockTokenProvider = (
  token: string = "mock-dev-token",
): ChatTokenProvider => ({
  getToken: async () => token,
});
