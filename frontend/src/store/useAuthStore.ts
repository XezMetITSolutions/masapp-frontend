import { create } from 'zustand';
import { Restaurant, Staff } from '@/types';

interface AuthState {
  authenticatedRestaurant: Restaurant | null;
  authenticatedStaff: Staff | null;
  loginRestaurant: (restaurant: Restaurant) => void;
  loginStaff: (staff: Staff) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  getRole: () => string | null;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
      authenticatedRestaurant: null,
      authenticatedStaff: null,
      loginRestaurant: (restaurant) => {
        set({ authenticatedRestaurant: restaurant, authenticatedStaff: null });
        // localStorage'a kaydet
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentRestaurant', JSON.stringify(restaurant));
        }
      },
      loginStaff: (staff) => {
        set({ authenticatedStaff: staff, authenticatedRestaurant: null });
        // localStorage'a kaydet
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentStaff', JSON.stringify(staff));
        }
      },
      logout: () => {
        set({ authenticatedRestaurant: null, authenticatedStaff: null });
        // Cookie'yi temizle
        if (typeof window !== 'undefined') {
          document.cookie = 'accessToken=; path=/; max-age=0';
          localStorage.removeItem('currentRestaurant');
          localStorage.removeItem('currentStaff');
        }
      },
      isAuthenticated: () => {
        const state = get();
        return state.authenticatedRestaurant !== null || state.authenticatedStaff !== null;
      },
      getRole: () => {
        const state = get();
        if (state.authenticatedStaff) return state.authenticatedStaff.role;
        if (state.authenticatedRestaurant) return 'restaurant_owner';
        return null;
      },
      initializeAuth: () => {
        if (typeof window !== 'undefined') {
          try {
            const savedRestaurant = localStorage.getItem('currentRestaurant');
            const savedStaff = localStorage.getItem('currentStaff');
            
            if (savedRestaurant) {
              const restaurant = JSON.parse(savedRestaurant);
              set({ authenticatedRestaurant: restaurant, authenticatedStaff: null });
            } else if (savedStaff) {
              const staff = JSON.parse(savedStaff);
              set({ authenticatedStaff: staff, authenticatedRestaurant: null });
            }
          } catch (error) {
            console.error('Error initializing auth:', error);
          }
        }
      },
}));

export default useAuthStore;
