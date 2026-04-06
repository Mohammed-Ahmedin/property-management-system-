import { useQuery } from "@tanstack/react-query";
import { type PaginatedResponse, type FilterParamsInput } from "./types";
import type {
  PropertyFilters,
  PropertyStatus,
  PropertyType,
} from "@/types/property.types";
import { api } from ".";
import type { GuestDetailHouseResponse } from "./types/property.types";

interface Filters {
  minPrice?: string | null;
  maxPrice?: string | null;
  city?: string | null;
  subcity?: string | null;
  type?: string | null;
  search?: string | null;
}

export interface PropertyDataResponse {
  _count: {
    rooms: number;
    bookings: number;
    facilities: number;
  };
  facilities: {
    name: string;
    id: string;
    propertyId: string;
    icon: string | null;
  }[];
  name: string;
  id: string;
  createdAt: Date;
  status: PropertyStatus;
  updatedAt: Date;
  type: PropertyType;
  address: string;
  visibility: boolean;
  licenseId: string | null;
  categoryId: string | null;
  location: Location;
  averageRating: any;
  reviewCount: any;
  about: {
    id: string;
    createdAt: Date;
    description: string;
    propertyId: string;
    updatedAt: Date;
  };
  images: {
    name: string;
    id: string;
    propertyId: string;
    url: string;
  }[];
  rooms?: {
    id: string;
    name: string;
    price: number;
    availability: boolean;
    images?: { url: string; name: string }[];
  }[];
}

export type PaginatedPropertyDataResponse =
  PaginatedResponse<PropertyDataResponse>;

export const useGetTrendingProperties = () => {
  return useQuery<{ data: any; success: boolean }>({
    queryKey: ["trending_properties"],
    staleTime: 0,
    retry: false,
    queryFn: async () => {
      const res = await api.get<{ data: any; success: boolean }>(
        "/properties/trendings"
      );
      return res.data;
    },
  });
};

export interface NearbyPropertyDataResponse {
  _count: {
    rooms: number;
    bookings: number;
    facilities: number;
  };
  facilities: {
    name: string;
    id: string;
    propertyId: string;
    icon: string | null;
  }[];
  name: string;
  id: string;
  createdAt: Date;
  status: PropertyStatus;
  updatedAt: Date;
  type: PropertyType;
  address: string;
  visibility: boolean;
  licenseId: string | null;
  averageRating: any;
  reviewCount: any;
  categoryId: string | null;
  location: Location;
  about: {
    id: string;
    createdAt: Date;
    description: string;
    propertyId: string;
    updatedAt: Date;
  };
  images: {
    name: string;
    id: string;
    propertyId: string;
    url: string;
  }[];
  distance: number;
}

export type PaginatedNearbyPropertyDataResponse =
  PaginatedResponse<NearbyPropertyDataResponse>;

interface NearbyParams {
  lat: number;
  lon: number;
  radius?: number;
  page?: number;
  limit?: number;
  distance?: number;
}

export const useGetNearbyProperties = ({
  lat,
  lon,
  radius = 10,
  page = 1,
  limit = 10,
  distance,
}: NearbyParams) => {
  return useQuery<PaginatedNearbyPropertyDataResponse>({
    queryKey: ["nearby_properties", lat, lon, radius, page, limit, distance],
    queryFn: async () => {
      const res = await api.get<PaginatedNearbyPropertyDataResponse>(
        `/properties/nearby`,
        { params: { lat, lon, radius, page, limit, distance } }
      );
      return res.data;
    },
    enabled: !!lat && !!lon,
    retry: false,
  });
};

export const useGetProperties = (
  input: FilterParamsInput<PropertyFilters>
) => {
  return useQuery<PaginatedPropertyDataResponse>({
    queryKey: ["properties", JSON.stringify(input.filters), input.page, input.limit, input.sortDirection],
    retry: false,
    queryFn: async () => {
      const res = await api.get<PaginatedPropertyDataResponse>(
        "/properties",
        {
          params: {
            minPrice: input.filters?.minPrice || undefined,
            maxPrice: input.filters?.maxPrice || undefined,
            city: input.filters?.city || undefined,
            subcity: input.filters?.subcity || undefined,
            type: input.filters?.type || undefined,
            search: input.filters?.search || undefined,
            page: input.page,
            limit: input.limit,
            facilityNames: input.filters?.facilityNames,
            categoryId: input.filters?.categoryId,
            location: input.filters?.location,
            sortDirection: input.sortDirection,
            sortField: input.filters?.sortField,
            minRating: input.filters?.minRating || undefined,
            maxRating: input.filters?.maxRating || undefined,
            minReviewScore: (input.filters as any)?.minReviewScore || undefined,
            maxReviewScore: (input.filters as any)?.maxReviewScore || undefined,
            hasRoomsAvailable: input.filters?.hasRoomsAvailable || undefined,
            accessType: (input.filters as any)?.accessType || undefined,
          },
        }
      );
      return res.data;
    },
  });
};

export const useGetSingleProperty = ({
  propertyId,
}: {
  propertyId: string;
}) => {
  return useQuery<GuestDetailHouseResponse>({
    queryKey: ["hotel", propertyId],
    queryFn: async () => {
      const res = await api.get<GuestDetailHouseResponse>(
        `/properties/${propertyId}`
      );
      return res.data;
    },
  });
};
