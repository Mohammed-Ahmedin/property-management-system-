import React, { useState } from "react";
import { View, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import { useRouter } from "expo-router";
import PaymentSuccess from "./payment-success";

export default function PaymentScreen({
  checkoutUrl,
  setCheckOutUrl,
  onClose,
}: {
  checkoutUrl: string;
  setCheckOutUrl: (url: string | null) => void;
  onClose: () => void;
}) {
  const [paymentDone, setPaymentDone] = useState(false);
  const router = useRouter();

  if (!checkoutUrl) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleNavChange = (navState: any) => {
    const { url } = navState;

    // Detect redirect to Chapa receipt
    if (url.includes("chapa.co/checkout/test-payment-receipt")) {
      setPaymentDone(true);
    }
  };

  if (paymentDone) {
    return <PaymentSuccess onClose={onClose} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: checkoutUrl }}
        onNavigationStateChange={handleNavChange}
        startInLoadingState
        renderLoading={() => (
          <ActivityIndicator
            size="large"
            style={{ marginTop: 20 }}
            color="#16a34a"
          />
        )}
      />
    </View>
  );
}
