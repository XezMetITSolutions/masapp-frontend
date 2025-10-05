import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// Simple ID generator
const generateId = () => Math.random().toString(36).substring(2, 15);

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  notes?: string;
  status: 'pending' | 'preparing' | 'ready' | 'served';
  category: 'food' | 'drink';
  prepTime: number;
}

export interface CentralOrder {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
  orderTime: string;
  estimatedTime: number;
  priority: 'low' | 'normal' | 'high';
  totalAmount: number;
  guests: number;
  createdAt: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  customerNotes?: string;
  waiterId?: string;
  kitchenId?: string;
  cashierId?: string;
}

interface CentralOrderState {
  orders: CentralOrder[];
  
  // Actions
  addOrder: (order: Omit<CentralOrder, 'id' | 'createdAt'>) => string;
  updateOrder: (id: string, updates: Partial<CentralOrder>) => void;
  updateOrderStatus: (id: string, status: CentralOrder['status']) => void;
  updateItemStatus: (orderId: string, itemIndex: number, status: OrderItem['status']) => void;
  addItemToOrder: (orderId: string, item: Omit<OrderItem, 'id'>) => void;
  removeItemFromOrder: (orderId: string, itemIndex: number) => void;
  completeOrder: (id: string) => void;
  cancelOrder: (id: string) => void;
  
  // Getters
  getOrdersByStatus: (status: CentralOrder['status']) => CentralOrder[];
  getOrdersByTable: (tableNumber: number) => CentralOrder[];
  getActiveOrders: () => CentralOrder[];
  getKitchenOrders: () => CentralOrder[]; // Sadece yemek siparişleri
  getDrinkOrders: () => CentralOrder[]; // Sadece içecek siparişleri
  getOrdersByPaymentStatus: (status: CentralOrder['paymentStatus']) => CentralOrder[];
  
  // Demo data
  initializeDemoData: () => void;
}

const useCentralOrderStore = create<CentralOrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      
      addOrder: (order) => {
        const id = generateId();
        const newOrder: CentralOrder = {
          ...order,
          id,
          createdAt: new Date().toISOString(),
        };
        
        set({ orders: [...get().orders, newOrder] });
        return id;
      },
      
      updateOrder: (id, updates) => {
        set({
          orders: get().orders.map(order =>
            order.id === id ? { ...order, ...updates } : order
          )
        });
      },
      
      updateOrderStatus: (id, status) => {
        set({
          orders: get().orders.map(order =>
            order.id === id ? { ...order, status } : order
          )
        });
      },
      
      updateItemStatus: (orderId, itemIndex, status) => {
        set({
          orders: get().orders.map(order => {
            if (order.id === orderId) {
              const updatedItems = [...order.items];
              updatedItems[itemIndex] = { ...updatedItems[itemIndex], status };
              
              // Eğer tüm ürünler hazırsa siparişi hazır yap
              const allReady = updatedItems.every(item => item.status === 'ready');
              const newOrderStatus = allReady ? 'ready' : order.status;
              
              return { ...order, items: updatedItems, status: newOrderStatus };
            }
            return order;
          })
        });
      },
      
      addItemToOrder: (orderId, item) => {
        const newItem: OrderItem = {
          ...item,
          id: generateId(),
        };
        
        set({
          orders: get().orders.map(order =>
            order.id === orderId 
              ? { 
                  ...order, 
                  items: [...order.items, newItem],
                  totalAmount: order.totalAmount + (item.price * item.quantity),
                  estimatedTime: Math.max(order.estimatedTime, item.prepTime)
                }
              : order
          )
        });
      },
      
      removeItemFromOrder: (orderId, itemIndex) => {
        set({
          orders: get().orders.map(order => {
            if (order.id === orderId) {
              const updatedItems = [...order.items];
              const removedItem = updatedItems.splice(itemIndex, 1)[0];
              
              return {
                ...order,
                items: updatedItems,
                totalAmount: order.totalAmount - (removedItem.price * removedItem.quantity)
              };
            }
            return order;
          })
        });
      },
      
      completeOrder: (id) => {
        set({
          orders: get().orders.map(order =>
            order.id === id ? { ...order, status: 'completed' } : order
          )
        });
      },
      
      cancelOrder: (id) => {
        set({
          orders: get().orders.map(order =>
            order.id === id ? { ...order, status: 'cancelled' } : order
          )
        });
      },
      
      // Getters
      getOrdersByStatus: (status) => {
        return get().orders.filter(order => order.status === status);
      },
      
      getOrdersByTable: (tableNumber) => {
        return get().orders.filter(order => order.tableNumber === tableNumber);
      },
      
      getActiveOrders: () => {
        return get().orders.filter(order => 
          ['pending', 'preparing', 'ready', 'served'].includes(order.status)
        );
      },
      
      getKitchenOrders: () => {
        return get().orders.filter(order => {
          // Hem food hem de drink kategorisindeki ürünleri dahil et
          return ['pending', 'preparing', 'ready', 'served'].includes(order.status);
        });
      },
      
      getDrinkOrders: () => {
        return get().orders.filter(order => {
          const hasDrinkItems = order.items.some(item => item.category === 'drink');
          return hasDrinkItems && ['pending', 'preparing', 'ready'].includes(order.status);
        });
      },
      
      getOrdersByPaymentStatus: (status) => {
        return get().orders.filter(order => order.paymentStatus === status);
      },
      
      initializeDemoData: () => {
        // Demo verileri temizlendi - boş başlangıç
        console.log('🔄 Demo verileri temizleniyor...');
        const demoOrders: CentralOrder[] = [
          // 1. Hazırlanıyor - Yüksek Öncelik
          {
            id: '1',
            tableNumber: 5,
            items: [
              { 
                id: '1-1',
                name: 'Izgara Köfte', 
                quantity: 2, 
                price: 60,
                notes: 'Az pişmiş', 
                status: 'preparing', 
                prepTime: 15, 
                category: 'food' 
              },
              { 
                id: '1-2',
                name: 'Çoban Salata', 
                quantity: 1, 
                price: 25,
                notes: 'Ekstra limon', 
                status: 'preparing', 
                prepTime: 5, 
                category: 'food' 
              }
            ],
            status: 'preparing',
            orderTime: '14:30',
            estimatedTime: 15,
            priority: 'high',
            totalAmount: 145,
            guests: 2,
            createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            paymentStatus: 'pending'
          },
          // 2. Hazırlanıyor - Gecikme (25 dakika)
          {
            id: '2',
            tableNumber: 7,
            items: [
              { 
                id: '2-1',
                name: 'Adana Kebap', 
                quantity: 2, 
                price: 45,
                notes: 'Acılı', 
                status: 'preparing', 
                prepTime: 20, 
                category: 'food' 
              },
              { 
                id: '2-2',
                name: 'Pilav', 
                quantity: 2, 
                price: 15,
                notes: 'Az yağlı', 
                status: 'preparing', 
                prepTime: 8, 
                category: 'food' 
              }
            ],
            status: 'preparing',
            orderTime: '14:20',
            estimatedTime: 20,
            priority: 'normal',
            totalAmount: 120,
            guests: 2,
            createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 dakika önce - gecikme var!
            paymentStatus: 'pending'
          },
          // 3. Hazır - Servis bekliyor
          {
            id: '3',
            tableNumber: 8,
            items: [
              { 
                id: '3-1',
                name: 'Humus', 
                quantity: 1, 
                price: 20,
                notes: '', 
                status: 'ready', 
                prepTime: 5, 
                category: 'food' 
              },
              { 
                id: '3-2',
                name: 'Sigara Böreği', 
                quantity: 2, 
                price: 30,
                notes: 'Çok kızarmış', 
                status: 'ready', 
                prepTime: 10, 
                category: 'food' 
              }
            ],
            status: 'ready',
            orderTime: '14:15',
            estimatedTime: 10,
            priority: 'normal',
            totalAmount: 80,
            guests: 3,
            createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
            paymentStatus: 'pending'
          },
          // 4. Hazırlanıyor - Düşük Öncelik
          {
            id: '4',
            tableNumber: 12,
            items: [
              { 
                id: '4-1',
                name: 'Mantı', 
                quantity: 1, 
                price: 40,
                notes: 'Yoğurtlu', 
                status: 'preparing', 
                prepTime: 25, 
                category: 'food' 
              },
              { 
                id: '4-2',
                name: 'Cacık', 
                quantity: 1, 
                price: 15,
                notes: 'Az sarımsak', 
                status: 'preparing', 
                prepTime: 5, 
                category: 'food' 
              }
            ],
            status: 'preparing',
            orderTime: '14:45',
            estimatedTime: 25,
            priority: 'low',
            totalAmount: 55,
            guests: 1,
            createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            paymentStatus: 'pending'
          },
          // 5. Hazırlanıyor - Çok Gecikme (30 dakika)
          {
            id: '5',
            tableNumber: 3,
            items: [
              { 
                id: '5-1',
                name: 'Lahmacun', 
                quantity: 4, 
                price: 25,
                notes: 'İnce hamur', 
                status: 'preparing', 
                prepTime: 15, 
                category: 'food' 
              },
              { 
                id: '5-2',
                name: 'Ayran', 
                quantity: 4, 
                price: 8,
                notes: 'Soğuk', 
                status: 'preparing', 
                prepTime: 2, 
                category: 'food' 
              }
            ],
            status: 'preparing',
            orderTime: '14:10',
            estimatedTime: 15,
            priority: 'high',
            totalAmount: 132,
            guests: 4,
            createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 dakika önce - çok gecikme!
            paymentStatus: 'pending'
          },
          // 6. Hazır - Servis edildi
          {
            id: '6',
            tableNumber: 9,
            items: [
              { 
                id: '6-1',
                name: 'Döner', 
                quantity: 1, 
                price: 35,
                notes: 'Ekstra sos', 
                status: 'served', 
                prepTime: 10, 
                category: 'food' 
              },
              { 
                id: '6-2',
                name: 'Kola', 
                quantity: 1, 
                price: 12,
                notes: '', 
                status: 'served', 
                prepTime: 1, 
                category: 'food' 
              }
            ],
            status: 'served',
            orderTime: '14:00',
            estimatedTime: 10,
            priority: 'normal',
            totalAmount: 47,
            guests: 1,
            createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
            paymentStatus: 'pending'
          },
          {
            id: '2',
            tableNumber: 8,
            items: [
              { 
                id: '2-1',
                name: 'Humus', 
                quantity: 1, 
                price: 20,
                notes: '', 
                status: 'ready', 
                prepTime: 5, 
                category: 'food' 
              },
              { 
                id: '2-2',
                name: 'Sigara Böreği', 
                quantity: 2, 
                price: 30,
                notes: 'Çok kızarmış', 
                status: 'ready', 
                prepTime: 10, 
                category: 'food' 
              }
            ],
            status: 'ready',
            orderTime: '14:25',
            estimatedTime: 10,
            priority: 'normal',
            totalAmount: 80,
            guests: 4,
            createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
            paymentStatus: 'pending'
          },
          {
            id: '3',
            tableNumber: 3,
            items: [
              { 
                id: '3-1',
                name: 'Ayran', 
                quantity: 3, 
                price: 15,
                notes: '', 
                status: 'preparing', 
                prepTime: 2, 
                category: 'drink' 
              }
            ],
            status: 'preparing',
            orderTime: '14:35',
            estimatedTime: 5,
            priority: 'low',
            totalAmount: 45,
            guests: 1,
            createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
            paymentStatus: 'pending'
          },
          {
            id: '4',
            tableNumber: 12,
            items: [
              { 
                id: '4-1',
                name: 'Lahmacun', 
                quantity: 4, 
                price: 25,
                notes: 'Kıtır olsun', 
                status: 'preparing', 
                prepTime: 12, 
                category: 'food' 
              },
              { 
                id: '4-2',
                name: 'Çay', 
                quantity: 4, 
                price: 8,
                notes: '', 
                status: 'preparing', 
                prepTime: 3, 
                category: 'drink' 
              }
            ],
            status: 'preparing',
            orderTime: '14:40',
            estimatedTime: 12,
            priority: 'normal',
            totalAmount: 132,
            guests: 4,
            createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            paymentStatus: 'pending'
          },
          {
            id: '5',
            tableNumber: 7,
            items: [
              { 
                id: '5-1',
                name: 'Döner', 
                quantity: 1, 
                price: 40,
                notes: 'Ekstra sos', 
                status: 'ready', 
                prepTime: 8, 
                category: 'food' 
              },
              { 
                id: '5-2',
                name: 'Kola', 
                quantity: 1, 
                price: 7,
                notes: '', 
                status: 'ready', 
                prepTime: 1, 
                category: 'drink' 
              }
            ],
            status: 'ready',
            orderTime: '14:20',
            estimatedTime: 8,
            priority: 'normal',
            totalAmount: 47,
            guests: 1,
            createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
            paymentStatus: 'pending'
          },
          // 3. Hazır - Servis bekliyor
          {
            id: '3',
            tableNumber: 8,
            items: [
              { 
                id: '3-1',
                name: 'Humus', 
                quantity: 1, 
                price: 20,
                notes: '', 
                status: 'ready', 
                prepTime: 5, 
                category: 'food' 
              },
              { 
                id: '3-2',
                name: 'Sigara Böreği', 
                quantity: 2, 
                price: 30,
                notes: 'Çok kızarmış', 
                status: 'ready', 
                prepTime: 10, 
                category: 'food' 
              }
            ],
            status: 'ready',
            orderTime: '14:15',
            estimatedTime: 10,
            priority: 'normal',
            totalAmount: 80,
            guests: 3,
            createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
            paymentStatus: 'pending'
          },
          // 4. Tamamlanan - Masa 2
          {
            id: '4',
            tableNumber: 2,
            items: [
              { 
                id: '4-1',
                name: 'Lahmacun', 
                quantity: 4, 
                price: 25,
                notes: 'Kıtır olsun', 
                status: 'served', 
                prepTime: 12, 
                category: 'food' 
              },
              { 
                id: '4-2',
                name: 'Çay', 
                quantity: 4, 
                price: 8,
                notes: '', 
                status: 'served', 
                prepTime: 3, 
                category: 'drink' 
              }
            ],
            status: 'served',
            orderTime: '14:00',
            estimatedTime: 12,
            priority: 'normal',
            totalAmount: 132,
            guests: 4,
            createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
            paymentStatus: 'pending'
          },
          // 5. Tamamlanan - Masa 9
          {
            id: '5',
            tableNumber: 9,
            items: [
              { 
                id: '5-1',
                name: 'Döner', 
                quantity: 1, 
                price: 35,
                notes: 'Ekstra sos', 
                status: 'served', 
                prepTime: 10, 
                category: 'food' 
              },
              { 
                id: '5-2',
                name: 'Kola', 
                quantity: 1, 
                price: 12,
                notes: '', 
                status: 'served', 
                prepTime: 1, 
                category: 'food' 
              }
            ],
            status: 'served',
            orderTime: '14:00',
            estimatedTime: 10,
            priority: 'normal',
            totalAmount: 47,
            guests: 1,
            createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
            paymentStatus: 'pending'
          },
          // 6. Hazırlanıyor - Masa 12
          {
            id: '6',
            tableNumber: 12,
            items: [
              { 
                id: '6-1',
                name: 'Mantı', 
                quantity: 1, 
                price: 40,
                notes: 'Yoğurtlu', 
                status: 'preparing', 
                prepTime: 25, 
                category: 'food' 
              },
              { 
                id: '6-2',
                name: 'Cacık', 
                quantity: 1, 
                price: 15,
                notes: 'Az sarımsak', 
                status: 'preparing', 
                prepTime: 5, 
                category: 'food' 
              }
            ],
            status: 'preparing',
            orderTime: '14:45',
            estimatedTime: 25,
            priority: 'low',
            totalAmount: 55,
            guests: 1,
            createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
            paymentStatus: 'pending'
          },
          // 7. Hazırlanıyor - Masa 3
          {
            id: '7',
            tableNumber: 3,
            items: [
              { 
                id: '7-1',
                name: 'Lahmacun', 
                quantity: 4, 
                price: 25,
                notes: 'İnce hamur', 
                status: 'preparing', 
                prepTime: 15, 
                category: 'food' 
              },
              { 
                id: '7-2',
                name: 'Ayran', 
                quantity: 4, 
                price: 8,
                notes: 'Soğuk', 
                status: 'preparing', 
                prepTime: 2, 
                category: 'food' 
              }
            ],
            status: 'preparing',
            orderTime: '14:10',
            estimatedTime: 15,
            priority: 'high',
            totalAmount: 132,
            guests: 4,
            createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            paymentStatus: 'pending'
          }
        ];
        
        set({ orders: [] });
        console.log('✅ Merkezi store temizlendi - demo veriler kaldırıldı');
      }
    }),
    {
      name: 'central-order-store',
    }
  )
);

export default useCentralOrderStore;
