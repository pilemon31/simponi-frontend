import type { SuccessResponse } from "./response.type";

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type ChatRequest = {
  user_id: string;
  question: string;
  history: ChatMessage[];
  schema_name: string;
  source_filter: string;
  show_sql: boolean;
};

export type ChatResult = {
  answer: string;
  sql_query: string;
  row_count: number;
  source_tables: string[];
  error: string;
};

export type ChatApiResponse = SuccessResponse<ChatResult>;
