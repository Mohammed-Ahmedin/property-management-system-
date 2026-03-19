import { useNavigate } from "react-router-dom";
import SectionHeader from "./_components/section-header";

const locations = [
  {
    id: "1",
    title: "Addis Ababa",
    description:
      "The vibrant capital city of Ethiopia, known for its cultural landmarks, nightlife, and top-rated properties near Bole area.",
    image:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/2b/7d/7c/caption.jpg?w=1200&h=-1&s=1",
    propertiesCount: 124,
  },
  {
    id: "2",
    title: "Bahir Dar",
    description:
      "A lakeside city offering beautiful views of Lake Tana and the Blue Nile Falls, perfect for peaceful stays and nature lovers.",
    image: "https://tuckmagazine.com/wp-content/uploads/2018/12/addis.jpg",
    propertiesCount: 62,
  },
  {
    id: "3",
    title: "Hawassa",
    description:
      "A serene lakeshore destination with great properties and beautiful sunset views along Lake Hawassa.",
    image:
      "https://imgix.brilliant-ethiopia.com/lake-awasa-2.jpg?auto=format,enhance,compress&fit=crop&w=800&h=600&q=60",
    propertiesCount: 48,
  },
  {
    id: "4",
    title: "Gondar",
    description:
      "Known as the Camelot of Africa, Gondar is rich with royal castles, ancient churches, and comfortable property options.",
    image:
      "https://imgix.brilliant-ethiopia.com/fasil-ghebbi-royal-enclosure-gondar.jpg?auto=format,enhance,compress&fit=crop&crop=entropy,faces,focalpoint&w=1880&h=740&q=30",
    propertiesCount: 37,
  },
  // {
  //   id: "5",
  //   title: "Lalibela",
  //   description:
  //     "Home of the rock-hewn churches, Lalibela offers a spiritual and historic experience with cozy local properties.",
  //   image:
  //     "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/2b/7d/7c/caption.jpg?w=1200&h=-1&s=1",
  //   propertiesCount: 29,
  // },
  // {
  //   id: "6",
  //   title: "Dire Dawa",
  //   description:
  //     "A beautiful blend of traditional and modern life, Dire Dawa offers vibrant markets, local cuisine, and welcoming stays.",
  //   image:
  //     "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/2b/7d/7c/caption.jpg?w=1200&h=-1&s=1",
  //   propertiesCount: 41,
  // },
  // {
  //   id: "7",
  //   title: "Arba Minch",
  //   description:
  //     "A gateway to Nechisar National Park and the twin lakes, Arba Minch is perfect for nature and adventure enthusiasts.",
  //   image:
  //     "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/2b/7d/7c/caption.jpg?w=1200&h=-1&s=1",
  //   propertiesCount: 33,
  // },
  // {
  //   id: "8",
  //   title: "Jimma",
  //   description:
  //     "Surrounded by lush greenery and coffee farms, Jimma offers a peaceful retreat with local hospitality and culture.",
  //   image:
  //     "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/2b/7d/7c/caption.jpg?w=1200&h=-1&s=1",
  //   propertiesCount: 26,
  // },
];

const LocationsSection = () => {
  const navigate = useNavigate();
  return (
    <section className="c-px pt-20 md:pt-24 pb-10">
      <SectionHeader title="Popular Locations" />

      <div
        className="
        grid gap-4 sm:gap-6
        sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
        "
      >
        {locations.map((loc) => (
          <div
            key={loc.id}
            onClick={() => {
              navigate(`/properties/?location=${loc.title}`);
            }}
            className="
              group relative overflow-hidden rounded-3xl shadow-md
              hover:shadow-xl transition-all duration-300 ease-in-out
              hover:-translate-y-1 cursor-pointer 
              
            "
          >
            {/* Background image */}
            <div className="relative h-48 sm:h-56 md:h-64 lg:h-[400px]">
              <img
                src={loc.image}
                alt={loc.title}
                className="object-cover absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
              {/* Overlay for readability */}
            </div>

            {/* Content */}

            <div
              className="bg-white/50  text-foreground backdrop-blur-2xl rounded-full
                absolute bottom-2 px-4 py-2  ml-2
              "
            >
              <h3 className="text-sm md:text-md font-bold">{loc.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LocationsSection;
