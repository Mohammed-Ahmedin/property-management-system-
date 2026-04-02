import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/hooks/api";
import SectionHeader from "./_components/section-header";

const locationDefs = [
  { title: "Addis Ababa", image: "https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=400&h=600&fit=crop" },
  { title: "Bahir Dar",   image: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?w=400&h=600&fit=crop" },
  { title: "Hawassa",     image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=600&fit=crop" },
  { title: "Gondar",      image: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=400&h=600&fit=crop" },
  { title: "Adama",       image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=600&fit=crop" },
  { title: "Mekelle",     image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=600&fit=crop" },
  { title: "Dire Dawa",   image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=600&fit=crop" },
];

const CARD_W = 220;
const GAP = 16;
const ITEM_W = CARD_W + GAP; // 236px per item

const FALLBACK = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=600&fit=crop";

const LocationsSection = () => {
  const navigate = useNavigate();
  const [countMap, setCountMap] = useState<Record<string, number>>({});

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

  // The track contains [original × 2]. We scroll exactly `n * ITEM_W` px
  // which is the width of the first copy, then CSS resets to 0 seamlessly.
  const totalShift = locationDefs.length * ITEM_W;
  const duration = locationDefs.length * 4; // seconds

  return (
    <section className="c-px pt-20 md:pt-24 pb-10 overflow-hidden">
      <SectionHeader title="Popular Locations" />

      <style>{`
        @keyframes marquee-loc {
          0%   { transform: translateX(0px); }
          100% { transform: translateX(-${totalShift}px); }
        }
        .marquee-loc { animation: marquee-loc ${duration}s linear infinite; }
        .marquee-wrap:hover .marquee-loc { animation-play-state: paused; }
      `}</style>

      <div
        className="marquee-wrap relative overflow-hidden"
        style={{ maskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)" }}
      >
        {/* Track: original + duplicate side by side */}
        <div className="marquee-loc flex" style={{ gap: `${GAP}px`, width: "max-content" }}>
          {[...locationDefs, ...locationDefs].map((loc, i) => {
            const count = countMap[loc.title];
            return (
              <div
                key={`${loc.title}-${i}`}
                onClick={() => navigate(`/properties/?location=${loc.title}`)}
                className="relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer shrink-0"
                style={{ width: `${CARD_W}px`, height: "280px" }}
              >
                <img
                  src={loc.image}
                  alt={loc.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-110"
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
