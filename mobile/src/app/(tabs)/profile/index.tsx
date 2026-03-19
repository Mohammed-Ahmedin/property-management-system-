import { useRouter } from "expo-router";
import {
  ChevronRight,
  KeyRound,
  LogOut,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react-native";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { authClient } from "@/src/lib/auth-client";
import { LoginPrompt } from "@/src/components/ui/login-prompt";
import { AppText } from "@/src/components/ui/text";
import { FullPageLoader } from "@/src/components/shared/loaders";

export default function ProfileScreen() {
  const { data: sessionData, isPending } = authClient?.useSession();
  const userData: any = sessionData?.user;
  const router = useRouter();

  if (isPending) {
    return <FullPageLoader />;
  }

  if (!userData) {
    return <LoginPrompt />;
  }

  const handleLogout = () => {
    authClient.signOut();
  };

  return (
    <View style={styles.container}>
      {/* header */}
      <View
        style={{ width: "100%", paddingHorizontal: 16, paddingVertical: 20 }}
      >
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <AppText weight="bold" style={{ fontSize: 22 }}>
            Profile
          </AppText>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <Image
            source={{
              uri:
                userData?.image ||
                "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-grey-photo-placeholder-illustrations-vectors-default-avatar-profile-icon-grey-photo-placeholder-99724602.jpg",
            }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{userData?.name}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push("/profile/edit")}
            activeOpacity={0.7}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <User size={20} color="#3B82F6" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Name</Text>
                <Text style={styles.infoValue}>{userData?.name}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Mail size={20} color="#3B82F6" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{userData?.email}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <Phone size={20} color="#3B82F6" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{userData?.phone || ""}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIconContainer}>
                <MapPin size={20} color="#3B82F6" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{"-"}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={() => router.push("/profile/change-password")}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIconContainer}>
                  <KeyRound size={20} color="#3B82F6" />
                </View>
                <Text style={styles.settingText}>Change Password</Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.settingRow}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <View style={styles.settingLeft}>
                <View
                  style={[
                    styles.settingIconContainer,
                    styles.logoutIconContainer,
                  ]}
                >
                  <LogOut size={20} color="#EF4444" />
                </View>
                <Text style={[styles.settingText, styles.logoutText]}>
                  Logout
                </Text>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    flex: 1,

    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: "#111827",
    fontFamily: "Inter_700Bold",
  },
  profileSection: {
    alignItems: "center",
    paddingBottom: 24,
    paddingTop: 0,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  name: {
    fontSize: 24,
    color: "#111827",
    marginBottom: 10,
    fontFamily: "Inter_700Bold",
  },
  editButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#111827",
    marginBottom: 12,
    fontFamily: "Inter_600SemiBold",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
    fontFamily: "Inter_400Regular",
  },
  infoValue: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500" as const,
    fontFamily: "Inter_500Medium",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 4,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  logoutIconContainer: {
    backgroundColor: "#FEF2F2",
  },
  settingText: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500" as const,
    fontFamily: "Inter_500Medium",
  },
  logoutText: {
    color: "#EF4444",
  },
  bottomSpacing: {
    height: 32,
  },
});
