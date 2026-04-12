"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { api } from "@/hooks/api";
import { Avatar } from "@/components/shared/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, MessageSquare, Users, Search, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format, isToday, isYesterday } from "date-fns";
import LoaderState from "@/components/shared/loader-state";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL || "";

function formatTime(date: string) {
  const d = new Date(date);
  if (isToday(d)) return format(d, "h:mm a");
  if (isYesterday(d)) return "Yesterday";
  return format(d, "MMM d");
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const selectedUserRef = useRef<any>(null);
  const socketRef = useRef<Socket | null>(null);
  // Track pending optimistic ID for admin replies
  const pendingOptRef = useRef<string | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Init socket
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_session_token") : null;
    const socket = io(SERVER_URL, {
      auth: { isAdmin: true, token },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
    });
    socketRef.current = socket;

    socket.on("message:new", (msg: any) => {
      const forUser = msg.forUserId || msg.userId;
      if (selectedUserRef.current?.id === forUser) {
        setMessages(prev => {
          // Replace pending optimistic with real message
          if (pendingOptRef.current && msg.isAdmin) {
            pendingOptRef.current = null;
            return prev.map(m => m.id?.toString().startsWith("opt-") ? msg : m);
          }
          if (prev.some(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }
      loadConversations();
    });

    socket.on("conversations:update", () => loadConversations());

    return () => { socket.disconnect(); };
  }, []);

  const loadConversations = useCallback(async () => {
    try {
      const res = await api.get("/chat/admin/conversations");
      setConversations(res.data.data || []);
    } catch (err: any) {
      // If 401, retry once after a short delay (token might not be ready yet after refresh)
      if (err?.response?.status === 401) {
        setTimeout(async () => {
          try {
            const res = await api.get("/chat/admin/conversations");
            setConversations(res.data.data || []);
          } catch {}
          setLoading(false);
        }, 1500);
        return;
      }
    }
    setLoading(false);
  }, []);

  const loadMessages = useCallback(async (userId: string, pageNum = 1, prepend = false) => {
    try {
      const res = await api.get(`/chat/admin/${userId}`, { params: { page: pageNum, limit: 50 } });
      const newMsgs = res.data.data || [];
      setTotalPages(res.data.totalPages || 1);
      if (prepend) {
        setMessages(prev => [...newMsgs, ...prev]);
      } else {
        setMessages(newMsgs);
      }
      if (!prepend) loadConversations();
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setTimeout(() => loadMessages(userId, pageNum, prepend), 1500);
      }
    }
  }, [loadConversations]);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    selectedUserRef.current = user;
    setPage(1);
    setTotalPages(1);
    loadMessages(user.id, 1);
    // Join socket room for this user
    socketRef.current?.emit("admin:join", user.id);
  };

  const handleLoadMore = async () => {
    if (!selectedUser || page >= totalPages) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    await loadMessages(selectedUser.id, nextPage, true);
    setLoadingMore(false);
  };

  const handleSendReply = async () => {
    if (!reply.trim() || !selectedUser) return;
    const text = reply.trim();
    setReply("");
    setSending(true);
    const optimistic = { id: `opt-${Date.now()}`, message: text, isAdmin: true, createdAt: new Date().toISOString(), user: selectedUser };
    setMessages(prev => [...prev, optimistic]);

    if (socketRef.current?.connected) {
      // Mark optimistic as pending — socket reply will replace it
      pendingOptRef.current = optimistic.id;
      socketRef.current.emit("admin:reply", { userId: selectedUser.id, message: text });
      setSending(false);
    } else {
      // REST fallback
      try {
        const res = await api.post(`/chat/admin/${selectedUser.id}/reply`, { message: text });
        setMessages(prev => prev.map(m => m.id === optimistic.id ? res.data.data : m));
      } catch {
        setMessages(prev => prev.filter(m => m.id !== optimistic.id));
        setReply(text);
        toast.error("Failed to send reply");
      } finally {
        setSending(false);
      }
    }
  };

  const filteredConversations = conversations.filter(c =>
    !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unread || 0), 0);

  if (loading) return <LoaderState />;

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background overflow-hidden">
      {/* Sidebar */}
      <div className={cn(
        "shrink-0 border-r border-border flex flex-col bg-card transition-all duration-200",
        "w-72",
        // On mobile: overlay sidebar
        sidebarOpen ? "flex" : "hidden",
        "md:flex"
      )}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <MessageSquare className="h-4 w-4 text-primary" />
              </div>
              <span className="font-bold text-sm">Messages</span>
              {totalUnread > 0 && <Badge className="text-xs h-5 px-1.5">{totalUnread}</Badge>}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className={cn("w-1.5 h-1.5 rounded-full", socketRef.current?.connected ? "bg-emerald-500 animate-pulse" : "bg-amber-400")} />
                {socketRef.current?.connected ? "Live" : "Polling"}
              </div>
              {/* Close sidebar on mobile */}
              <button className="md:hidden p-1 rounded hover:bg-muted" onClick={() => setSidebarOpen(false)}>
                <span className="text-xs">✕</span>
              </button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-8 h-8 text-xs" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-30" />
              <p className="text-sm text-muted-foreground">{search ? "No results" : "No messages yet"}</p>
            </div>
          ) : (
            filteredConversations.map(conv => (
              <button key={conv.id} onClick={() => handleSelectUser(conv)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left border-b border-border/30",
                  selectedUser?.id === conv.id && "bg-primary/5 border-l-2 border-l-primary"
                )}>
                <div className="relative shrink-0">
                  <Avatar src={conv.image} fallback={conv.name} size="sm" />
                  {conv.unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                      {conv.unread > 9 ? "9+" : conv.unread}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className={cn("text-sm truncate", conv.unread > 0 ? "font-bold" : "font-medium")}>{conv.name}</p>
                    <span className="text-xs text-muted-foreground shrink-0 ml-1">{formatTime(conv.lastAt)}</span>
                  </div>
                  <p className={cn("text-xs truncate", conv.unread > 0 ? "text-foreground font-medium" : "text-muted-foreground")}>
                    {conv.lastMessage}
                  </p>
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
            <div className="px-5 py-3.5 border-b border-border flex items-center gap-3 bg-card shrink-0">
              {/* Show sidebar toggle on mobile */}
              <button className="md:hidden p-1.5 rounded-lg hover:bg-muted shrink-0" onClick={() => setSidebarOpen(true)}>
                <Users className="h-4 w-4" />
              </button>
              <Avatar src={selectedUser.image} fallback={selectedUser.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{selectedUser.name}</p>
                <p className="text-xs text-muted-foreground truncate">{selectedUser.email}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Real-time
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/10">
              {/* Load more / archive */}
              {page < totalPages && (
                <div className="flex justify-center">
                  <Button variant="ghost" size="sm" className="text-xs gap-1.5" onClick={handleLoadMore} disabled={loadingMore}>
                    <ChevronUp className="w-3.5 h-3.5" />
                    {loadingMore ? "Loading..." : "Load older messages"}
                  </Button>
                </div>
              )}

              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">No messages yet</div>
              ) : (
                messages.map((msg, i) => {
                  const showDate = i === 0 || format(new Date(messages[i-1].createdAt), "yyyy-MM-dd") !== format(new Date(msg.createdAt), "yyyy-MM-dd");
                  return (
                    <div key={msg.id}>
                      {showDate && (
                        <div className="flex items-center gap-2 my-3">
                          <div className="flex-1 h-px bg-border" />
                          <span className="text-xs text-muted-foreground px-2">
                            {isToday(new Date(msg.createdAt)) ? "Today" : format(new Date(msg.createdAt), "MMM d, yyyy")}
                          </span>
                          <div className="flex-1 h-px bg-border" />
                        </div>
                      )}
                      <div className={cn("flex gap-2.5", msg.isAdmin ? "justify-end" : "justify-start")}>
                        {!msg.isAdmin && <Avatar src={msg.user?.image} fallback={msg.user?.name} size="sm" className="shrink-0 mt-1" />}
                        <div className="max-w-[80%] sm:max-w-[65%]">
                          <div className={cn("rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                            msg.isAdmin
                              ? "bg-primary text-primary-foreground rounded-br-sm"
                              : "bg-background border border-border rounded-bl-sm"
                          )}>
                            <p className="leading-relaxed">{msg.message}</p>
                          </div>
                          <p className={cn("text-[10px] mt-1 px-1", msg.isAdmin ? "text-right text-muted-foreground" : "text-muted-foreground")}>
                            {format(new Date(msg.createdAt), "h:mm a")}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-border bg-card shrink-0">
              <div className="flex gap-2 items-center">
                <Input
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  placeholder={`Reply to ${selectedUser.name}...`}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSendReply()}
                  className="flex-1 rounded-xl"
                />
                <Button onClick={handleSendReply} disabled={sending || !reply.trim()} size="icon" className="rounded-xl h-10 w-10 shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <p className="font-semibold text-base mb-1">Select a conversation</p>
              <p className="text-sm text-muted-foreground mb-4">Choose a user from the left to start replying</p>
              <button className="md:hidden text-sm text-primary underline" onClick={() => setSidebarOpen(true)}>
                View conversations
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
