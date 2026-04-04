import { Navigate } from "react-router-dom";

// Account settings are on the main account page
export default function AccountSettingPage() {
  return <Navigate to="/account" replace />;
}
