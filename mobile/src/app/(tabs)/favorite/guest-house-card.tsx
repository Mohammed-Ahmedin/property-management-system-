import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  Pressable,
} from "react-native";
import { Heart, MapPin, Star, Users } from "lucide-react-native";
import { Property } from "@/src/types/property.type";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { AppText } from "@/src/components/ui/text";

const PRIMARY_COLOR = "#3B82F6";

interface PropertyCardProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isFavorite,
  onToggleFavorite,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const router = useRouter();

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim]);

  const handleToggleFavorite = useCallback(() => {
    onToggleFavorite(property);
  }, [property, onToggleFavorite]);

  const averageRating =
    property.feedbacks && property.feedbacks.length > 0
      ? (
          property.feedbacks.reduce((sum, fb) => sum + fb.rating, 0) /
          property.feedbacks.length
        ).toFixed(1)
      : null;

  return (
    <Pressable
      onPress={() => router.push(`/listing/${property.id}` as any)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.card}
    >
      <View key={property.id} style={styles.cardContent}>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: property.imageUrl }}
            style={{ height: 150 }}
          />

          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleToggleFavorite}
            activeOpacity={0.7}
          >
            <Heart
              size={24}
              color={isFavorite ? PRIMARY_COLOR : "#FFFFFF"}
              fill={isFavorite ? PRIMARY_COLOR : "transparent"}
              strokeWidth={2}
            />
          </TouchableOpacity>

          {property.type && (
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>
                {property.type.replace("_", " ")}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.headerRow}>
            <AppText style={styles.name} numberOfLines={1}>
              {property.name}
            </AppText>
          </View>

          <View style={styles.locationRow}>
            <MapPin size={14} color="#6B7280" />
            <Text style={styles.address} numberOfLines={1}>
              {property.location?.city || property.address}
            </Text>
          </View>

          {property.about && (
            <View style={styles.detailsRow}>
              <Users size={14} color="#6B7280" />
              <Text style={styles.detailsText}>
                Up to {property.about.maxGuests} guests
              </Text>
              {averageRating && (
                <>
                  <View style={styles.separator} />
                  <Star size={14} color="#FBBF24" fill="#FBBF24" />
                  <Text style={styles.ratingText}>{averageRating}</Text>
                  <Text style={styles.reviewCount}>
                    ({property.feedbacks?.length || 0})
                  </Text>
                </>
              )}
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
  cardContent: {
    overflow: "hidden",
    borderRadius: 16,
  },
  imageWrapper: {
    position: "relative",
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 28,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  typeBadge: {
    position: "absolute",
    top: 12,
    left: 28,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  typeBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  infoContainer: {
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  name: {
    flex: 1,
    fontSize: 18,
    color: "#111827",
    marginRight: 8,
  },
  price: {
    fontSize: 16,
    color: PRIMARY_COLOR,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  address: {
    flex: 1,
    fontSize: 14,
    color: "#6B7280",
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 12,
  },
  detailsText: {
    fontSize: 13,
    color: "#6B7280",
  },
  separator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
    marginHorizontal: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  reviewCount: {
    fontSize: 13,
    color: "#6B7280",
  },
  facilitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  facilityBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  facilityText: {
    fontSize: 12,
    color: "#4B5563",
    fontWeight: "500",
  },
});
