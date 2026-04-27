"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { guesthouseManagementAI } from "@/server/actions/ai.actions";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export function ChatBotContainer() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm Kuru Rent AI. How can I help you manage your operations today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [messages]);

  // 🧠 Disable page scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // 🧠 TanStack Mutation
  const { mutate: sendToAI, isPending } = useMutation({
    mutationFn: async (input: string) => {
      const chatMessages = messages.map((m) => ({
        role: m.sender === "bot" ? "ASSISTANT" : "USER",
        content: m.text,
      }));
      return guesthouseManagementAI({
        messages: chatMessages as any,
        message: input,
      });
    },
    onSuccess: (res) => {
      const botMessage: Message = {
        id: Date.now(),
        text: res.reply,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "Sorry, I'm having trouble connecting right now. Please try again.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    },
  });

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    sendToAI(inputValue);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        <span className="sr-only">Toggle chat</span>
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="overflow-hidden fixed pt-0 bottom-24 right-6 w-[380px] h-[500px] shadow-2xl z-50 flex flex-col border-border">
          <CardHeader className="border-b pt-4 bg-primary text-primary-foreground">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary-foreground/20">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">Management Assistant</CardTitle>
                  <p className="text-xs text-primary-foreground/80">
                    AI operations helper
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2",
                  message.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.sender === "bot" && (
                  <div className="h-8 w-8 flex items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[75%] rounded-lg px-4 py-2",
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className="mt-1 text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {message.sender === "user" && (
                  <div className="h-8 w-8 flex items-center justify-center rounded-full bg-accent/10 flex-shrink-0">
                    <User className="h-4 w-4 text-accent" />
                  </div>
                )}
              </div>
            ))}
            {isPending && (
              <p className="text-sm text-gray-500 italic text-left">
                AI is thinking...
              </p>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          <CardFooter className="border-t p-4">
            <div className="flex w-full gap-2">
              <Input
                placeholder="Ask about bookings, reports, or staff tasks..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isPending}
                className="flex-1 py-6"
              />
              <Button
                onClick={handleSendMessage}
                size="icon"
                disabled={isPending}
                className="py-6 px-6"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
