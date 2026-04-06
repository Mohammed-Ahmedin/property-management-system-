"use client"

import { Users, Home, Star, MapPin, Shield, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import { api } from "@/hooks/api"

export function PropertyStats() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalBookings: 0,
    totalReviews: 0,
    cities: 0,
  });

  useEffect(() => {
    api.get("/public/stats").then(res => {
      const d = res.data;
      setStats({
        totalProperties: d.totalProperties || 0,
        totalBookings: d.totalBookings || 0,
        totalReviews: d.totalReviews || 0,
        cities: 7,
      });
    }).catch(() => {
      // fallback: at least get property count
      api.get("/properties?limit=1").then(r => {
        setStats(s => ({ ...s, totalProperties: r.data?.pagination?.totalItems || 0 }));
      }).catch(() => {});
    });
  }, []);

  const cards = [
    { icon: <Home className="w-6 h-6" />, label: "Properties", value: stats.totalProperties, suffix: "+", desc: "Handpicked properties", color: "from-purple-500 to-pink-500" },
    { icon: <Users className="w-6 h-6" />, label: "Bookings Made", value: stats.totalBookings, suffix: "+", desc: "Trusted travelers", color: "from-blue-500 to-cyan-500" },
    { icon: <Star className="w-6 h-6" />, label: "Reviews", value: stats.totalReviews, suffix: "+", desc: "Guest experiences", color: "from-amber-500 to-orange-500" },
    { icon: <MapPin className="w-6 h-6" />, label: "Cities", value: stats.cities, suffix: "+", desc: "Across Ethiopia", color: "from-emerald-500 to-teal-500" },
    { icon: <Shield className="w-6 h-6" />, label: "Secure Bookings", value: 100, suffix: "%", desc: "Safe & verified", color: "from-red-500 to-rose-500" },
    { icon: <Zap className="w-6 h-6" />, label: "Instant Booking", value: 24, suffix: "/7", desc: "Book anytime", color: "from-indigo-500 to-blue-500" },
  ];

  return (
    <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Join Thousands of Happy Travelers</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Discover, book, and experience authentic properties across Ethiopia.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {cards.map((s, i) => (
            <div key={i} className="relative overflow-hidden rounded-xl bg-card border border-border p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
              <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold text-foreground">{s.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                </div>
                <div className={`p-2.5 rounded-lg bg-gradient-to-br ${s.color} text-white shadow-md shrink-0`}>
                  {s.icon}
                </div>
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-3xl font-bold">{s.value.toLocaleString()}</span>
                {s.suffix && <span className="text-base text-muted-foreground font-semibold">{s.suffix}</span>}
              </div>
              <div className="h-1 bg-border rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${s.color} rounded-full w-full`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
