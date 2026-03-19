import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { Users, Maximize, CheckCircle } from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AppText } from "@/src/components/ui/text";
import { useTheme } from "@/src/providers/theme.provider";
import { useGetSingleRoom } from "@/src/hooks/api/use-room";
import RoomImages from "./room-images";
import BookingModal from "./booking-modal";
import { authClient } from "@/src/lib/auth-client";
import { AccordionSection } from "../listing/[id]";
import { FullPageLoader } from "@/src/components/shared/loaders";
import { PriceTag } from "@/src/components/shared/price-tag";

const PRIMARY_COLOR = "#3B82F6" as const;
const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function RoomDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string; guesthouseId: string }>();
  const {
    data: fetchedData,
    isLoading,
    isError,
    isFetching,
  } = useGetSingleRoom({
    roomId: id,
  });
  const { data, isPending: userDataIsPending } = authClient.useSession();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const roomData = fetchedData?.data;

  const handleBookNow = async () => {
    const { data } = await authClient.getSession();

    if (data?.user) {
      setModalVisible(true);
    } else {
      router.push(`/auth?callBackUrl=/room/${id}/`);
    }
  };

  if (isLoading || isFetching) {
    return <FullPageLoader />;
  }

  if (!roomData || isError) return <Redirect href={"/(tabs)/explore"} />;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <RoomImages images={roomData?.images} />

        {/* Content */}
        <View style={styles.content}>
          {/* Room Header */}
          <View>
            <Text style={styles.roomName}>{roomData?.name}</Text>
            <Text style={styles.roomDescription}>{roomData?.description}</Text>
          </View>
          {/* Key Info */}
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Users size={24} color={PRIMARY_COLOR} strokeWidth={2} />
              <Text style={styles.infoLabel}>Max Guests</Text>
              <Text style={styles.infoValue}>{roomData?.max_occupancy}</Text>
            </View>
            <View style={styles.infoItem}>
              <Maximize size={24} color={PRIMARY_COLOR} strokeWidth={2} />
              <Text style={styles.infoLabel}>Size</Text>
              <Text style={styles.infoValue}>
                {roomData?.square_meters} sq ft
              </Text>
            </View>
            <View style={styles.infoItem}>
              <CheckCircle size={24} color="green" />
              <Text style={styles.infoLabel}>Availability</Text>
              <Text style={styles.infoValue}>
                {roomData?.availability ? "Available" : "Unavailable"}
              </Text>
            </View>
          </View>

          {/* Features by Category */}
          {roomData?.features && roomData.features.length > 0 && (
            <>
              {(
                Object?.entries(
                  roomData?.features?.reduce((acc: any, feature: any) => {
                    const category = feature?.category || "Other Features";
                    if (!acc[category]) acc[category] = [];
                    acc[category].push(feature);
                    return acc;
                  }, {})
                ) as any
              )?.map(([category, items]: [string, any[]]) => (
                <AccordionSection
                  key={category}
                  title={category
                    ?.replace(/_/g, " ")
                    ?.replace(/\b\w/g, (c) => c.toUpperCase())}
                >
                  <View style={styles.amenitiesList}>
                    {items.map((feature) => (
                      <View key={feature?.id} style={styles.amenityItem}>
                        <View style={styles.amenityDot} />
                        <Text style={styles.amenityItemText}>
                          {feature?.name || "Unnamed Feature"}
                        </Text>
                      </View>
                    ))}
                  </View>
                </AccordionSection>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.priceLabel}>Price per day</Text>
          <PriceTag style={{}} amount={roomData?.price} color="black"  fontSize={20}/>
        </View>
        <Pressable
          style={styles.bookButton}
          onPress={() => {
            handleBookNow();
          }}
          disabled={userDataIsPending}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </Pressable>
      </View>

      <BookingModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        roomName={roomData?.name}
        roomPrice={roomData?.price}
        roomId={roomData?.id}
        roomDescription={roomData?.description}
        discountPercent={10}
        availableServices={roomData.services}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  imageScroll: { height: 300 },
  image: { width: SCREEN_WIDTH, height: 300 },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: PRIMARY_COLOR,
    marginHorizontal: 4,
  },
  content: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 },
  roomName: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    color: "#0F172A",
  },
  roomDescription: {
    fontSize: 16,
    lineHeight: 26,
    color: "#475569",
    fontFamily: "Inter_400Regular",
    marginBottom: 24,
  },
  infoGrid: { flexDirection: "row", gap: 12, marginBottom: 24 },
  infoItem: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  infoLabel: { fontSize: 13, color: "#64748B", fontFamily: "Inter_500Medium" },
  infoValue: { fontSize: 16, color: "#0F172A", fontFamily: "Inter_700Bold" },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#0F172A",
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    color: "#475569",
    fontFamily: "Inter_500Medium",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: "#64748B",
    fontFamily: "Inter_500Medium",
    marginBottom: 4,
  },
  price: { fontSize: 24, fontFamily: "Inter_700Bold", color: PRIMARY_COLOR },
  bookButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 50,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  bookButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  amenitiesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  amenityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: PRIMARY_COLOR,
  },
  amenityItemText: {
    fontSize: 15,
    color: "#475569",
    fontFamily: "Inter_400Regular",
    textTransform: "capitalize",
  },
});
