// Define the structure of restaurant data
export interface Restaurant {
  id: string;
  name: string;
  address: string;
  rating: number;
  cuisine: string;
  priceRange: string;
  dietaryOptions: {
    vegan: boolean;
    vegetarian: boolean;
    glutenFree: boolean;
    peanutFree: boolean;
    dairyFree: boolean;
    nutFree: boolean;
    soyFree: boolean;
    keto: boolean;
    halal: boolean;
    kosher: boolean;
  };
  description: string;
  hours: string;
  phone: string;
  website?: string;
  distance: string; // Distance from Tech Square
}
