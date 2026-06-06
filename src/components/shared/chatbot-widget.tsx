import { useEffect, useRef, useState } from "react";
import { Bot, Loader2, MessageCircle, Send, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChat } from "@/hooks/use-chat";
import { Button } from "@/components/ui/button";

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, isLoading, sendMessage, clearMessages } = useChat();

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading, open]);

  // Fokus input saat panel dibuka
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleSend = () => {
    const value = input.trim();
    if (!value || isLoading) return;
    setInput("");
    void sendMessage(value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {/* Panel chat */}
      <div
        className={cn(
          "flex h-[32rem] max-h-[calc(100svh-6rem)] w-[22rem] max-w-[calc(100vw-2rem)] origin-bottom-right flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-2xl transition-all duration-200",
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0",
        )}
        role="dialog"
        aria-label="Chatbot Simponi"
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-primary px-4 py-3 text-primary-foreground">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary-foreground/15">
              <Bot className="size-4" aria-hidden="true" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold">Simponi Assistant</p>
              <p className="text-xs text-primary-foreground/70">
                Siap membantu kamu
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={clearMessages}
              aria-label="Hapus percakapan"
              className="text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
              disabled={messages.length === 0 || isLoading}
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => setOpen(false)}
              aria-label="Tutup chatbot"
              className="text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
            >
              <X className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* Daftar pesan */}
        <div
          ref={scrollRef}
          className="flex-1 space-y-3 overflow-y-auto bg-background/40 p-4"
        >
          {messages.length === 0 && !isLoading && (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-muted-foreground">
              <Bot className="size-8" aria-hidden="true" />
              <p className="text-sm font-medium">Halo! 👋</p>
              <p className="text-xs">
                Tanyakan apa saja tentang toko kamu, dan saya akan bantu jawab.
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex w-full",
                message.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm shadow-sm",
                  message.role === "user"
                    ? "rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-bl-sm bg-muted text-foreground",
                )}
              >
                {message.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-muted px-3 py-2 text-sm text-muted-foreground shadow-sm">
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Sedang mengetik...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border bg-card p-3">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder="Tulis pesan..."
              className="max-h-28 min-h-9 flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              aria-label="Kirim pesan"
              className="shrink-0"
            >
              <Send className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tombol floating */}
      <Button
        size="icon-lg"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Tutup chatbot" : "Buka chatbot"}
        aria-expanded={open}
        className="size-14 rounded-full shadow-lg transition-transform hover:scale-105"
      >
        {open ? (
          <X className="size-6" aria-hidden="true" />
        ) : (
          <MessageCircle className="size-6" aria-hidden="true" />
        )}
      </Button>
    </div>
  );
}
