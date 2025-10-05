import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Restaurant, MenuCategory, MenuItem, Order, ServiceCall } from '@/types';

interface RestaurantState {
  // Mevcut restoran bilgisi
  currentRestaurant: Restaurant | null;
  
  // Tüm restoranlar (admin için)
  restaurants: Restaurant[];
  
  // Menü verileri
  categories: MenuCategory[];
  menuItems: MenuItem[];
  
  // Siparişler
  orders: Order[];
  activeOrders: Order[];
  
  // Servis çağrıları
  serviceCalls: ServiceCall[];
  
  // Actions
  setCurrentRestaurant: (restaurant: Restaurant) => void;
  setRestaurants: (restaurants: Restaurant[]) => void;
  addRestaurant: (restaurant: Restaurant) => void;
  updateRestaurant: (id: string, updates: Partial<Restaurant>) => void;
  deleteRestaurant: (id: string) => void;
  
  // Menü Actions
  setCategories: (categories: MenuCategory[]) => void;
  addCategory: (category: MenuCategory) => void;
  updateCategory: (id: string, updates: Partial<MenuCategory>) => void;
  deleteCategory: (id: string) => void;
  
  setMenuItems: (items: MenuItem[]) => void;
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  
  // Sipariş Actions
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  updateOrderItemStatus: (orderId: string, itemIndex: number, status: 'pending' | 'preparing' | 'ready' | 'served') => void;
  
  // Servis Çağrısı Actions
  setServiceCalls: (calls: ServiceCall[]) => void;
  addServiceCall: (call: ServiceCall) => void;
  updateServiceCallStatus: (id: string, status: ServiceCall['status'], acknowledgedBy?: string) => void;
  clearCompletedCalls: () => void;
}

const getInitialState = () => ({
  currentRestaurant: null,
  restaurants: [
    {
      id: 'rest_1',
      name: 'Lezzet Durağı',
      username: 'lezzet',
      password: '123456',
      primaryColor: '#D32F2F',
      secondaryColor: '#FFC107',
      address: 'Merkez Mah. Lezzet Sk. No:1, Kadıköy, İstanbul',
      phone: '0216 123 45 67',
      email: 'info@lezzetduragi.com',
      ownerId: 'owner_1',
      tableCount: 20,
      qrCodes: [],
      settings: { language: ['tr'], currency: 'TRY', taxRate: 18, serviceChargeRate: 0, allowTips: true, allowOnlinePayment: true, autoAcceptOrders: false, workingHours: [] },
      subscription: { plan: 'premium' as const, startDate: new Date(), endDate: new Date(), status: 'active' as const },
      createdAt: new Date(),
      status: 'active' as const
    },
    {
      id: 'rest_2',
      name: 'Cafe Corner',
      username: 'cafe',
      password: '123456',
      primaryColor: '#388E3C',
      secondaryColor: '#8BC34A',
      address: 'Kızılay Meydanı, Çankaya, Ankara',
      phone: '0312 987 65 43',
      email: 'contact@cafecorner.com',
      ownerId: 'owner_2',
      tableCount: 15,
      qrCodes: [],
      settings: { language: ['tr', 'en'], currency: 'TRY', taxRate: 18, serviceChargeRate: 5, allowTips: true, allowOnlinePayment: true, autoAcceptOrders: true, workingHours: [] },
      subscription: { plan: 'premium' as const, startDate: new Date(), endDate: new Date(), status: 'active' as const },
      createdAt: new Date(),
      status: 'active' as const
    },
    {
      id: 'rest_3',
      name: 'Kardeşler Pide',
      username: 'kardesler',
      password: '123456',
      primaryColor: '#1976D2',
      secondaryColor: '#64B5F6',
      address: 'Alsancak, Konak, İzmir',
      phone: '0232 456 78 90',
      email: 'siparis@kardeslerpide.com',
      ownerId: 'owner_3',
      tableCount: 25,
      qrCodes: [],
      settings: { language: ['tr'], currency: 'TRY', taxRate: 18, serviceChargeRate: 0, allowTips: false, allowOnlinePayment: false, autoAcceptOrders: false, workingHours: [] },
      subscription: { plan: 'basic' as const, startDate: new Date(), endDate: new Date(), status: 'active' as const },
      createdAt: new Date(),
      status: 'active' as const
    }
  ],
  categories: [],
  menuItems: [],
  orders: [],
  activeOrders: [],
  serviceCalls: [],
});

const useRestaurantStore = create<RestaurantState>()(
  persist(
    (set) => ({
      ...getInitialState(),
      currentRestaurant: null,
      categories: [],
      menuItems: [],
      orders: [],
      activeOrders: [],
      serviceCalls: [],
      
      // Restaurant Actions
      setCurrentRestaurant: (restaurant) => set({ currentRestaurant: restaurant }),
      
      setRestaurants: (restaurants) => set({ restaurants }),
      
      addRestaurant: (restaurant) => set((state) => ({
        restaurants: [...state.restaurants, restaurant]
      })),
      
      updateRestaurant: (id, updates) => set((state) => ({
        restaurants: state.restaurants.map(r => 
          r.id === id ? { ...r, ...updates } : r
        ),
        currentRestaurant: state.currentRestaurant?.id === id 
          ? { ...state.currentRestaurant, ...updates }
          : state.currentRestaurant
      })),
      
      deleteRestaurant: (id) => set((state) => ({
        restaurants: state.restaurants.filter(r => r.id !== id)
      })),
      
      // Category Actions
      setCategories: (categories) => set({ categories }),
      
      addCategory: (category) => set((state) => ({
        categories: [...state.categories, category]
      })),
      
      updateCategory: (id, updates) => set((state) => ({
        categories: state.categories.map(c => 
          c.id === id ? { ...c, ...updates } : c
        )
      })),
      
      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter(c => c.id !== id),
        menuItems: state.menuItems.filter(item => item.categoryId !== id)
      })),
      
      // Menu Item Actions
      setMenuItems: (items) => set({ menuItems: items }),
      
      addMenuItem: (item) => set((state) => ({
        menuItems: [...state.menuItems, item]
      })),
      
      updateMenuItem: (id, updates) => set((state) => ({
        menuItems: state.menuItems.map(item => 
          item.id === id ? { ...item, ...updates } : item
        )
      })),
      
      deleteMenuItem: (id) => set((state) => ({
        menuItems: state.menuItems.filter(item => item.id !== id)
      })),
      
      // Order Actions
      setOrders: (orders) => set({ 
        orders,
        activeOrders: orders.filter(o => 
          ['pending', 'confirmed', 'preparing', 'ready', 'served'].includes(o.status)
        )
      }),
      
      addOrder: (order) => set((state) => ({
        orders: [...state.orders, order],
        activeOrders: [...state.activeOrders, order]
      })),
      
      updateOrderStatus: (id, status) => set((state) => {
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
      
      updateOrderItemStatus: (orderId, itemIndex, status) => set((state) => ({
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
      setServiceCalls: (calls) => set({ serviceCalls: calls }),
      
      addServiceCall: (call) => set((state) => ({
        serviceCalls: [...state.serviceCalls, call]
      })),
      
      updateServiceCallStatus: (id, status, acknowledgedBy) => set((state) => ({
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
    }),
    {
      name: 'restaurant-storage',
      onRehydrateStorage: () => (state) => {
        if (state && state.restaurants.length === 0) {
          state.restaurants = getInitialState().restaurants;
        }
      },
    }
  )
);

export default useRestaurantStore;
