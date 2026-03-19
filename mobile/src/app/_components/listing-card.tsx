// src/components/ListingCard.tsx
import { AppText } from "@/src/components/ui/text";
import { useTheme } from "@/src/providers/theme.provider";
import { useRouter } from "expo-router";
import { View, StyleSheet, Image, Pressable } from "react-native";

interface ListingCardProps {
  id: string;
  name: string;
  address: string;
  type: string;
  imageUrl: string;
  rating: number;
  totalReviews: number;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  id,
  name,
  address,
  type,
  imageUrl,
  rating,
  totalReviews,
}) => {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/listing/${id}`)}
      style={[
        styles.card,

        {
          backgroundColor: theme.colors.card,
          borderRadius: 12,
        },
      ]}
    >
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <AppText style={[styles.name, { color: theme.colors.text }]}>
          {name}
        </AppText>
        <AppText style={[styles.address, { color: theme.colors.textMuted }]}>
          {address}
        </AppText>
        <AppText style={[styles.type, { color: theme.colors.textMuted }]}>
          {type}
        </AppText>
        <AppText style={[styles.rating, { color: theme.colors.text }]}>
          ⭐ {rating} ({totalReviews})
        </AppText>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    flexDirection: "row",
    overflow: "hidden",
  },
  image: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  name: {
    fontSize: 16,
  },
  address: {
    fontSize: 14,
  },
  type: {
    fontSize: 12,
  },
  rating: {
    fontSize: 12,
  },
});
