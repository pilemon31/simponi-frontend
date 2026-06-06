import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatMessage } from '@/types/chat.type';

interface ChatState {
  // Pemilik history saat ini, dipakai untuk reset bila berganti user.
  ownerId: string | null;
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  // Pastikan history milik user yang sedang login; reset bila bukan.
  ensureOwner: (userId: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      ownerId: null,
      messages: [],
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      clearMessages: () => set({ messages: [] }),
      ensureOwner: (userId) => {
        if (get().ownerId !== userId) {
          set({ ownerId: userId, messages: [] });
        }
      },
    }),
    {
      name: 'simponi-chat-history',
      // Hanya history & pemiliknya yang dipersist (bukan action).
      partialize: (state) => ({
        ownerId: state.ownerId,
        messages: state.messages,
      }),
    },
  ),
);
