// src/components/LocationsListCategory.tsx
import React, { useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  ImageBackground,
  Pressable,
} from "react-native";
import { AppText } from "@/src/components/ui/text";
import LocationImage from "@/src/assets/images/hotel-1.jpg";
import { useRouter } from "expo-router";

const locationData = [
  {
    id: 1,
    name: "Kotebe",
    image:
      "https://bwplusaddisababa.com/wp-content/uploads/2019/10/hotelsinboleaddisababa.webp",
  },
  {
    id: 2,
    name: "Bole",
    image:
      "https://i.pinimg.com/736x/24/e0/f0/24e0f0acb2e3bf9c517d28900e4f8a7a.jpg",
  },
  {
    id: 3,
    name: "Megenagna",
    image:
      "https://www.ethiopianairlines.com/images/globallibraries/default-album/eh3.jpg?sfvrsn=f91c61c6_23",
  },
  {
    id: 4,
    name: "Piassa",
    image: "https://shegahome.com/storage/news/ethiopia-real-estate.jpg",
  },
  {
    id: 5,
    name: "Sarbet",
    image:
      "https://www.gorebet.com/wp-content/uploads/2021/04/ayat-Real-Estate-in-Ethiopia-1024x493.gif",
  },
  {
    id: 6,
    name: "Kazanchis",
    image:
      "https://www.gorebet.com/wp-content/uploads/2021/04/ayat-Real-Estate-in-Ethiopia-1024x493.gif",
  },
];

export const LocationsListCategory = () => {
  const router = useRouter();

  const handleSearch = (value: any) => {
    // apply filters here
    router.push(`/explore?city=${value}`);
  };

  return (
    <ScrollView
      horizontal
      contentContainerStyle={styles.container}
      showsHorizontalScrollIndicator={false}
    >
      <View
        style={{
          flexDirection: "row",
          paddingLeft: 16,
          overflow: "hidden",
          gap: 6,
        }}
      >
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
          {locationData.map((location, index) => (
            <Pressable
              key={index}
              style={{ alignItems: "center" }}
              onPress={() => handleSearch(location.name)}
            >
              <ImageBackground
                source={{ uri: location.image }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 50,
                  overflow: "hidden",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
              <AppText style={{ textAlign: "center", marginTop: 4 }}>
                {location.name}
              </AppText>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 0,
    overflow: "hidden",
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginRight: 12,
  },
});
