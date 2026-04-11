import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import MobileTab from "@/components/shared/mobile-tab";
import ClientFooterProvider from "@/providers/footer-provider";
import { Outlet } from "react-router-dom";
import { ChatWidget } from "@/components/shared/chat-widget";

const MainLayout = () => {
  return (
    <div>
      <Header />

      <main className="min-h-screen pb-10">
        <Outlet />
        <MobileTab className="md:hidden" />
      </main>

      <ClientFooterProvider
        blackListPathNames={[
          "/checkout",
          "/account",
          "/bookings",
          "/account/setting",
          "/account/bookings",
        ]}
      >
        <Footer />
      </ClientFooterProvider>

      {/* Chat widget — only visible to logged-in users */}
      <ChatWidget />
    </div>
  );
};

export default MainLayout;
