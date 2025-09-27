import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('masapp-admin-user');
      const token = localStorage.getItem('masapp-admin-token');
      
      if (!userData || !token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        router.push('/admin/login');
        return;
      }
      
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('User data parse error:', error);
        localStorage.removeItem('masapp-admin-user');
        localStorage.removeItem('masapp-admin-token');
        setIsAuthenticated(false);
        router.push('/admin/login');
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const logout = () => {
    localStorage.removeItem('masapp-admin-user');
    localStorage.removeItem('masapp-admin-token');
    setIsAuthenticated(false);
    setUser(null);
    router.push('/admin/login');
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    logout
  };
}
