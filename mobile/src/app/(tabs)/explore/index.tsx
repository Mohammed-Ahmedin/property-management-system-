import { AppText } from "@/src/components/ui/text";
import { TouchableOpacity, View, FlatList, Pressable } from "react-native";
import { useTheme } from "@/src/providers/theme.provider";
import { Input } from "@/src/components/ui/input";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ArrowUpDown,
  RefreshCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react-native";
import FilterDrawer from "@/src/components/shared/filter-drawer";
import { Button } from "@/src/components/ui/button";
import { useGetHotels } from "@/src/hooks/api/use-hotel";
import { ListingCard } from "../../_components/listing-card";
import { ListingCardSkeleton } from "../../_components/skeleton-loader";

const ExploreScreen = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [filterVisible, setFilterVisible] = useState<boolean>(false);

  const params = useLocalSearchParams<{
    minPrice?: string;
    maxPrice?: string;
    city?: string;
    subcity?: string;
    type?: "private" | "shared";
    search?: string;
  }>();

  const activeFilters: any = {
    minPrice: params.minPrice ? parseInt(params.minPrice, 10) : 0,
    maxPrice: params.maxPrice ? parseInt(params.maxPrice, 10) : 10000,
    city: params.city ?? "",
    subcity: params.subcity ?? "",
    type: params.type ?? "",
    search: params.search ?? "",
  };

  const handleApplyFilters = (filters: any) => {
    const params: Record<string, string> = {};
    if (filters.minPrice > 0) params.minPrice = filters.minPrice.toString();
    if (filters.maxPrice < 10000) params.maxPrice = filters.maxPrice.toString();
    if (filters.city) params.city = filters.city;
    if (filters.subcity) params.subcity = filters.subcity;
    if (filters.type) params.type = filters.type;
    if (filters.search) params.search = filters.search;
    router.setParams(params);
  };

  const hasActiveFilters =
    activeFilters.minPrice > 0 ||
    activeFilters.maxPrice < 10000 ||
    activeFilters.city ||
    activeFilters.subcity ||
    activeFilters.type;

  const handleSearch = () => {
    router.push({
      pathname: "/(tabs)/explore",
      params: {
        ...params,
        search: searchValue,
      },
    });
  };

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetching,
    isError,
  } = useGetHotels(activeFilters);

  useEffect(() => {
    refetch();
  }, [activeFilters, refetch]);

  const hotels = data?.pages ? data?.pages?.flatMap((page) => page?.data) : [];

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={{ width: "100%", paddingHorizontal: 16, marginTop: 10 }}>
        <AppText weight="bold" style={{ fontSize: 22 }}>
          Explore
        </AppText>
      </View>

      {/* Search */}
      <View
        style={{
          gap: 5,
          flexDirection: "row",
          marginTop: 10,
          paddingHorizontal: 16,
          alignItems: "center",
          width: "100%",
        }}
      >
        <Input
          placeholder="Search Here"
          onChangeText={setSearchValue}
          defaultValue={params.search}
          style={{
            borderRadius: 10,
            fontSize: 16,
            lineHeight: 24,
            height: 50,
            fontFamily: "Inter_500Medium",
            flex: 1,
          }}
        />

        <Button style={{ borderRadius: 10, height: 50 }} onPress={handleSearch}>
          <Search color={"white"} />
        </Button>
      </View>

      {/* Categories */}
      {/* <View style={{ marginTop: 6, flexDirection: "row" }}>
        <CategoriesContainer hardRefersh={false} />
      </View> */}

      {/* Filter & Sort */}
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          paddingHorizontal: 16,
          marginTop: 10,
          paddingVertical: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => setFilterVisible(true)}
          style={{
            flex: 1,
            flexDirection: "row",
            gap: 8,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SlidersHorizontal size={20} color="#0891b2" />
          <AppText>Filter</AppText>
          {hasActiveFilters && <View />}
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: "row",
            gap: 8,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ArrowUpDown size={20} color="#0891b2" />
          <AppText>Sort</AppText>
        </TouchableOpacity>
      </View>

      {/* Hotels List with Infinite Scroll */}
      {isFetching || isLoading ? (
        <View
          style={{
            gap: 12,
            paddingHorizontal: 16,
            paddingVertical: 10,
            height: "auto",
            width: "100%",
          }}
        >
          <ListingCardSkeleton />
          <ListingCardSkeleton />
          <ListingCardSkeleton />
          <ListingCardSkeleton />
          <ListingCardSkeleton />
          <ListingCardSkeleton />
          <ListingCardSkeleton />
        </View>
      ) : !hotels ? (
        ""
      ) : hotels.length === 0 ? (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 10,
            marginTop: 150, // optional spacing
          }}
        >
          <AppText style={{ fontSize: 20 }} weight="medium">
            No properties available
          </AppText>

          <Pressable
            onPress={() => router.push("/(tabs)/explore")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              paddingVertical: 8,
              paddingHorizontal: 16,
              backgroundColor: "#ef4444", // red-500
              borderRadius: 8,
            }}
          >
            <RefreshCcw size={20} color="#fff" />
            <AppText style={{ color: "#fff", fontSize: 16 }} weight="medium">
              Clear Filter
            </AppText>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={hotels}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{
            paddingTop: 30,
            paddingBottom: 100,
            paddingHorizontal: 16,
            gap: 12,
          }}
          renderItem={({ item }) => (
            <ListingCard
              id={item.id}
              name={item.name}
              address={item.address}
              type={item.type}
              imageUrl={item.images[0]?.url || ""}
              rating={4}
              totalReviews={2000}
            />
          )}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            isFetchingNextPage ? (
              <AppText style={{ textAlign: "center", marginVertical: 10 }}>
                Loading more...
              </AppText>
            ) : null
          }
          refreshing={isLoading}
          onRefresh={refetch}
        />
      )}

      {/* Filter Drawer */}
      <FilterDrawer
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={handleApplyFilters}
        initialValues={activeFilters}
      />
    </View>
  );
};

export default ExploreScreen;
