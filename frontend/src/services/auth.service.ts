export const authService = {
  login: async (data: any) => {
    return { token: "mock_token_123" };
  },
  logout: () => {
    console.log("Logged out");
  }
};

//ชั่วคราว !!!!! By phuri ลบได้เลย