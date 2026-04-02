import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { api } from "@/hooks/api";
import SectionHeader from "./_components/section-header";

const locationDefs = [
  {
    title: "Addis Ababa",
    image: "https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=400&h=600&fit=crop",
  },
  {
    title: "Bahir Dar",
    image: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=400&h=600&fit=crop",
  },
  {
    title: "Hawassa",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=600&fit=crop",
  },
  {
    title: "Gondar",
    image: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=400&h=600&fit=crop",
  },
  {
    title: "Adama",
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=600&fit=crop",
  },
  {
    title: "Mekelle",
    image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=600&fit=crop",
  },
  {
    title: "Dire Dawa",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=600&fit=crop",
  },
];

const FALLBACK = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=600&fit=crop";

const LocationsSection = () => {
  const navigate = useNavigate();
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const posRef = useRef(0);
  const pausedRef = useRef(false);
  const [countMap, setCountMap] = useState<Record<string, number>>({});

  // Fetch real counts
  useEffect(() => {
    api.get("/properties/location-stats")
      .then((res) => {
        const map: Record<string, number> = {};
        (res.data?.data || []).forEach((s: { city: string; count: number }) => {
          map[s.city] = s.count;
        });
        setCountMap(map);
      })
      .catch(() => {});
  }, []);

  // Auto-scroll
  useEffect(() => {
    const speed = 0.5;
    const track = trackRef.current;
    if (!track) return;

    const animate = () => {
      if (!pausedRef.current) {
        posRef.current += speed;
        const half = track.scrollWidth / 2;
        if (posRef.current >= half) posRef.current = 0;
        track.style.transform = `translateX(-${posRef.current}px)`;
      }
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const doubled = [...locationDefs, ...locationDefs];

  return (
    <section className="c-px pt-20 md:pt-24 pb-10 overflow-hidden">
      <SectionHeader title="Popular Locations" />
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; }}
      >
        <div ref={trackRef} className="flex gap-4 w-max will-change-transform">
          {doubled.map((loc, i) => {
            const count = countMap[loc.title];
            return (
              <div
                key={`${loc.title}-${i}`}
                onClick={() => navigate(`/properties/?location=${loc.title}`)}
                className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer shrink-0 w-[220px] h-[280px]"
              >
                <img
                  src={loc.image}
                  alt={loc.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-base">{loc.title}</h3>
                  <p className="text-white/70 text-xs mt-0.5">
                    {count !== undefined ? `${count} propert${count === 1 ? "y" : "ies"}` : "Explore"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;
