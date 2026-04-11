"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/hooks/api";
import { Avatar } from "@/components/shared/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import LoaderState from "@/components/shared/loader-state";

export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadConversations = async () => {
    try {
      const res = await api.get("/chat/admin/conversations");
      setConversations(res.data.data || []);
    } catch {}
    setLoading(false);
  };

  const loadMessages = async (userId: string) => {
    try {
      const res = await api.get(`/chat/admin/${userId}`);
      setMessages(res.data.data || []);
      // Refresh conversations to update unread count
      loadConversations();
    } catch {}
  };

  useEffect(() => { loadConversations(); }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    loadMessages(user.id);
  };

  const handleSendReply = async () => {
    if (!reply.trim() || !selectedUser) return;
    setSending(true);
    try {
      const res = await api.post(`/chat/admin/${selectedUser.id}/reply`, { message: reply });
      setMessages(prev => [...prev, res.data.data]);
      setReply("");
    } catch {
      toast.error("Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <LoaderState />;

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Conversations list */}
      <div className="w-72 shrink-0 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">Messages</span>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={loadConversations}>
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground text-sm">No messages yet</div>
          ) : (
            conversations.map(conv => (
              <button key={conv.id} onClick={() => handleSelectUser(conv)}
                className={cn("w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left border-b border-border/50",
                  selectedUser?.id === conv.id && "bg-primary/5 border-l-2 border-l-primary"
                )}>
                <Avatar src={conv.image} fallback={conv.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{conv.name}</p>
                    {conv.unread > 0 && (
                      <span className="text-xs bg-primary text-white rounded-full px-1.5 py-0.5 shrink-0">{conv.unread}</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedUser ? (
          <>
            <div className="p-4 border-b border-border flex items-center gap-3 bg-card">
              <Avatar src={selectedUser.image} fallback={selectedUser.name} size="sm" />
              <div>
                <p className="font-semibold text-sm">{selectedUser.name}</p>
                <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={cn("flex gap-2", msg.isAdmin ? "justify-end" : "justify-start")}>
                  {!msg.isAdmin && <Avatar src={msg.user?.image} fallback={msg.user?.name} size="sm" className="shrink-0 mt-1" />}
                  <div className={cn("max-w-[70%] rounded-2xl px-4 py-2.5 text-sm",
                    msg.isAdmin ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted rounded-bl-sm"
                  )}>
                    <p>{msg.message}</p>
                    <p className={cn("text-xs mt-1", msg.isAdmin ? "text-primary-foreground/60" : "text-muted-foreground")}>
                      {format(new Date(msg.createdAt), "h:mm a")}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-border flex gap-2">
              <Input
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder="Type a reply..."
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSendReply()}
                className="flex-1"
              />
              <Button onClick={handleSendReply} disabled={sending || !reply.trim()} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>Select a conversation to start replying</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
