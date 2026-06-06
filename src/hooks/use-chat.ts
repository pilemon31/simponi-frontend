import { useCallback, useState } from "react";
import { ChatApi } from "@/services/chat.service";
import { useAuthStore } from "@/stores/auth-store";
import type { ChatMessage } from "@/types/chat.type";

const ERROR_MESSAGE =
  "Maaf, terjadi kesalahan saat memproses pertanyaan kamu. Coba lagi ya.";

export const useChat = () => {
  const userId = useAuthStore((state) => state.auth.user?.id ?? "anonymous");

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed || isLoading) return;

      const userMessage: ChatMessage = { role: "user", content: trimmed };

      // History dikirim adalah percakapan SEBELUM pertanyaan terbaru.
      const history = messages;

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      const response = await ChatApi.ask({
        user_id: userId,
        question: trimmed,
        history,
        schema_name: "public",
        source_filter: "",
        show_sql: false,
      });

      const content =
        response.status && response.answer
          ? response.answer
          : response.status
            ? ERROR_MESSAGE
            : response.message || ERROR_MESSAGE;

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    },
    [isLoading, messages, userId],
  );

  const clearMessages = useCallback(() => setMessages([]), []);

  return { messages, isLoading, sendMessage, clearMessages };
};
