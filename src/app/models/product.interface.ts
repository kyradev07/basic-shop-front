export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: number;
  images?: string[] | null;
}
