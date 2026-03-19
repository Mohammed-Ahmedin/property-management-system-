export interface City {
  id: string;
  name: string;
  subcities: string[];
}

export const CITIES: City[] = [
  {
    id: "addis-ababa",
    name: "Addis Ababa",
    subcities: [
      "Bole",
      "Kirkos",
      "Arada",
      "Lideta",
      "Yeka",
      "Nifas Silk-Lafto",
      "Kolfe Keranio",
      "Gulele",
      "Addis Ketema",
      "Akaky Kaliti",
    ],
  },
  {
    id: "dire-dawa",
    name: "Dire Dawa",
    subcities: ["Kezira", "Goro", "Dechatu", "Melka Jebdu"],
  },
  {
    id: "hawassa",
    name: "Hawassa",
    subcities: ["Menaharia", "Tabor", "Haik Dar", "Addis Ketema"],
  },
  {
    id: "mekelle",
    name: "Mekelle",
    subcities: ["Ayder", "Hawelti", "Kedamay Weyane", "Hadnet"],
  },
  {
    id: "bahir-dar",
    name: "Bahir Dar",
    subcities: ["Shimbit", "Sefene Selam", "Belay Zeleke", "Gish Abay"],
  },
];

export const GUEST_HOUSE_TYPES = [
  { id: "private", label: "Private" },
  { id: "shared", label: "Shared" },
] as const;

export const MIN_PRICE = 0;
export const MAX_PRICE = 10000;
export const PRICE_STEP = 100;
