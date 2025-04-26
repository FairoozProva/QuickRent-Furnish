import { apiRequest } from './queryClient';

// Category related API calls
export const fetchCategories = async () => {
  const res = await fetch('/api/categories');
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
};

export const fetchAbout = async () => {
  const res = await fetch('/api/about');
  if (!res.ok) throw new Error('Failed to fetch about sections');
  return res.json();
};

export const fetchCategoryBySlug = async (slug: string) => {
  const res = await fetch(`/api/categories/${slug}`);
  if (!res.ok) throw new Error('Failed to fetch category');
  return res.json();
};

export const addProductToCategory = async (slug: string, product: { 
  name: string; 
  description: string; 
  price: number; 
  imageUrl: string; 
}) => {
  return apiRequest('POST', `/api/categories/${slug}/products`, product);
};

// Product related API calls
// Filter products by category, trending, and new arrivals
export const fetchProducts = async (filters?: { 
  categoryId?: string, 
  trending?: boolean, 
  isNewProduct?: boolean 
}) => {
  let url = '/api/products';
  
  if (filters) {
    const params = new URLSearchParams();
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    if (filters.trending !== undefined) params.append('trending', String(filters.trending));
    if (filters.isNewProduct !== undefined) params.append('isNewProduct', String(filters.isNewProduct));
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
  }
  
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};

export const fetchTrendingProducts = async () => {
  const res = await fetch('/api/products/trending');
  if (!res.ok) throw new Error('Failed to fetch trending products');
  return res.json();
};

export const fetchNewArrivals = async () => {
  const res = await fetch('/api/products/new-arrivals');
  if (!res.ok) throw new Error('Failed to fetch new arrivals');
  return res.json();
};

export const fetchProduct = async (id: string) => {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
};

export const fetchRelatedProducts = async (id: string) => {
  const res = await fetch(`/api/products/${id}/related`);
  if (!res.ok) throw new Error('Failed to fetch related products');
  return res.json();
};

// Wishlist related API calls
export const fetchWishlist = async () => {
  const res = await fetch('/api/wishlist');
  if (!res.ok) throw new Error('Failed to fetch wishlist');
  return res.json();
};

export const addToWishlist = async (productId: string) => {
  return apiRequest('POST', '/api/wishlist', { productId });
};

export const removeFromWishlist = async (productId: string) => {
  return apiRequest('DELETE', `/api/wishlist/${productId}`);
};

export const checkWishlist = async (productId: string) => {
  const res = await fetch(`/api/wishlist/check/${productId}`);
  if (!res.ok) throw new Error('Failed to check wishlist');
  return res.json();
};

// Cart related API calls
export const fetchCart = async () => {
  const res = await fetch('/api/cart');
  if (!res.ok) throw new Error('Failed to fetch cart');
  return res.json();
};

export const addToCart = async (productId: string, duration: number = 3) => {
  return apiRequest('POST', '/api/cart', { productId, duration });
};

export const updateCartItem = async (productId: string, duration: number) => {
  return apiRequest('PUT', `/api/cart/${productId}`, { duration });
};

export const removeFromCart = async (productId: string) => {
  return apiRequest('DELETE', `/api/cart/${productId}`);
};

export const clearCart = async () => {
  return apiRequest('DELETE', '/api/cart');
};

export const checkCart = async (productId: string) => {
  const res = await fetch(`/api/cart/check/${productId}`);
  if (!res.ok) throw new Error('Failed to check cart');
  return res.json();
};

// Rental related API calls
export const fetchRentals = async () => {
  const res = await fetch('/api/rentals');
  if (!res.ok) throw new Error('Failed to fetch rentals');
  return res.json();
};

export const createRentals = async () => {
  return apiRequest('POST', '/api/rentals', {});
};

export const extendRental = async (id: string, duration: number) => {
  return apiRequest('PUT', `/api/rentals/${id}/extend`, { duration });
};

export const fetchRentalAgreement = async (id: string) => {
  const res = await fetch(`/api/rentals/${id}/agreement`);
  if (!res.ok) throw new Error('Failed to fetch rental agreement');
  return res.json();
};

export const signRentalAgreement = async (id: string, paymentMethod: string) => {
  return apiRequest('POST', `/api/rentals/${id}/sign`, { paymentMethod });
};
