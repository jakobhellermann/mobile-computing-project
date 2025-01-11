export type Product = {
  id: number;
  productName: string;
  description: string;
  category: string;
  price: number;
  stockAmount: number;
  rating?: number;
  totalRatings?: number;
  images: string[];
};

export type Category = {
  name: string;
  imageUrl: string;
  count: number;
  totalStock: number;
};
