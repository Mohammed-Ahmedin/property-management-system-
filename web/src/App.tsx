import { useEffect, useRef } from "react";
import Routes from "./routes";
import { useClientAuth } from "./hooks/use-client-auth";
import { toast } from "sonner";
import { useDeviceNetworkHandler } from "./hooks/use-network";
import ScrollToTop from "./scroll-top";

function App() {
  const { fetchUser } = useClientAuth();

  useDeviceNetworkHandler();
  ScrollToTop();
  
  // Fetch user when the App mounts
  useEffect(() => {
    void fetchUser(); // fetchUser handles session via Better Auth
  }, [fetchUser]);

  return (
    <>
      <Routes />
    </>
  );
}

export default App;
