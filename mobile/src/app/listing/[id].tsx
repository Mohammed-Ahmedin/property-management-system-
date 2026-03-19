import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Heart,
  MapPin,
  Star,
  User,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "@/src/providers/theme.provider";
import { FontAwesome } from "@expo/vector-icons";
import { AppText } from "@/src/components/ui/text";
import { useGetSingleHotel } from "@/src/hooks/api/use-hotel";
import { FullPageLoader } from "@/src/components/shared/loaders";
import { useFavoritesStore } from "@/src/store/favorite.store";

const PRIMARY_COLOR = "#3B82F6" as const;
const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface AccordionSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function AccordionSection({
  title,
  children,
  defaultOpen = false,
}: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [animation] = useState(new Animated.Value(defaultOpen ? 1 : 0));

  const toggleAccordion = () => {
    const toValue = isOpen ? 0 : 1;
    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsOpen(!isOpen);
  };

  const maxHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 2000],
  });

  return (
    <View style={styles.accordionContainer}>
      <Pressable
        style={({ pressed }) => [
          styles.accordionHeader,
          pressed && styles.accordionHeaderPressed,
        ]}
        onPress={toggleAccordion}
      >
        <Text style={styles.accordionTitle}>{title}</Text>
        {isOpen ? (
          <ChevronUp size={20} color="#64748B" strokeWidth={2.5} />
        ) : (
          <ChevronDown size={20} color="#64748B" strokeWidth={2.5} />
        )}
      </Pressable>
      <Animated.View style={[styles.accordionContent, { maxHeight }]}>
        {children}
      </Animated.View>
    </View>
  );
}

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const router = useRouter();

  const { data, isPending, isFetching, isLoading, isError, error } =
    useGetSingleHotel({ propertyId: id });
  const { addFavorite } = useFavoritesStore();
  const isLoadingState = isPending || isFetching || isLoading;
  const fetchedData = data?.data;

  console.log('-------------------',{ fetchedData });
  const handleBack = () => {
    router.back();
  };

  if (isLoadingState) {
    return <FullPageLoader />;
  }

  // Error state
  if (isError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 16,
          backgroundColor: theme.colors.background,
        }}
      >
        <FontAwesome name="exclamation-triangle" size={40} color="red" />
        <AppText
          style={{ marginTop: 12, fontSize: 16, color: theme.colors.text }}
        >
          Failed to load hotel details.
        </AppText>
        <AppText style={{ marginTop: 6, fontSize: 14, color: "gray" }}>
          {error?.message || "Something went wrong"}
        </AppText>
      </View>
    );
  }

  // Not available state
  if (!fetchedData) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <FontAwesome name="building-o" size={40} color="gray" />
        <AppText
          style={{ marginTop: 12, fontSize: 16, color: theme.colors.text }}
        >
          Hotel not available
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={{
          position: "absolute",
          zIndex: 100,
          paddingHorizontal: 16,
          top: 25,
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "black",
            width: 40,
            height: 40,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => router.back()}
        >
          <ChevronLeft color={"white"} />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "white",
            width: 40,
            height: 40,
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() =>
            addFavorite({
              address: fetchedData?.address || "",
              id: fetchedData.id,
              imageUrl: fetchedData?.images[0].url,
              name: fetchedData?.name,
              type: fetchedData?.type,
              pricePerNight: fetchedData?.price,
              about: fetchedData?.about,
            } as any)
          }
        >
          <Heart color={"black"} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: fetchedData?.images[0].url }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <View style={styles.heroContent}>
              <Text style={styles.heroName}>{fetchedData?.name}</Text>
              <View style={styles.heroLocationRow}>
                <MapPin size={14} color="#FFFFFF" strokeWidth={2} />
                <Text style={styles.heroLocation}>{fetchedData.address}</Text>
              </View>
              <View style={styles.heroRatingRow}>
                <Star
                  size={14}
                  color="#FFA500"
                  fill="#FFA500"
                  strokeWidth={2}
                />
                <Text style={styles.heroRating}>{4.4}</Text>
                <Text style={styles.heroReviewCount}>({1709} reviews)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* rooms */}
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Rooms</Text>
            <View style={styles.roomsGrid}>
              {fetchedData?.rooms.map((room: any) => (
                <Pressable
                  key={room.id}
                  style={({ pressed }) => [
                    styles.roomCard,
                    pressed && styles.roomCardPressed,
                  ]}
                  onPress={() =>
                    router.push(`/room/${room.id}?guesthouseId=${id}` as any)
                  }
                >
                  <Image
                    source={{ uri: room?.images[0]?.url }}
                    style={styles.roomImage}
                    resizeMode="cover"
                  />

                  <View style={styles.roomContent}>
                    <Text style={styles.roomName} numberOfLines={1}>
                      {room?.name}
                    </Text>
                    <Text style={styles.roomPrice}>{room?.price} ETB /day</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.divider} />

          {/* about */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>
              {fetchedData?.about?.description}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Features</Text>
            <View style={styles.featuresGrid}>
              {[
                "Free Wi-Fi throughout the property",
                "24-hour front desk support",
                "Fitness center and spa access",
                "Smart TV with streaming apps",
              ].map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.featureDot} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* <AccordionSection title="Amenities">
            <View style={styles.amenitiesList}>
              {fetchedData?.facilities.map((amenity: any, index: any) => (
                <View key={index} style={styles.amenityItem}>
                  <View style={styles.amenityDot} />
                  <Text style={styles.amenityItemText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </AccordionSection> */}

          {/* location */}
          <AccordionSection title="Location">
            <View style={styles.amenitiesList}>
              {[
                {
                  label: "Continent",
                  value: fetchedData.location?.continent || "Unknown",
                },
                {
                  label: "Country",
                  value: fetchedData.location?.country || "Unknown",
                },
                {
                  label: "City",
                  value: fetchedData.location?.city || "Unknown",
                },
                {
                  label: "Subcity",
                  value: fetchedData.location?.subcity || "Unknown",
                },
                {
                  label: "Nearby",
                  value: fetchedData.location?.nearby || "N/A",
                },
              ].map((item, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.featureDot} />
                  <Text style={styles.featureText}>
                    <Text style={{ fontWeight: "600" }}>{item.label}: </Text>
                    {item.value}
                  </Text>
                </View>
              ))}
            </View>
          </AccordionSection>

          {/* reviews */}
          <AccordionSection title="Reviews" defaultOpen>
            <View style={styles.reviewsList}>
              <View>
                <AppText>No reviews</AppText>
              </View>
            </View>
          </AccordionSection>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  heroContainer: {
    height: 200,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: 200,
  },
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  heroContent: {
    gap: 6,
  },
  heroName: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
  },
  heroLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  heroLocation: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "Inter_500Medium",
  },
  heroRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  heroRating: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#FFFFFF",
  },
  heroReviewCount: {
    fontSize: 13,
    color: "#FFFFFF",
    fontFamily: "Inter_400Regular",
    opacity: 0.9,
  },
  content: {
    paddingBottom: 24,
  },
  divider: {
    height: 8,
    backgroundColor: "#F1F5F9",
  },
  section: {
    padding: 16,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#0F172A",
    marginBottom: 12,
  },

  description: {
    fontSize: 15,
    lineHeight: 24,
    color: "#475569",
    fontFamily: "Inter_400Regular",
  },
  featuresGrid: {
    gap: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: PRIMARY_COLOR,
  },
  featureText: {
    fontSize: 15,
    color: "#475569",
    fontFamily: "Inter_500Medium",
  },
  accordionContainer: {
    backgroundColor: "#FFFFFF",
    marginTop: 8,
    overflow: "hidden",
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  accordionHeaderPressed: {
    backgroundColor: "#F8FAFC",
  },
  accordionTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#0F172A",
  },
  accordionContent: {
    overflow: "hidden",
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
  },
  policiesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  policyItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  policyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: PRIMARY_COLOR,
    marginTop: 7,
  },
  policyText: {
    fontSize: 15,
    color: "#475569",
    fontFamily: "Inter_400Regular",
    flex: 1,
  },
  reviewsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  reviewCard: {
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewHeaderText: {
    flex: 1,
  },
  reviewUserName: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#0F172A",
  },
  reviewDate: {
    fontSize: 13,
    color: "#64748B",
    fontFamily: "Inter_400Regular",
  },
  reviewRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  reviewRatingText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#0F172A",
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 22,
    color: "#475569",
    fontFamily: "Inter_400Regular",
  },
  roomsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  roomCard: {
    width: (SCREEN_WIDTH - 52) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  roomCardPressed: {
    opacity: 0.9,
  },
  roomImage: {
    width: "100%",
    height: 120,
  },
  unavailableBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  unavailableText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  roomContent: {
    padding: 12,
  },
  roomName: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#0F172A",
    marginBottom: 6,
  },
  roomPrice: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: PRIMARY_COLOR,
  },
  hostSection: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    marginTop: 8,
  },
  hostCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: 12,
  },
  hostAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  hostInfo: {
    flex: 1,
  },
  hostName: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: "#0F172A",
    marginBottom: 4,
  },
  hostSince: {
    fontSize: 14,
    color: "#64748B",
    fontFamily: "Inter_400Regular",
  },
});
