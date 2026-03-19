import React from "react";
import { FlatList, Pressable, TouchableOpacity, View } from "react-native";
import { ListingCardSkeleton } from "../../_components/skeleton-loader";
import { AppText } from "@/src/components/ui/text";
import { ScrollView } from "react-native-gesture-handler";
import { ListingCard } from "../../_components/listing-card";
import { useRouter } from "expo-router";
import { RefreshCcw } from "lucide-react-native";

const DataContainer = ({
  data,
  isLoading,
  isPending,
  isFetching,
}: {
  data: any;
  isLoading: boolean;
  isPending: boolean;
  isFetching: boolean;
}) => {
  const router = useRouter();

  if (isLoading || isPending || isFetching) {
    return (
      <View style={{ gap: 12, paddingHorizontal: 16, paddingVertical: 10 }}>
        <ListingCardSkeleton />
        <ListingCardSkeleton />
        <ListingCardSkeleton />
        <ListingCardSkeleton />
        <ListingCardSkeleton />
        <ListingCardSkeleton />
        <ListingCardSkeleton />
      </View>
    );
  }

  if (data?.length === 0) {
    return (
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
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{
        paddingTop: 30,
        paddingBottom: 40,
        paddingHorizontal: 16,
        gap: 12,
      }}
      renderItem={({ item }) => (
        <>
          <ListingCard
            id={item.id}
            name={item.name}
            address={item.address}
            type={item.type}
            imageUrl={item.images[0]?.url || ""}
            rating={4}
            totalReviews={2000}
          />
        </>
      )}
      showsVerticalScrollIndicator
    />
  );
};

export default DataContainer;
