// src/components/CategoriesContainer.tsx
import React, { useState } from "react";
import { ScrollView, View, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@/src/providers/theme.provider";
import { AppText } from "@/src/components/ui/text";
import { useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";

interface Category {
  id: string;
  name: string;
}

const dummyCategories: Category[] = [
  { id: "1", name: "Luxury" },
  { id: "2", name: "Budget" },
  { id: "3", name: "Business" },
  { id: "4", name: "Family" },
  { id: "5", name: "Resort" },
  { id: "6", name: "Boutique" },
];

interface CategoriesContainerProps {
  categories?: Category[];
  onSelect?: (category: Category) => void;
  selectedId?: string;
  hardRefersh?: boolean;
}

export const CategoriesContainer: React.FC<CategoriesContainerProps> = ({
  categories = dummyCategories,
  hardRefersh = true,
}) => {
  const searchParams = useSearchParams();
  const categorySearchParam = searchParams.get("category");
  const { theme } = useTheme();
  const router = useRouter();

  const handleSelectCategory = (selectedId: any) => {
    hardRefersh
      ? router.push(`/explore?category=${selectedId}` as any)
      : router.setParams({ category: selectedId });
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
        }}
      >
        {categories.map((category) => {
          const isSelected = category.id === categorySearchParam;
          return (
            <TouchableOpacity
              key={category.id}
              onPress={() => handleSelectCategory(category.id)}
              style={[
                styles.categoryButton,
                {
                  backgroundColor: isSelected
                    ? theme.colors.primary
                    : theme.colors.surface,
                },
              ]}
            >
              <AppText
                weight={isSelected ? "bold" : "medium"}
                color={isSelected ? theme.colors.onPrimary : theme.colors.text}
              >
                {category.name}
              </AppText>
            </TouchableOpacity>
          );
        })}
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
