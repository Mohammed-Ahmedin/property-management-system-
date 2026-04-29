import { AppText } from "@/src/components/ui/text";
import {
  View,
  StyleSheet,
  FlatList,
  ImageBackground,
  Pressable,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "@/src/providers/theme.provider";
import { Button } from "@/src/components/ui/button";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useGetHotelsHome } from "@/src/hooks/api/use-hotel";
import HotelImage from "@/src/assets/images/blur-hotel.webp";
import { useFilterDrawerStore } from "@/src/store/ui.store";
import { useState } from "react";
import FilterDrawer from "@/src/components/shared/filter-drawer";
import { LocationsListCategory } from "../_components/locations-list";
import { CategoriesContainer } from "../_components/categories-list";
import { ListingCardSkeleton } from "../_components/skeleton-loader";
import { ListingCard } from "../_components/listing-card";

export default function Tab() {
  const { theme } = useTheme();
  const { open: openFIlterDrawer } = useFilterDrawerStore();

  const { data, isLoading, isPending, isFetching, isError } =
    useGetHotelsHome();

  console.log("properties", { data });

  const router = useRouter();

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

  const handleApplyFilters = (filters: any, navigateToExplore = true) => {
    const params: Record<string, string> = {};

    if (filters.minPrice > 0) {
      params.minPrice = filters.minPrice.toString();
    }

    if (filters.maxPrice < 10000) {
      params.maxPrice = filters.maxPrice.toString();
    }

    if (filters.city) {
      params.city = filters.city;
    }

    if (filters.subcity) {
      params.subcity = filters.subcity;
    }

    if (filters.type) {
      params.type = filters.type;
    }

    if (navigateToExplore) {
      // Navigate to /explore page with params
      router.push({ pathname: "/explore", params });
    } else {
      // Just update the current route with params
      router.setParams(params);
    }
  };

  const hasActiveFilters =
    activeFilters.minPrice > 0 ||
    activeFilters.maxPrice < 10000 ||
    activeFilters.city ||
    activeFilters.subcity ||
    activeFilters.type;

  const handleNavigateToExplore = () => {
    router.push("/explore" as any);
  };

  const handleOpenFilterDrawer = () => {
    openFIlterDrawer();
  };

  return (
    <ScrollView style={styles.container}>
      {/* top header */}
      <ImageBackground
        source={HotelImage}
        style={{
          height: 260,
          width: "100%",
          borderBottomLeftRadius: 35, // adjust radius as needed
          borderBottomRightRadius: 35, // adjust radius as needed
          overflow: "hidden",
          paddingTop: 25,
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
          }}
        >
          <AppText style={{ fontSize: 22, color: "#fff" }} weight="medium">
            Kuru Rent
          </AppText>
          <AppText style={{ color: "white", fontSize: 18 }}>EN</AppText>
        </View>

        {/*  */}
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 70,
          }}
        >
          <AppText color="white" weight="bold" style={{ fontSize: 28 }}>
            Hey there 👋, Tell us where you want to go
          </AppText>
        </View>

        <Pressable
          style={{ paddingHorizontal: 16 }}
          onPress={() => setFilterVisible(true)}
        >
          <View
            style={{
              marginTop: 10,
              position: "relative",
              paddingHorizontal: 14,
              width: "100%",
              height: 55,
              backgroundColor: theme.colors.card,
              borderRadius: 109,
              flexDirection: "row",
              gap: 16,
              alignItems: "center",
            }}
          >
            <FontAwesome name="search" size={18} style={{}} />

            <View>
              <AppText style={{ fontSize: 18 }} weight="medium">
                Search Places
              </AppText>
              <AppText
                weight="regular"
                style={{
                  fontSize: 13,
                  opacity: 50,
                  color: theme.colors.textMuted,
                }}
              >
                Filter by price or type
              </AppText>
            </View>
          </View>
        </Pressable>
      </ImageBackground>
      {/* popular location section */}
      <View
        style={{
          paddingTop: 15,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
        }}
      >
        <AppText style={{ fontSize: 18 }} weight="bold">
          Popluar Locations
        </AppText>

        <Button
          variant="link"
          style={{ paddingRight: 0 }}
          fontSize={14}
          onPress={handleNavigateToExplore}
        >
          See All
        </Button>
      </View>
      
      <LocationsListCategory />
      {/* Explore section header */}
      <View
        style={{
          paddingTop: 15,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
        }}
      >
        <AppText style={{ fontSize: 18 }} weight="bold">
          Trendings
        </AppText>

        <Button
          variant="link"
          style={{ paddingRight: 0 }}
          fontSize={14}
          onPress={handleNavigateToExplore}
        >
          See All
        </Button>
      </View>
      {/* categories */}
      {/* <CategoriesContainer /> */}
      {/* listing section */}
      {isLoading || isPending || isFetching ? (
        <View style={{ gap: 12, paddingHorizontal: 16, paddingVertical: 10 }}>
          <ListingCardSkeleton />
          <ListingCardSkeleton />
          <ListingCardSkeleton />
          <ListingCardSkeleton />
        </View>
      ) : !data?.data || isError ? (
        <View
          style={{
            width: "100%",
            height: 200,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AppText style={{ fontSize: 20 }} weight="medium">
            There is no available properties
          </AppText>{" "}
        </View>
      ) : data?.data?.length === 0 ? (
        <View
          style={{
            width: "100%",
            height: 200,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AppText style={{ fontSize: 20 }} weight="medium">
            No properties available
          </AppText>{" "}
        </View>
      ) : (
        <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
          <FlatList
            data={data?.data}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingTop: 20, gap: 12 }}
            style={{ gap: 12 }}
            renderItem={({ item, index }) => (
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
            showsVerticalScrollIndicator={true}
          />
        </View>
      )}
      <FilterDrawer
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={handleApplyFilters}
        initialValues={activeFilters}
      />{" "}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {},
});
