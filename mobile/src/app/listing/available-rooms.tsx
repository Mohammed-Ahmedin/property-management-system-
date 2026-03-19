import { useRef, useState } from "react";
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { AppText } from "@/src/components/ui/text";
import { useTheme } from "@/src/providers/theme.provider";
import { ChevronRight } from "lucide-react-native"; // 👈 nice icon

export default function AvailableRooms({
  rooms,
  currentHotelId,
}: {
  rooms: any;
  currentHotelId: any;
}) {
  const { theme } = useTheme();
  const flatListRef = useRef<FlatList>(null);
  const [showChevron, setShowChevron] = useState(true);

  const handleScroll = (event: any) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const isEnd =
      contentOffset.x + layoutMeasurement.width >= contentSize.width - 10;
    setShowChevron(!isEnd); // hide chevron if at the end
  };

  const scrollRight = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: 200, // adjust scroll step
        animated: true,
      });
    }
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <FlatList
        ref={flatListRef}
        horizontal
        data={rooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.card, { backgroundColor: theme.colors.card }]}
          >
            <Image
              source={{ uri: item.images[0].url }}
              style={styles.image}
              resizeMode="cover"
            />
            <AppText>{item.name}</AppText>
          </Pressable>
        )}
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
      />

      {/* Chevron icon */}
      {showChevron && (
        <TouchableOpacity onPress={scrollRight} style={styles.chevron}>
          <ChevronRight size={28} color={theme.colors.text} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 120,
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 12,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  chevron: {
    position: "absolute",
    right: 6,
    top: "40%",
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
    padding: 4,
  },
});
