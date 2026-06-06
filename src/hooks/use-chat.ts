import { useCallback, useEffect, useState } from "react";
import { ChatApi } from "@/services/chat.service";
import { useAuthStore } from "@/stores/auth-store";
import { useChatStore } from "@/stores/chat-store";
import type { ChatMessage } from "@/types/chat.type";

const ERROR_MESSAGE =
  "Maaf, terjadi kesalahan saat memproses pertanyaan kamu. Coba lagi ya.";

export const useChat = () => {
  const userId = useAuthStore((state) => state.auth.user?.id ?? "anonymous");

  const messages = useChatStore((state) => state.messages);
  const addMessage = useChatStore((state) => state.addMessage);
  const clearMessages = useChatStore((state) => state.clearMessages);
  const ensureOwner = useChatStore((state) => state.ensureOwner);

  const [isLoading, setIsLoading] = useState(false);

  // Reset history bila pemiliknya bukan user yang sedang login.
  useEffect(() => {
    ensureOwner(userId);
  }, [userId, ensureOwner]);

  const sendMessage = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed || isLoading) return;

      const userMessage: ChatMessage = { role: "user", content: trimmed };

      // History dikirim adalah percakapan SEBELUM pertanyaan terbaru.
      const history = useChatStore.getState().messages;

      addMessage(userMessage);
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

      addMessage({ role: "assistant", content });
      setIsLoading(false);
    },
    [isLoading, addMessage, userId],
  );

  return { messages, isLoading, sendMessage, clearMessages };
};
