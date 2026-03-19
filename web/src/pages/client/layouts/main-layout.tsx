import { Footer } from "@/components/footer";
import { Header } from "@/components/shared/header";
import MobileTab from "@/components/shared/mobile-tab";
import ClientFooterProvider from "@/providers/footer-provider";
import { Outlet } from "react-router-dom";

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
    </div>
  );
};

export default MainLayout;
