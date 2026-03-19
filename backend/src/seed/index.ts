import { PrismaClient } from "@prisma/client";

const categoriesData = [
  { name: "Beachfront", description: "Properties near beaches.", icon: "🏖️" },
  {
    name: "Mountain Retreats",
    description: "Properties in mountainous areas.",
    icon: "🏔️",
  },
  {
    name: "City Center",
    description: "Properties in downtown areas.",
    icon: "🏙️",
  },
  {
    name: "Countryside",
    description: "Properties in rural and peaceful areas.",
    icon: "🌳",
  },
  {
    name: "Lakeside",
    description: "Properties near lakes and rivers.",
    icon: "🏞️",
  },
  {
    name: "Eco-lodges",
    description: "Environmentally friendly properties.",
    icon: "🌱",
  },
  {
    name: "Boutique",
    description: "Stylish and unique properties.",
    icon: "🏠",
  },
  {
    name: "Family-friendly",
    description: "Properties suitable for families.",
    icon: "👨‍👩‍👧‍👦",
  },
  {
    name: "Pet-friendly",
    description: "Properties that allow pets.",
    icon: "🐾",
  },
  {
    name: "Romantic Getaways",
    description: "Properties perfect for couples.",
    icon: "❤️",
  },
  {
    name: "Adventure Stays",
    description: "Properties near adventure activities.",
    icon: "🧗",
  },
  {
    name: "Historic Homes",
    description: "Properties in historic buildings.",
    icon: "🏛️",
  },
  {
    name: "Wellness Retreats",
    description: "Properties focused on health and relaxation.",
    icon: "🧘",
  },
  { name: "Budget Stays", description: "Affordable properties.", icon: "💵" },
  {
    name: "Luxury Stays",
    description: "High-end properties with premium amenities.",
    icon: "💎",
  },
];

const prisma = new PrismaClient();

async function main() {
  for (const category of categoriesData) {
    await prisma.category.create({
      data: category,
    });
  }

  console.log("✅ Main categories seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
