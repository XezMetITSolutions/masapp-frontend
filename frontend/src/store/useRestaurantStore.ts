import { create } from 'zustand';
import { Restaurant, MenuCategory, MenuItem, Order, ServiceCall } from '@/types';
import { apiService } from '@/services/api';

interface RestaurantState {
  // Data
  restaurants: Restaurant[];
  currentRestaurant: Restaurant | null;
  categories: MenuCategory[];
  menuItems: MenuItem[];
  orders: Order[];
  activeOrders: Order[];
  serviceCalls: ServiceCall[];
  loading: boolean;
  error: string | null;
  
  // API Actions
  fetchRestaurants: () => Promise<void>;
  fetchRestaurantByUsername: (username: string) => Promise<void>;
  createRestaurant: (data: Partial<Restaurant>) => Promise<void>;
  updateRestaurant: (id: string, updates: Partial<Restaurant>) => Promise<void>;
  updateRestaurantFeatures: (id: string, features: string[]) => Promise<void>;
  
  // Local Actions (for backward compatibility)
  setCurrentRestaurant: (restaurant: Restaurant) => void;
  setRestaurants: (restaurants: Restaurant[]) => void;
  addRestaurant: (restaurant: Restaurant) => void;
  deleteRestaurant: (id: string) => void;
  
  // Menu Actions
  setCategories: (categories: MenuCategory[]) => void;
  addCategory: (category: MenuCategory) => void;
  updateCategory: (id: string, updates: Partial<MenuCategory>) => void;
  deleteCategory: (id: string) => void;
  
  setMenuItems: (items: MenuItem[]) => void;
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  
  // Order Actions
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  updateOrderItemStatus: (orderId: string, itemIndex: number, status: 'pending' | 'preparing' | 'ready' | 'served') => void;
  
  // Service Call Actions
  setServiceCalls: (calls: ServiceCall[]) => void;
  addServiceCall: (call: ServiceCall) => void;
  updateServiceCallStatus: (id: string, status: ServiceCall['status'], acknowledgedBy?: string) => void;
  clearCompletedCalls: () => void;
}

const useRestaurantStore = create<RestaurantState>((set, get) => ({
  // Initial state
  restaurants: [],
  currentRestaurant: null,
  categories: [],
  menuItems: [],
  orders: [],
  activeOrders: [],
  serviceCalls: [],
  loading: false,
  error: null,
  
  // API Actions
  fetchRestaurants: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.getRestaurants();
      if (response.success) {
        set({ restaurants: response.data || [], loading: false });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch restaurants', loading: false });
    }
  },
  
  fetchRestaurantByUsername: async (username: string) => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.getRestaurantByUsername(username);
      if (response.success) {
        set({ 
          currentRestaurant: response.data,
          categories: response.data?.categories || [],
          menuItems: response.data?.menuItems || [],
          loading: false 
        });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch restaurant', loading: false });
    }
  },
  
  createRestaurant: async (data: Partial<Restaurant>) => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.createRestaurant(data);
      if (response.success) {
        set((state) => ({ 
          restaurants: [...state.restaurants, response.data],
          loading: false 
        }));
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create restaurant', loading: false });
    }
  },
  
  updateRestaurant: async (id: string, updates: Partial<Restaurant>) => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.updateRestaurant(id, updates);
      if (response.success) {
        set((state) => ({
          restaurants: state.restaurants.map(r => 
            r.id === id ? { ...r, ...response.data } : r
          ),
          currentRestaurant: state.currentRestaurant?.id === id 
            ? { ...state.currentRestaurant, ...response.data }
            : state.currentRestaurant,
          loading: false
        }));
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update restaurant', loading: false });
    }
  },
  
  updateRestaurantFeatures: async (id: string, features: string[]) => {
    set({ loading: true, error: null });
    try {
      const response = await apiService.updateRestaurantFeatures(id, features);
      if (response.success) {
        set((state) => ({
          restaurants: state.restaurants.map(r => 
            r.id === id ? { ...r, features } : r
          ),
          currentRestaurant: state.currentRestaurant?.id === id 
            ? { ...state.currentRestaurant, features }
            : state.currentRestaurant,
          loading: false
        }));
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update features', loading: false });
    }
  },
  
  // Local Actions (for backward compatibility)
  setCurrentRestaurant: (restaurant: Restaurant) => set({ currentRestaurant: restaurant }),
  
  setRestaurants: (restaurants: Restaurant[]) => set({ restaurants }),
  
  addRestaurant: (restaurant: Restaurant) => set((state) => ({
    restaurants: [...state.restaurants, restaurant]
  })),
  
  deleteRestaurant: (id: string) => set((state) => ({
    restaurants: state.restaurants.filter(r => r.id !== id)
  })),
  
  // Menu Actions
  setCategories: (categories: MenuCategory[]) => set({ categories }),
  
  addCategory: (category: MenuCategory) => set((state) => ({
    categories: [...state.categories, category]
  })),
  
  updateCategory: (id: string, updates: Partial<MenuCategory>) => set((state) => ({
    categories: state.categories.map(c => 
      c.id === id ? { ...c, ...updates } : c
    )
  })),
  
  deleteCategory: (id: string) => set((state) => ({
    categories: state.categories.filter(c => c.id !== id),
    menuItems: state.menuItems.filter(item => item.categoryId !== id)
  })),
  
  setMenuItems: (items: MenuItem[]) => set({ menuItems: items }),
  
  addMenuItem: (item: MenuItem) => set((state) => ({
    menuItems: [...state.menuItems, item]
  })),
  
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => set((state) => ({
    menuItems: state.menuItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    )
  })),
  
  deleteMenuItem: (id: string) => set((state) => ({
    menuItems: state.menuItems.filter(item => item.id !== id)
  })),
  
  // Order Actions
  setOrders: (orders: Order[]) => set({ 
    orders,
    activeOrders: orders.filter(o => 
      ['pending', 'confirmed', 'preparing', 'ready', 'served'].includes(o.status)
    )
  }),
  
  addOrder: (order: Order) => set((state) => ({
    orders: [...state.orders, order],
    activeOrders: [...state.activeOrders, order]
  })),
  
  updateOrderStatus: (id: string, status: Order['status']) => set((state) => {
    const updatedOrders = state.orders.map(o => 
      o.id === id ? { ...o, status } : o
    );
    return {
      orders: updatedOrders,
      activeOrders: updatedOrders.filter(o => 
        ['pending', 'confirmed', 'preparing', 'ready', 'served'].includes(o.status)
      )
    };
  }),
  
  updateOrderItemStatus: (orderId: string, itemIndex: number, status: 'pending' | 'preparing' | 'ready' | 'served') => set((state) => ({
    orders: state.orders.map(order => {
      if (order.id === orderId) {
        const updatedItems = [...order.items];
        updatedItems[itemIndex] = { ...updatedItems[itemIndex], status };
        return { ...order, items: updatedItems };
      }
      return order;
    })
  })),
  
  // Service Call Actions
  setServiceCalls: (calls: ServiceCall[]) => set({ serviceCalls: calls }),
  
  addServiceCall: (call: ServiceCall) => set((state) => ({
    serviceCalls: [...state.serviceCalls, call]
  })),
  
  updateServiceCallStatus: (id: string, status: ServiceCall['status'], acknowledgedBy?: string) => set((state) => ({
    serviceCalls: state.serviceCalls.map(call => 
      call.id === id 
        ? { 
            ...call, 
            status,
            acknowledgedBy: acknowledgedBy || call.acknowledgedBy,
            acknowledgedAt: status === 'acknowledged' ? new Date() : call.acknowledgedAt,
            completedAt: status === 'completed' ? new Date() : call.completedAt
          }
        : call
    )
  })),
  
  clearCompletedCalls: () => set((state) => ({
    serviceCalls: state.serviceCalls.filter(call => call.status !== 'completed')
  })),
}));

export default useRestaurantStore;
