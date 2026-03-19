import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  ImageBackground,
} from "react-native";
import { usePathname, useRouter } from "expo-router";
import {
  Calendar,
  Users,
  MapPin,
  CreditCard,
  Info,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from "lucide-react-native";
import { StatusBadge } from "../(tabs)/bookings/status-badge";
import { useBookingDetailQuery } from "@/src/hooks/api/use-bookings";
import { FullPageLoader } from "@/src/components/shared/loaders";
import { PriceTag } from "@/src/components/shared/price-tag";
import { AppText } from "@/src/components/ui/text";

const PRIMARY_COLOR = "#3B82F6";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function BookingDetailScreen() {
  const pathname = usePathname();
  const id = pathname.split("/")[2];
  const router = useRouter();

  const { data, isLoading, isError } = useBookingDetailQuery(id);
  const booking = data?.data;

  console.log("----------------------", { booking });
  const [expanded, setExpanded] = useState({
    checkin: true,
    guests: false,
    room: false,
    payment: true,
    services: false,
  });

  const toggleSection = (key: keyof typeof expanded) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const calculateNights = () => {
    if (!booking?.checkIn || !booking?.checkOut) return 0;
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => Number(booking?.totalAmount || 0);

  if (isLoading) return <FullPageLoader />;

  if (isError || !booking) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load booking details.</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.retryButton}
        >
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={{
            uri:
              booking.room.images?.[0]?.url ||
              "https://via.placeholder.com/300",
          }}
          style={styles.image}
          resizeMode="cover"
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <ArrowLeft size={24} color={"white"} />
          </TouchableOpacity>
        </ImageBackground>

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.roomName}>{booking.room.name}</Text>
              <Text style={styles.roomType}>
                {booking.room.type || "Standard"}
              </Text>
            </View>
            <StatusBadge status={booking.status} type="booking" />
          </View>

          {/* === CHECK-IN DETAILS === */}
          <CollapsibleCard
            title="Check-in & Check-out"
            icon={<Calendar size={20} color={PRIMARY_COLOR} />}
            expanded={expanded.checkin}
            onToggle={() => toggleSection("checkin")}
          >
            <View style={styles.dateContainer}>
              <View style={styles.dateBox}>
                <Text style={styles.dateLabel}>Check-in</Text>
                <Text style={styles.dateValue}>
                  {formatDate(booking.checkIn)}
                </Text>
                <Text style={styles.timeValue}>
                  {formatTime(booking.checkIn)}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.dateBox}>
                <Text style={styles.dateLabel}>Check-out</Text>
                <Text style={styles.dateValue}>
                  {formatDate(booking.checkOut)}
                </Text>
                <Text style={styles.timeValue}>
                  {formatTime(booking.checkOut)}
                </Text>
              </View>
            </View>
            <View style={styles.nightsInfo}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.nightsText}>
                {calculateNights()}{" "}
                {calculateNights() === 1 ? "night" : "nights"}
              </Text>
            </View>
          </CollapsibleCard>

          {/* === GUESTS === */}
          <CollapsibleCard
            title="Guest Information"
            icon={<Users size={20} color={PRIMARY_COLOR} />}
            expanded={expanded.guests}
            onToggle={() => toggleSection("guests")}
          >
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Number of guests</Text>
              <Text style={styles.infoValue}>
                {booking.guests} {booking.guests === 1 ? "guest" : "guests"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Max occupancy</Text>
              <Text style={styles.infoValue}>
                {booking.room.max_occupancy || 1}{" "}
                {booking.room.max_occupancy === 1 ? "person" : "people"}
              </Text>
            </View>
          </CollapsibleCard>

          {/* === GUESTS === */}
          {booking?.additionalServices?.length > 0 && (
            <CollapsibleCard
              title="Additional Services"
              icon={<Users size={20} color={PRIMARY_COLOR} />}
              expanded={expanded.services}
              onToggle={() => toggleSection("services")}
            >
              {booking?.additionalServices?.map((s: any) => (
                <View style={styles.infoRow} key={s.id}>
                  <Text style={styles.infoValue}>
                    <Text style={styles.infoValue}>{s.name}</Text>
                  </Text>
                </View>
              ))}
            </CollapsibleCard>
          )}

          {/* === ROOM DETAILS === */}
          <CollapsibleCard
            title="Room Details"
            icon={<Info size={20} color={PRIMARY_COLOR} />}
            expanded={expanded.room}
            onToggle={() => toggleSection("room")}
          >
            <Text style={styles.description}>{booking.room.description}</Text>
            <View style={styles.roomDetails}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Room ID</Text>
                <Text style={styles.detailValue}>{booking.room.roomId}</Text>
              </View>
              {booking.roomk.squareMeters && (
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Size</Text>
                  <Text style={styles.detailValue}>
                    {booking.room.squareMeters || 0} m²
                  </Text>
                </View>
              )}
            </View>
          </CollapsibleCard>

          {/* === PAYMENT === */}
          <CollapsibleCard
            title="Payment Information"
            icon={<CreditCard size={20} color={PRIMARY_COLOR} />}
            expanded={expanded.payment}
            onToggle={() => toggleSection("payment")}
          >
            <View style={styles.paymentRow}>
              <Text style={styles.infoLabel}>Payment Status</Text>
              <StatusBadge
                status={booking.payment?.status || "PENDING"}
                type="payment"
              />
            </View>

            {booking.payment?.transactionRef && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Transaction Ref</Text>
                <Text style={styles.infoValue}>
                  {booking.payment.transactionRef}
                </Text>
              </View>
            )}

            {booking.payment?.method && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Payment Method</Text>
                <Text style={styles.infoValue}>{booking.payment.method}</Text>
              </View>
            )}
          </CollapsibleCard>

          {/* === TOTAL === */}
          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                {booking.room.price || booking.totalAmount} ×{" "}
                {calculateNights()}{" "}
                {calculateNights() === 1 ? "night" : "nights"}
              </Text>
              <Text style={styles.totalValue}>
                <PriceTag amount={calculateTotal()} fontSize={15} />
              </Text>
            </View>

            <View style={styles.totalDivider} />
            <View style={styles.totalRow}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={styles.grandTotalValue}>
                <PriceTag amount={booking.totalAmount} fontSize={23} />
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const CollapsibleCard = ({
  title,
  icon,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => {
  return (
    <View style={styles.section}>
      <TouchableOpacity onPress={onToggle} style={styles.sectionHeader}>
        {icon}
        <Text style={styles.sectionTitle}>{title}</Text>
        {expanded ? (
          <ChevronUp size={18} color="#6B7280" style={{ marginLeft: "auto" }} />
        ) : (
          <ChevronDown
            size={18}
            color="#6B7280"
            style={{ marginLeft: "auto" }}
          />
        )}
      </TouchableOpacity>
      {expanded && <View style={{ marginTop: 8 }}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 32 },
  backBtn: {
    marginLeft: 16,
    marginTop: 20,
    backgroundColor: PRIMARY_COLOR,
    width: 60,
    height: 50,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  image: { width: "100%", height: 300, backgroundColor: "#F3F4F6" },
  content: { padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    gap: 12,
  },
  headerText: { flex: 1 },
  roomName: { fontSize: 24, color: "#111827", fontFamily: "Inter_700Bold" },
  roomType: {
    fontSize: 14,
    color: "#6B7280",
    textTransform: "capitalize",
    fontFamily: "Inter_400Regular",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#111827",
    fontFamily: "Inter_600SemiBold",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  dateBox: { flex: 1 },
  dateLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
    fontFamily: "Inter_400Regular",
  },
  dateValue: {
    fontSize: 14,
    color: "#111827",
    marginBottom: 2,
    fontFamily: "Inter_600SemiBold",
  },
  timeValue: { fontSize: 12, color: "#6B7280", fontFamily: "Inter_400Regular" },
  divider: { width: 1, backgroundColor: "#E5E7EB", marginHorizontal: 16 },
  nightsInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  nightsText: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "Inter_400Regular",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoLabel: { fontSize: 14, color: "#6B7280", fontFamily: "Inter_400Regular" },
  infoValue: {
    fontSize: 14,
    color: "#111827",
    fontFamily: "Inter_600SemiBold",
  },
  description: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
    marginBottom: 16,
    fontFamily: "Inter_400Regular",
  },
  roomDetails: { flexDirection: "row", gap: 16 },
  detailItem: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
    fontFamily: "Inter_400Regular",
  },
  detailValue: {
    fontSize: 16,
    color: "#111827",
    fontFamily: "Inter_600SemiBold",
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 8,
  },
  totalSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "Inter_400Regular",
  },
  totalValue: {
    fontSize: 14,
    color: "#111827",
    fontFamily: "Inter_600SemiBold",
  },
  totalDivider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 8 },
  grandTotalLabel: {
    fontSize: 18,
    color: "#111827",
    fontFamily: "Inter_700Bold",
  },
  grandTotalValue: {
    fontSize: 24,
    color: PRIMARY_COLOR,
    fontFamily: "Inter_700Bold",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  errorText: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 10,
    fontFamily: "Inter_400Regular",
  },
  retryButton: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: { color: "white", fontFamily: "Inter_600SemiBold" },
});
