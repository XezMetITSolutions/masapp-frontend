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
}

export const useAuthStore = create<AuthState>()((set, get) => ({
      authenticatedRestaurant: null,
      authenticatedStaff: null,
      loginRestaurant: (restaurant) => set({ authenticatedRestaurant: restaurant, authenticatedStaff: null }),
      loginStaff: (staff) => set({ authenticatedStaff: staff, authenticatedRestaurant: null }),
      logout: () => set({ authenticatedRestaurant: null, authenticatedStaff: null }),
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
}));

export default useAuthStore;
