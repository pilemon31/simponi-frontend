import axios, { type AxiosError } from "axios";
import chatAxios from "@/lib/chat-axios";
import { mapErrorResponse } from "@/lib/error-mapper";
import type { ErrorResponse } from "@/types/response.type";
import type { ChatRequest, ChatResult } from "@/types/chat.type";

type ApiResult<T> = (T & { status: true }) | ErrorResponse;

const fallbackError = (message = "Terjadi kesalahan"): ErrorResponse => ({
  status: false,
  message,
  timestamp: new Date().toISOString(),
  error: "Unknown error",
});

/**
 * Normalize the chatbot response into a predictable shape.
 * The backend may return the payload directly or wrapped inside `data`.
 */
const normalizeChatResult = (raw: unknown): ChatResult => {
  const payload = (raw ?? {}) as Record<string, unknown>;
  const data = (payload.data ?? payload) as Record<string, unknown>;

  return {
    answer: (data.answer as string) ?? "",
    sql_query: (data.sql_query as string) ?? "",
    row_count: (data.row_count as number) ?? 0,
    source_tables: Array.isArray(data.source_tables)
      ? (data.source_tables as string[])
      : [],
    error: (data.error as string) ?? "",
  };
};

export const ChatApi = {
  ask: async (payload: ChatRequest): Promise<ApiResult<ChatResult>> => {
    try {
      const response = await chatAxios.post("/chat", payload);

      return { status: true, ...normalizeChatResult(response.data) };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return mapErrorResponse(
          (error as AxiosError).response?.data as ErrorResponse,
        );
      }

      return fallbackError("Gagal menghubungi chatbot");
    }
  },
};
