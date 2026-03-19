import type { Property } from "./property.types";

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;      // optional category banner or icon
  parentId?: string;
  icon?: string;

  parent?: Category;             // optional parent category
  subcategories?: Category[];    // optional array of subcategories
  properties?: Property[];    // optional array of properties in this category

  createdAt: string;  // ISO string
  updatedAt: string;  // ISO string
}
