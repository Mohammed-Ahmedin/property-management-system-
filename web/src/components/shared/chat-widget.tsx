"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { api } from "@/hooks/api";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export function ChatWidget() {
  const user = useAppSelector(s => s.auth.user);
  const isAuthenticated = useAppSelector(s => s.auth.isAuthenticated);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const loadMessages = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await api.get("/chat/my");
      setMessages(res.data.data || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    if (open && isAuthenticated) loadMessages();
  }, [open, isAuthenticated]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Poll for new messages when open
  useEffect(() => {
    if (!open || !isAuthenticated) return;
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [open, isAuthenticated]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    const optimistic = { id: Date.now(), message: input, isAdmin: false, createdAt: new Date().toISOString(), user };
    setMessages(prev => [...prev, optimistic]);
    setInput("");
    try {
      const res = await api.post("/chat", { message: input });
      setMessages(prev => prev.map(m => m.id === optimistic.id ? res.data.data : m));
    } catch {
      setMessages(prev => prev.filter(m => m.id !== optimistic.id));
      setInput(input);
    } finally {
      setSending(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end gap-2">
      {open && (
        <div className="w-80 sm:w-96 bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ height: "420px" }}>
          {/* Header */}
          <div className="bg-primary px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Support Chat</p>
                <p className="text-white/70 text-xs">We'll reply as soon as possible</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {loading && messages.length === 0 ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>Send a message to start chatting with support</p>
              </div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className={cn("flex", msg.isAdmin ? "justify-start" : "justify-end")}>
                  <div className={cn("max-w-[80%] rounded-2xl px-3 py-2 text-sm",
                    msg.isAdmin
                      ? "bg-muted text-foreground rounded-bl-sm"
                      : "bg-primary text-primary-foreground rounded-br-sm"
                  )}>
                    {msg.isAdmin && <p className="text-xs font-semibold mb-0.5 opacity-70">Support</p>}
                    <p>{msg.message}</p>
                    <p className={cn("text-xs mt-0.5", msg.isAdmin ? "text-muted-foreground" : "text-primary-foreground/60")}>
                      {format(new Date(msg.createdAt), "h:mm a")}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border flex gap-2 shrink-0">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Type a message..."
              className="flex-1 text-sm bg-muted rounded-xl px-3 py-2 outline-none border border-border focus:border-primary transition-colors"
            />
            <button onClick={handleSend} disabled={sending || !input.trim()}
              className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0">
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-12 h-12 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-all hover:scale-105 flex items-center justify-center"
        aria-label="Open chat"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>
    </div>
  );
}
