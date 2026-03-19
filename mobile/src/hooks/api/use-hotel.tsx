import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { SERVER_BASE_URL } from ".";

export const useGetHotelsHome = () => {
  return useQuery({
    queryKey: ["hotels"],
    queryFn: () => axios.get(`${SERVER_BASE_URL}/properties/trendings`),
  });
};

// export const useGetHotels = (filter?: any) => {
//   return useQuery({
//     queryKey: ["hotels", filter],
//     queryFn: () => {
//       const url = `${SERVER_BASE_URL}/properties?minPrice=${filter.minPrice}&maxPrice=${filter.maxPrice}&city=${filter.city}&subcity=${filter.subcity}&type=${filter.type}&search=${filter.search}`;
//       return axios.get(filter ? url : `${SERVER_BASE_URL}/get-properties`);
//     },
//   });
// };

export const useGetHotels = (filters: any) => {
  return useInfiniteQuery({
    queryKey: ["hotels", filters],
    queryFn: async ({ pageParam = 1 }) => {
      const url = `${SERVER_BASE_URL}/properties/?minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}&city=${filters.city}&subcity=${filters.subcity}&type=${filters.type}&search=${filters.search}&page=${pageParam}`;
      const res = await axios.get(url);
      return res?.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.pagination?.hasMore
        ? lastPage.pagination.page + 1
        : undefined;
    },
    initialPageParam: 1,
  });
};

export const useGetSingleHotel = ({
  propertyId,
}: {
  propertyId: string;
}) => {
  return useQuery({
    queryKey: ["hotel", propertyId],
    queryFn: () => axios.get(`${SERVER_BASE_URL}/properties/${propertyId}`),
  });
};
