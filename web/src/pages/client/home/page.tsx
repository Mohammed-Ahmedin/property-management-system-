import { ChatBotContainer } from "@/components/shared/chatbot";
import HeroSection from "./hero-section";
import LocationsSection from "./locations-section";
import PropertiesSection from "./properties-section";
import { PropertyStats } from "./stats-section";

function HomePage() {
  return (
    <>
      <HeroSection />
      <LocationsSection />

      <PropertiesSection />

      <PropertyStats />

      {/* fixed */}
      <ChatBotContainer />
    </>
  );
}

export default HomePage;
