export type PropertyType = "SHARED" | "PRIVATE" | "ENTIRE_PLACE";

export interface About {
  description: string;
  checkIn: string;
  checkOut: string;
  maxGuests: number;
}

export interface Feedback {
  message: string;
  rating: number;
  author?: string;
  date?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

export interface Contact {
  phone: string;
  email: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  type: PropertyType;
  imageUrl: string;
  about?: About;
  feedbacks?: Feedback[];
  location?: Location;
  facilities: string[];
  contact?: Contact;
  createdAt?: string;
  pricePerNight?: number;
}
