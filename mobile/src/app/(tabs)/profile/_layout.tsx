// app/(protected)/_layout.js
import { Slot } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};
export default function Layout() {
  return <Slot />;
}
