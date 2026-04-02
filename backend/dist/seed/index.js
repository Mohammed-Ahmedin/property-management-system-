"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
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
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const category of categoriesData) {
            yield prisma.category.create({
                data: category,
            });
        }
        console.log("✅ Main categories seeded successfully!");
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
