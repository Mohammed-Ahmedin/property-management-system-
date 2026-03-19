import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { ChevronDown } from "lucide-react-native";
import {
  CITIES,
  GUEST_HOUSE_TYPES,
  MIN_PRICE,
  MAX_PRICE,
  PRICE_STEP,
} from "@/src/constants/filter-data";
import BottomDrawer from "../../ui/bottom-drawer";
import { usePathname, useRouter } from "expo-router";

export interface FilterValues {
  minPrice: number;
  maxPrice: number;
  city: string;
  subcity: string;
  type: "private" | "shared" | "";
}

interface FilterDrawerProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
  initialValues?: Partial<FilterValues>;
}

export default function FilterDrawer({
  visible,
  onClose,
  onApply,
  initialValues,
}: FilterDrawerProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [minPrice, setMinPrice] = useState<number>(
    initialValues?.minPrice ?? MIN_PRICE
  );
  const [maxPrice, setMaxPrice] = useState<number>(
    initialValues?.maxPrice ?? MAX_PRICE
  );
  const [selectedCity, setSelectedCity] = useState<string>(
    initialValues?.city ?? ""
  );
  const [selectedSubcity, setSelectedSubcity] = useState<string>(
    initialValues?.subcity ?? ""
  );
  const [selectedType, setSelectedType] = useState<"private" | "shared" | "">(
    initialValues?.type ?? ""
  );

  const [showCityDropdown, setShowCityDropdown] = useState<boolean>(false);
  const [showSubcityDropdown, setShowSubcityDropdown] =
    useState<boolean>(false);

  const selectedCityData = CITIES.find((c) => c.id === selectedCity);
  const subcities = selectedCityData?.subcities ?? [];

  const handleClear = () => {
    setMinPrice(MIN_PRICE);
    setMaxPrice(MAX_PRICE);
    setSelectedCity("");
    setSelectedSubcity("");
    setSelectedType("");

    if (pathname.split("/")[1] === "explore") {
      router.push("/(tabs)/explore");
    }
  };
  
  const handleSearch = () => {
    onApply({
      minPrice,
      maxPrice,
      city: selectedCity,
      subcity: selectedSubcity,
      type: selectedType,
    });
    onClose();
  };

  const priceMarks = [0, 2500, 5000, 7500, 10000];

  return (
    <BottomDrawer visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>Filters</Text>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Range (ETB)</Text>
            <View style={styles.priceDisplay}>
              <View style={styles.priceBox}>
                <Text style={styles.priceLabel}>Min</Text>
                <Text style={styles.priceValue}>{minPrice}</Text>
              </View>
              <View style={styles.priceDivider} />
              <View style={styles.priceBox}>
                <Text style={styles.priceLabel}>Max</Text>
                <Text style={styles.priceValue}>{maxPrice}</Text>
              </View>
            </View>

            <View style={styles.sliderContainer}>
              <View style={styles.sliderTrack}>
                <View
                  style={[
                    styles.sliderRange,
                    {
                      left: `${(minPrice / MAX_PRICE) * 100}%`,
                      right: `${100 - (maxPrice / MAX_PRICE) * 100}%`,
                    },
                  ]}
                />
              </View>
              <View style={styles.priceMarks}>
                {priceMarks.map((mark) => (
                  <TouchableOpacity
                    key={mark}
                    style={styles.priceMark}
                    onPress={() => {
                      if (
                        Math.abs(mark - minPrice) < Math.abs(mark - maxPrice)
                      ) {
                        setMinPrice(mark);
                      } else {
                        setMaxPrice(mark);
                      }
                    }}
                  >
                    <View
                      style={[
                        styles.priceMarkDot,
                        mark >= minPrice &&
                          mark <= maxPrice &&
                          styles.priceMarkDotActive,
                      ]}
                    />
                    <Text style={styles.priceMarkLabel}>
                      {mark >= 1000 ? `${mark / 1000}k` : mark}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.priceButtons}>
              <TouchableOpacity
                style={styles.priceButton}
                onPress={() =>
                  setMinPrice(Math.max(MIN_PRICE, minPrice - PRICE_STEP))
                }
              >
                <Text style={styles.priceButtonText}>- Min</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.priceButton}
                onPress={() =>
                  setMinPrice(
                    Math.min(maxPrice - PRICE_STEP, minPrice + PRICE_STEP)
                  )
                }
              >
                <Text style={styles.priceButtonText}>+ Min</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.priceButton}
                onPress={() =>
                  setMaxPrice(
                    Math.max(minPrice + PRICE_STEP, maxPrice - PRICE_STEP)
                  )
                }
              >
                <Text style={styles.priceButtonText}>- Max</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.priceButton}
                onPress={() =>
                  setMaxPrice(Math.min(MAX_PRICE, maxPrice + PRICE_STEP))
                }
              >
                <Text style={styles.priceButtonText}>+ Max</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>City</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowCityDropdown(!showCityDropdown)}
            >
              <Text
                style={[
                  styles.dropdownText,
                  !selectedCity && styles.dropdownPlaceholder,
                ]}
              >
                {selectedCityData?.name ?? "Select City"}
              </Text>
              <ChevronDown size={20} color="#6B7280" />
            </TouchableOpacity>
            {showCityDropdown && (
              <View style={styles.dropdownMenu}>
                {CITIES.map((city) => (
                  <TouchableOpacity
                    key={city.id}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedCity(city.id);
                      setSelectedSubcity("");
                      setShowCityDropdown(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        selectedCity === city.id &&
                          styles.dropdownItemTextActive,
                      ]}
                    >
                      {city.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {selectedCity && subcities.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Subcity</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowSubcityDropdown(!showSubcityDropdown)}
              >
                <Text
                  style={[
                    styles.dropdownText,
                    !selectedSubcity && styles.dropdownPlaceholder,
                  ]}
                >
                  {selectedSubcity || "Select Subcity"}
                </Text>
                <ChevronDown size={20} color="#6B7280" />
              </TouchableOpacity>
              {showSubcityDropdown && (
                <View style={styles.dropdownMenu}>
                  {subcities.map((subcity) => (
                    <TouchableOpacity
                      key={subcity}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedSubcity(subcity);
                        setShowSubcityDropdown(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          selectedSubcity === subcity &&
                            styles.dropdownItemTextActive,
                        ]}
                      >
                        {subcity}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Property Type</Text>
            <View style={styles.typeContainer}>
              {GUEST_HOUSE_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.typeButton,
                    selectedType === type.id && styles.typeButtonActive,
                  ]}
                  onPress={() =>
                    setSelectedType(selectedType === type.id ? "" : type.id)
                  }
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      selectedType === type.id && styles.typeButtonTextActive,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomDrawer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: "#111827",
    textAlign: "center",
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#374151",
    marginBottom: 12,
  },
  priceDisplay: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  priceBox: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  priceDivider: {
    width: 16,
    height: 2,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 8,
  },
  priceLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
    fontFamily: "Inter_500Medium",
  },
  priceValue: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: "#3B82F6",
  },
  sliderContainer: {
    marginBottom: 16,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    position: "relative",
  },
  sliderRange: {
    position: "absolute",
    height: 6,
    backgroundColor: "#3B82F6",
    borderRadius: 3,
  },
  priceMarks: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  priceMark: {
    alignItems: "center",
  },
  priceMarkDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
    marginBottom: 4,
  },
  priceMarkDotActive: {
    backgroundColor: "#3B82F6",
  },
  priceMarkLabel: {
    fontSize: 11,
    color: "#6B7280",
    fontFamily: "Inter_500Medium",
  },
  priceButtons: {
    flexDirection: "row",
    gap: 8,
  },
  priceButton: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  priceButtonText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: "#374151",
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownText: {
    fontSize: 15,
    color: "#111827",
    fontFamily: "Inter_500Medium",
  },
  dropdownPlaceholder: {
    color: "#9CA3AF",
  },
  dropdownMenu: {
    marginTop: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
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
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  dropdownItemText: {
    fontSize: 15,
    color: "#374151",
    fontFamily: "Inter_400Regular",
  },
  dropdownItemTextActive: {
    color: "#3B82F6",
    fontFamily: "Inter_600SemiBold",
  },
  typeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  typeButtonActive: {
    backgroundColor: "#ECFEFF",
    borderColor: "#3B82F6",
  },
  typeButtonText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#6B7280",
  },
  typeButtonTextActive: {
    color: "#3B82F6",
  },
  bottomSpacer: {
    height: 20,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    backgroundColor: "#fff",
  },
  clearButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  clearButtonText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#374151",
  },
  searchButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#3B82F6",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: "0 4px 8px rgba(8, 145, 178, 0.3)",
      },
    }),
  },
  searchButtonText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
});
