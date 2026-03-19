import React, { useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { LoginPrompt } from "../../../components/ui/login-prompt";
import { BookingCard } from "./booking-card";
import { EmptyState } from "./empty-state";
import { authClient } from "@/src/lib/auth-client";
import { AppText } from "@/src/components/ui/text";
import { useGetUserBookingsQuery } from "@/src/hooks/api/use-bookings";
import { FullPageLoader } from "@/src/components/shared/loaders";

export default function BookingsScreen() {
  const { data: userData, isPending } = authClient.useSession();
  const {
    data: bookingsData,
    refetch: refetchBookings,
    isFetching: isBookingFetching,
    isLoading,
  } = useGetUserBookingsQuery({
    userId: userData?.user?.id || "",
  });

  useEffect(() => {
    refetchBookings();
  }, []);

  if (isBookingFetching || isLoading || isPending) {
    return <FullPageLoader />;
  }

  // Check if data is not available (e.g., user is not logged in)
  if (!userData) {
    return <LoginPrompt />;
  }

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={{}}>
        <View
          style={{ width: "100%", paddingHorizontal: 16, paddingTop: 30, paddingBottom: 20 }}
        >
          <View style={{ flexDirection: "column" }}>
            <AppText weight="bold" style={{ fontSize: 22 }}>
              Bookings
            </AppText>
          </View>
        </View>
      </View>

      <FlatList
        data={bookingsData?.data as any}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BookingCard booking={item} />}
        contentContainerStyle={
          (bookingsData?.data as any)?.length === 0
            ? styles.emptyContainer
            : styles.listContent
        }
        ListEmptyComponent={<EmptyState />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9FAFB",
  },
  listContent: {
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
  },
  logoutButton: {
    padding: 8,
    marginRight: 8,
  },
});
