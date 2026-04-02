import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { api } from "@/hooks/api";
import SectionHeader from "./_components/section-header";

const locationDefs = [
  {
    title: "Addis Ababa",
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/2b/7d/7c/caption.jpg?w=1200&h=-1&s=1",
  },
  {
    title: "Bahir Dar",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Blue_Nile_Falls%2C_Ethiopia.jpg/1200px-Blue_Nile_Falls%2C_Ethiopia.jpg",
  },
  {
    title: "Hawassa",
    image: "https://imgix.brilliant-ethiopia.com/lake-awasa-2.jpg?auto=format,enhance,compress&fit=crop&w=800&h=600&q=60",
  },
  {
    title: "Gondar",
    image: "https://imgix.brilliant-ethiopia.com/fasil-ghebbi-royal-enclosure-gondar.jpg?auto=format,enhance,compress&fit=crop&crop=entropy,faces,focalpoint&w=1880&h=740&q=30",
  },
  {
    title: "Adama",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Adama_Nazret_Ethiopia.jpg/1200px-Adama_Nazret_Ethiopia.jpg",
  },
  {
    title: "Mekelle",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Mekelle_University_Main_Campus.jpg/1200px-Mekelle_University_Main_Campus.jpg",
  },
  {
    title: "Dire Dawa",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Dire_Dawa_Railway_Station.jpg/1200px-Dire_Dawa_Railway_Station.jpg",
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
