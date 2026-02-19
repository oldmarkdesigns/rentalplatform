import { ApiError, mockRequest } from "./mockServer";

export const apiClient = {
  async request(method, endpoint, body = undefined) {
    try {
      return await mockRequest(method, endpoint, body);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, "Ett okänt API-fel uppstod.");
    }
  }
};
