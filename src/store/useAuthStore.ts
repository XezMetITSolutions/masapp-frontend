import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  lastActivity: Date | null;
  
  // Actions
  login: (user: User, accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  refreshTokens: () => Promise<boolean>;
  checkAuth: () => Promise<boolean>;
  setLoading: (loading: boolean) => void;
  
  // Role checks
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  isAdmin: () => boolean;
  isRestaurantUser: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      lastActivity: null,
      
      login: async (user, accessToken, refreshToken) => {
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          lastActivity: new Date(),
        });
        
        // Cookie'leri ayarla (client-side için)
        if (typeof document !== 'undefined') {
          document.cookie = `accessToken=${accessToken}; path=/; max-age=${7 * 24 * 60 * 60}`;
          document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}`;
        }
      },
      
      logout: async () => {
        try {
          // Server'a logout isteği gönder
          await fetch('/api/admin/auth/logout', {
            method: 'POST',
            credentials: 'include',
          });
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            lastActivity: null,
          });
          
          // Cookie'leri temizle
          if (typeof document !== 'undefined') {
            document.cookie = 'accessToken=; path=/; max-age=0';
            document.cookie = 'refreshToken=; path=/; max-age=0';
          }
        }
      },
      
      updateUser: (updatedUser) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        }));
      },
      
      refreshTokens: async () => {
        try {
          const response = await fetch('/api/admin/auth/refresh', {
            method: 'POST',
            credentials: 'include',
          });
          
          if (response.ok) {
            const data = await response.json();
            set({
              accessToken: data.accessToken,
              user: data.user,
              isAuthenticated: true,
              lastActivity: new Date(),
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Token refresh error:', error);
          return false;
        }
      },
      
      checkAuth: async () => {
        const state = get();
        if (!state.accessToken) return false;
        
        try {
          const response = await fetch('/api/admin/auth/me', {
            method: 'GET',
            credentials: 'include',
          });
          
          if (response.ok) {
            const data = await response.json();
            set({
              user: data.user,
              isAuthenticated: true,
              lastActivity: new Date(),
            });
            return true;
          }
          
          // Token geçersizse refresh dene
          return await state.refreshTokens();
        } catch (error) {
          console.error('Auth check error:', error);
          return false;
        }
      },
      
      setLoading: (loading) => {
        set({ isLoading: loading });
      },
      
      // Role check methods
      hasRole: (role) => {
        const state = get();
        return state.user?.role === role;
      },
      
      hasAnyRole: (roles) => {
        const state = get();
        return state.user ? roles.includes(state.user.role) : false;
      },
      
      isAdmin: () => {
        const state = get();
        return state.user?.role === 'super_admin';
      },
      
      isRestaurantUser: () => {
        const state = get();
        return state.user ? ['restaurant_owner', 'restaurant_admin'].includes(state.user.role) : false;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        lastActivity: state.lastActivity,
      }),
    }
  )
);
