import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React, { useState, useRef } from "react";
import {
  ScrollView,
  Image,
  Pressable,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function RoomImages({ images }: { images: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();
  const onThumbnailPress = (index: number) => {
    setActiveIndex(index);
    scrollRef.current?.scrollTo({ x: SCREEN_WIDTH * index, animated: true });
  };

  return (
    <View>
      {/* Main Image Carousel */}
      <View style={{ position: "absolute", zIndex: 100, left: 16, top: 25 }}>
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
      </View>

      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / SCREEN_WIDTH
          );
          setActiveIndex(index);
        }}
        scrollEventThrottle={16}
        ref={scrollRef}
        style={styles.imageScroll}
      >
        {images.map((img, i) => (
          <Image
            key={i}
            source={{ uri: img.url }}
            style={styles.image}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {/* Thumbnails */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.thumbnailScroll}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {images.map((img, i) => (
          <Pressable key={i} onPress={() => onThumbnailPress(i)}>
            <Image
              source={{ uri: img.url }}
              style={[
                styles.thumbnail,
                activeIndex === i && { borderColor: "#3B82F6", borderWidth: 2 },
              ]}
              resizeMode="cover"
            />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  imageScroll: { height: 300 },
  image: { width: SCREEN_WIDTH, height: 300 },
  thumbnailScroll: { marginTop: 12 },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
});
