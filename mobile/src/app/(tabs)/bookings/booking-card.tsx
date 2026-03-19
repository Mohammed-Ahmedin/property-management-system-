import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Calendar, Users, MapPin } from "lucide-react-native";
import { useRouter } from "expo-router";
import { StatusBadge } from "./status-badge";
import { Booking } from "./type";
import { PriceTag } from "@/src/components/shared/price-tag";

interface BookingCardProps {
  booking: Booking;
}

const PRIMARY_COLOR = "#3B82F6";

export const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateNights = () => {
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handlePress = () => {
    router.push(`/bookings/${booking.id}` as any);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.7}
      testID={`booking-card-${booking.id}`}
    >
      <Image
        source={{ uri: booking.room.images[0]?.url }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.roomName} numberOfLines={1}>
            {booking.room.name}
          </Text>
          <StatusBadge status={booking.status} type="booking" />
        </View>

        <View style={styles.infoRow}>
          <Calendar size={16} color="#6B7280" />
          <Text style={styles.infoText}>
            {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <MapPin size={16} color="#6B7280" />
          <Text style={styles.infoText}>
            {calculateNights()} {calculateNights() === 1 ? "day" : "days"}
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.infoRow}>
            <Users size={16} color="#6B7280" />
            <Text style={styles.infoText}>
              {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
            </Text>
          </View>
          <Text style={styles.price}>
            <PriceTag amount={booking?.room?.price} />
            /day
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200,
    backgroundColor: "#F3F4F6",
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 8,
  },
  roomName: {
    fontSize: 18,
    color: "#111827",
    fontFamily: "Inter_700Bold",
    flex: 1,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "Inter_400Regular",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    color: PRIMARY_COLOR,
    fontFamily: "Inter_700Bold",
  },
});
