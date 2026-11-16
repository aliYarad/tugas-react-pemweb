import type { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: 'Pulpen', price: 5000 },
  { id: 2, name: 'Buku Tulis', price: 12000 },
  { id: 3, name: 'Spidol', price: 8000 },
  { id: 4, name: 'Penggaris', price: 6000 },
  { id: 5, name: 'Penghapus', price: 3000 },
];

const API_BASE_URL = 'http://localhost:3000';

export const getLocalProducts = (): Product[] => {
  const saved = localStorage.getItem('products_data');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore
    }
  }
  localStorage.setItem('products_data', JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
};

export const saveLocalProducts = (products: Product[]) => {
  localStorage.setItem('products_data', JSON.stringify(products));
};

export const fetchProducts = async (): Promise<{ products: Product[]; isApi: boolean }> => {
  try {
    const res = await fetch(`${API_BASE_URL}/products`, { signal: AbortSignal.timeout(2000) });
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    if (Array.isArray(data)) {
      saveLocalProducts(data);
      return { products: data, isApi: true };
    }
  } catch {
    // API server not running or network error, fallback to local
  }
  return { products: getLocalProducts(), isApi: false };
};

export const createProduct = async (
  name: string,
  price: number,
  isApi: boolean
): Promise<Product> => {
  if (isApi) {
    try {
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback if API fails
    }
  }

  // Local fallback
  const current = getLocalProducts();
  const nextId = current.length > 0 ? Math.max(...current.map((p) => p.id)) + 1 : 1;
  const newProduct: Product = { id: nextId, name, price };
  return newProduct;
};

export const updateProduct = async (
  id: number,
  name: string,
  price: number,
  isApi: boolean
): Promise<Product> => {
  if (isApi) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, price }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback if API fails
    }
  }

  return { id, name, price };
};

export const deleteProduct = async (id: number, isApi: boolean): Promise<boolean> => {
  if (isApi) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        return true;
      }
    } catch {
      // Fallback
    }
  }

  return true;
};
