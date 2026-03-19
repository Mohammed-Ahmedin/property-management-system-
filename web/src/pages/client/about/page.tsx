import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Heart, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="px-4 py-12 sm:py-16 md:py-20 lg:py-18">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-balance ">
              Discover Authentic Ethiopian Hospitality
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto text-balance">
              Your gateway to unique properties and local experiences across
              Ethiopia
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-4 py-8 bg-card border-y border-border">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 ">
                Our Mission
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-foreground leading-relaxed mb-4">
                We believe travel should be personal, authentic, and
                transformative. Our platform connects travelers with carefully
                selected properties across Ethiopia, each offering unique
                local experiences and genuine hospitality.
              </p>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                By choosing a property, you're supporting local families and
                small businesses while creating meaningful connections with
                Ethiopian culture and people.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center">
                <MapPin className="w-8 h-8 mx-auto mb-3 text-accent" />
                <h3 className="font-semibold text-sm sm:text-base mb-2">
                  Nationwide Coverage
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Properties across all regions
                </p>
              </Card>
              <Card className="p-6 text-center">
                <Heart className="w-8 h-8 mx-auto mb-3 text-accent" />
                <h3 className="font-semibold text-sm sm:text-base mb-2">
                  Curated Stays
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Hand-picked experiences
                </p>
              </Card>
              <Card className="p-6 text-center">
                <Users className="w-8 h-8 mx-auto mb-3 text-accent" />
                <h3 className="font-semibold text-sm sm:text-base mb-2">
                  Local Community
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Supporting local families
                </p>
              </Card>
              <Card className="p-6 text-center">
                <Award className="w-8 h-8 mx-auto mb-3 text-accent" />
                <h3 className="font-semibold text-sm sm:text-base mb-2">
                  Quality Assured
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Verified reviews
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center ">
            What We Value
          </h2>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Authenticity",
                description:
                  "We celebrate genuine Ethiopian experiences, traditions, and the warmth of our people.",
              },
              {
                title: "Community",
                description:
                  "We support local communities by connecting travelers directly with family-run establishments.",
              },
              {
                title: "Sustainability",
                description:
                  "We promote responsible travel that respects local cultures and protects our environment.",
              },
            ].map((value, index) => (
              <Card
                key={index}
                className="p-6 md:p-8 border-2 hover:border-accent transition-colors"
              >
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 text-primary">
                  {value.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="px-4 py-12 md:py-16 bg-card border-y border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center ">
            Why Choose Us
          </h2>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {[
              {
                title: "Easy to Use Platform",
                description:
                  "Browse, compare, and book properties in just a few clicks.",
              },
              {
                title: "Transparent Pricing",
                description:
                  "No hidden fees. See exactly what you're paying upfront.",
              },
              {
                title: "24/7 Support",
                description:
                  "Our team is here to help before, during, and after your stay.",
              },
              {
                title: "Verified Reviews",
                description:
                  "Real experiences from real travelers help you make informed choices.",
              },
              {
                title: "Secure Booking",
                description:
                  "Your personal and payment information is protected with encryption.",
              },
              {
                title: "Local Expertise",
                description:
                  "Our team knows Ethiopia inside out and can recommend perfect stays.",
              },
            ].map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-1 bg-accent rounded-full"></div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold mb-1 text-primary">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-12 md:py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 ">
            Ready to Explore?
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed">
            Start your journey and discover the perfect property for your
            Ethiopian adventure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={"/properties"}>
              <Button size="lg" className="text-base px-8">
                Browse Properties
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="text-base px-8 bg-transparent"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section className="px-4 py-8 md:py-12 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs sm:text-sm text-muted-foreground mb-2">
            © 2025 Ethiopian Properties. All rights reserved.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Connecting travelers with authentic Ethiopian hospitality
          </p>
        </div>
      </section>
    </main>
  );
}
