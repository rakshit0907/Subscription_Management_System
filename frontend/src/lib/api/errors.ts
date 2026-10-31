import axios from "axios";

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const data = error.response.data;

      if (typeof data?.message === "string") {
        return data.message;
      }

      if (Array.isArray(data?.message)) {
        return data.message.join(", ");
      }

      return `Request failed: ${error.response.status}`;
    }

    if (error.request) {
      return "Unable to connect to the server.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
}