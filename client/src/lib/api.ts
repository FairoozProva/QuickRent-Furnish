import { apiRequest } from './queryClient';

// Category related API calls
export const fetchCategories = async () => {
  return apiRequest('GET', '/api/categories');
};

export const fetchAbout = async () => {
  return apiRequest('GET', '/api/about');
};

export const fetchCategoryBySlug = async (slug: string) => {
  return apiRequest('GET', `/api/categories/${slug}`);
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
  
  return apiRequest('GET', url);
};

export const fetchTrendingProducts = async () => {
  return apiRequest('GET', '/api/products/trending');
};

export const fetchNewArrivals = async () => {
  return apiRequest('GET', '/api/products/new-arrivals');
};

export const fetchProduct = async (id: string) => {
  return apiRequest('GET', `/api/products/${id}`);
};

export const fetchRelatedProducts = async (id: string) => {
  return apiRequest('GET', `/api/products/${id}/related`);
};

// Wishlist related API calls
export const fetchWishlist = async () => {
  return apiRequest('GET', '/api/wishlist');
};

export const addToWishlist = async (productId: string) => {
  return apiRequest('POST', '/api/wishlist', { productId });
};

export const removeFromWishlist = async (productId: string) => {
  return apiRequest('DELETE', `/api/wishlist/${productId}`);
};

export const checkWishlist = async (productId: string) => {
  return apiRequest('GET', `/api/wishlist/check/${productId}`);
};

// Cart related API calls
export const fetchCart = async () => {
  return apiRequest('GET', '/api/cart');
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
  return apiRequest('GET', `/api/cart/check/${productId}`);
};

// Rental related API calls
export const fetchRentals = async () => {
  return apiRequest('GET', '/api/rentals');
};

export const createRentals = async () => {
  return apiRequest('POST', '/api/rentals', {});
};

export const extendRental = async (id: string, duration: number) => {
  return apiRequest('PUT', `/api/rentals/${id}/extend`, { duration });
};

export const fetchRentalAgreement = async (id: string) => {
  return apiRequest('GET', `/api/rentals/${id}/agreement`);
};

export const signRentalAgreement = async (id: string, paymentMethod: string) => {
  return apiRequest('POST', `/api/rentals/${id}/sign`, { paymentMethod });
};

// User related API calls 
export const getUserById = async (userId: string) => {
  return apiRequest('GET', `/api/user/get-user/${userId}`);
};

export const updateUser = async (userData: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}) => {
  return apiRequest('PUT', '/api/user/profile', userData);
};
