/**
 * API Service Layer
 * Replaces localStorage with backend API calls
 */

const API_BASE_URL = 'https://masapp-backend.onrender.com/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Restaurant endpoints
  async getRestaurants() {
    return this.request<any[]>('/restaurants');
  }

  async getRestaurantByUsername(username: string) {
    return this.request<any>(`/restaurants/username/${username}`);
  }

  async getRestaurantById(id: string) {
    return this.request<any>(`/restaurants/${id}`);
  }

  async createRestaurant(data: any) {
    return this.request<any>('/restaurants', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRestaurant(id: string, data: any) {
    return this.request<any>(`/restaurants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateRestaurantFeatures(id: string, features: string[]) {
    return this.request<any>(`/restaurants/${id}/features`, {
      method: 'PUT',
      body: JSON.stringify({ features }),
    });
  }

  // Menu endpoints
  async getRestaurantMenu(restaurantId: string) {
    return this.request<any>(`/restaurants/${restaurantId}/menu`);
  }

  async createMenuCategory(restaurantId: string, data: any) {
    return this.request<any>(`/restaurants/${restaurantId}/menu/categories`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMenuCategory(restaurantId: string, categoryId: string, data: any) {
    return this.request<any>(`/restaurants/${restaurantId}/menu/categories/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMenuCategory(restaurantId: string, categoryId: string) {
    return this.request<any>(`/restaurants/${restaurantId}/menu/categories/${categoryId}`, {
      method: 'DELETE',
    });
  }

  async createMenuItem(restaurantId: string, data: any) {
    return this.request<any>(`/restaurants/${restaurantId}/menu/items`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMenuItem(restaurantId: string, itemId: string, data: any) {
    return this.request<any>(`/restaurants/${restaurantId}/menu/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMenuItem(restaurantId: string, itemId: string) {
    return this.request<any>(`/restaurants/${restaurantId}/menu/items/${itemId}`, {
      method: 'DELETE',
    });
  }

  // Order endpoints
  async getRestaurantOrders(restaurantId: string) {
    return this.request<any[]>(`/restaurants/${restaurantId}/orders`);
  }

  async createOrder(restaurantId: string, data: any) {
    return this.request<any>(`/restaurants/${restaurantId}/orders`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateOrderStatus(orderId: string, status: string) {
    return this.request<any>(`/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async getOrderById(orderId: string) {
    return this.request<any>(`/orders/${orderId}`);
  }

  // Authentication endpoints
  async login(credentials: { username: string; password: string }) {
    return this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.request<any>('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request<any>('/auth/me');
  }

  async refreshToken() {
    return this.request<any>('/auth/refresh', {
      method: 'POST',
    });
  }
}

export const apiService = new ApiService();
export default apiService;
