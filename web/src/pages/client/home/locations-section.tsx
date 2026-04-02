import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import SectionHeader from "./_components/section-header";

const locations = [
  {
    id: "1",
    title: "Addis Ababa",
    description: "The vibrant capital city of Ethiopia",
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/2b/7d/7c/caption.jpg?w=1200&h=-1&s=1",
    propertiesCount: 124,
  },
  {
    id: "2",
    title: "Bahir Dar",
    description: "Lakeside city with beautiful views",
    image: "https://tuckmagazine.com/wp-content/uploads/2018/12/addis.jpg",
    propertiesCount: 62,
  },
  {
    id: "3",
    title: "Hawassa",
    description: "Serene lakeshore destination",
    image: "https://imgix.brilliant-ethiopia.com/lake-awasa-2.jpg?auto=format,enhance,compress&fit=crop&w=800&h=600&q=60",
    propertiesCount: 48,
  },
  {
    id: "4",
    title: "Gondar",
    description: "The Camelot of Africa",
    image: "https://imgix.brilliant-ethiopia.com/fasil-ghebbi-royal-enclosure-gondar.jpg?auto=format,enhance,compress&fit=crop&crop=entropy,faces,focalpoint&w=1880&h=740&q=30",
    propertiesCount: 37,
  },
  {
    id: "5",
    title: "Lalibela",
    description: "Home of the rock-hewn churches",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Lalibela_church.jpg/1200px-Lalibela_church.jpg",
    propertiesCount: 29,
  },
  {
    id: "6",
    title: "Dire Dawa",
    description: "Vibrant markets and local cuisine",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Dire_Dawa_city.jpg/1200px-Dire_Dawa_city.jpg",
    propertiesCount: 41,
  },
];

// Duplicate for seamless loop
const doubled = [...locations, ...locations];

const LocationsSection = () => {
  const navigate = useNavigate();
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const posRef = useRef(0);
  const pausedRef = useRef(false);

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

  return (
    <section className="c-px pt-20 md:pt-24 pb-10 overflow-hidden">
      <SectionHeader title="Popular Locations" />
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => { pausedRef.current = true; }}
        onMouseLeave={() => { pausedRef.current = false; }}
      >
        <div ref={trackRef} className="flex gap-4 w-max will-change-transform">
          {doubled.map((loc, i) => (
            <div
              key={`${loc.id}-${i}`}
              onClick={() => navigate(`/properties/?location=${loc.title}`)}
              className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer shrink-0 w-[220px] h-[280px]"
            >
              <img
                src={loc.image}
                alt={loc.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-base">{loc.title}</h3>
                <p className="text-white/70 text-xs mt-0.5">{loc.propertiesCount}+ properties</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;
