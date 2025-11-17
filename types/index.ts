// /types/index.ts

// Example of a custom type you might use throughout the app
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Réfrigérateurs' | 'Lave-linge' | 'TV';
  image_url: string;
  stock: number;
};
