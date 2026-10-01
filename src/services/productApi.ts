import apiClient from '@services/apiClient';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
}

export const fetchProducts = async (): Promise<Product[]> => {
  const res = await apiClient.get<Product[]>('/products?limit=12');
  return res.data;
};

export const fetchProductById = async (id: string): Promise<Product> => {
  const res = await apiClient.get<Product>(`/products/${id}`);
  return res.data;
};