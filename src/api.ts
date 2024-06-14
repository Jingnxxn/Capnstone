// src/api.ts
import axios from 'axios';
import { Product } from './types';

const API_URL = 'http://localhost:5000/api';

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
