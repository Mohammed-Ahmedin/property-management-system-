import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { handleTanstackError } from "./handlers/error";
import { api } from ".";
import type { MutationSuccessResponse } from "./types";

interface CreateReviewInput {
  content: string;
  rating: number;
  propertyId: string;
}
export const useCreateReview = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateReviewInput) => {
      const response = await api.post<MutationSuccessResponse>(
        "/properties/reviews",
        input
      );
      return response.data;
    },
    onError: (error) => handleTanstackError({ error }),
    onSuccess: ({ message }, { propertyId }) => {
      qc.invalidateQueries({ queryKey: ["reviews", propertyId] });
      toast.message(message);
    },
  });
};

export interface ReviewData {
  user: {
    name: string;
    id: string;
    email: string;
    image: string;
  };
  id: string;
  userId: string | null;
  propertyId: string;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  rating: number | null;
}
export const useGetReviewsQuery = ({
  propertyId,
}: {
  propertyId: string;
}) => {
  return useQuery<{ data: ReviewData[]; success: true }>({
    queryKey: ["reviews", propertyId],
    queryFn: async () => {
      const res = await api.get<{ data: ReviewData[]; success: true }>(
        `/properties/reviews/${propertyId}`
      );

      return res.data;
    },
  });
};
