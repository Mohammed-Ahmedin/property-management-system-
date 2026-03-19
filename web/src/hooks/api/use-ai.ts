import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleTanstackError } from "./handlers/error";
import { api } from ".";

export interface SendToChatbotInput {
  messages: any[];
  message: string;
  language: string
}

export const useSendToChatbot = () => {
  return useMutation({
    mutationFn: async (input: SendToChatbotInput) => {
      const response = await api.post<{ reply: string; success: boolean }>(
        "/ai/chatbot",
        input
      );
      return response.data;
    },
    onError: (error) => handleTanstackError({ error }),
    onSuccess: () => {},
    
  });
};
