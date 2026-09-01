export interface Product {
  id?: number;
  title: string;
  price: number;
  description: string;
}

export interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
