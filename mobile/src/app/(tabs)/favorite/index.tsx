import React, { useCallback } from "react";
import { View, StyleSheet, FlatList, Platform } from "react-native";
import { useFavoritesStore } from "@/src/store/favorite.store";
import { Property } from "@/src/types/property.type";
import { PropertyCard } from "./property-card";
import { AppText } from "@/src/components/ui/text";
import { NoFavoritesScreen } from "./no-favorites-screen";

const PRIMARY_COLOR = "#3B82F6";

export default function FavoritesScreen() {
  const { favorites, toggleFavorite, isFavorite } = useFavoritesStore();

  const handleToggleFavorite = useCallback(
    (property: Property) => {
      toggleFavorite(property);
    },
    [toggleFavorite]
  );
  const renderItem = useCallback(
    ({ item }: { item: Property }) => (
      <PropertyCard
        property={item}
        isFavorite={isFavorite(item.id)}
        onToggleFavorite={handleToggleFavorite}
      />
    ),
    [isFavorite, handleToggleFavorite]
  );

  const keyExtractor = useCallback((item: Property) => item.id, []);

  const renderHeader = useCallback(
    () => (
      <View style={styles.header}>
        <View
          style={{ width: "100%", paddingHorizontal: 16, paddingVertical: 20 }}
        >
          <View style={{ flexDirection: "column" }}>
            <AppText weight="bold" style={{ fontSize: 22 }}>
              My Favorites
            </AppText>
            <AppText style={styles.headerSubtitle}>
              {favorites.length}{" "}
              {favorites.length === 1 ? "property" : "properties"} saved
            </AppText>
          </View>
        </View>
      </View>
    ),
    [favorites.length]
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={favorites.length > 0 ? renderHeader : null}
        ListEmptyComponent={<NoFavoritesScreen />}
        contentContainerStyle={[
          styles.listContent,
          favorites.length === 0 && styles.listContentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        testID="favorites-list"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB/",
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  listContentEmpty: {
    flexGrow: 1,
    justifyContent: "center",
  },
  header: {},
  headerTitle: {
    fontSize: 28,
    color: "#111827",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#6B7280",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    backgroundColor: "#F9FAFB",
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  exploreButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    fontFamily: "Inter_regular",
    ...Platform.select({
      ios: {
        shadowColor: PRIMARY_COLOR,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: `0 4px 12px ${PRIMARY_COLOR}40`,
      },
    }),
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
