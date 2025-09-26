// Demo kullanıcıları oluşturmak için yardımcı fonksiyonlar

export const createDemoUsers = () => {
  const demoUsers = [
    {
      id: 'demo-restaurant-owner-1',
      name: 'Kardesler Restoran',
      email: 'info@kardesler.com',
      role: 'restaurant_owner' as const,
      restaurantId: 'kardesler-restaurant-1',
      status: 'active' as const,
      createdAt: new Date()
    },
    {
      id: 'demo-waiter-1',
      name: 'Ahmet Garson',
      email: 'ahmet@kardesler.com',
      role: 'waiter' as const,
      restaurantId: 'kardesler-restaurant-1',
      status: 'active' as const,
      createdAt: new Date()
    },
    {
      id: 'demo-kitchen-1',
      name: 'Mehmet Aşçı',
      email: 'mehmet@kardesler.com',
      role: 'kitchen' as const,
      restaurantId: 'kardesler-restaurant-1',
      status: 'active' as const,
      createdAt: new Date()
    },
    {
      id: 'demo-cashier-1',
      name: 'Fatma Kasa',
      email: 'fatma@kardesler.com',
      role: 'cashier' as const,
      restaurantId: 'kardesler-restaurant-1',
      status: 'active' as const,
      createdAt: new Date()
    }
  ];

  return demoUsers;
};

export const saveDemoUsersToLocalStorage = () => {
  const users = createDemoUsers();
  
  // Her kullanıcı için localStorage'a kaydet
  users.forEach(user => {
    const userData = {
      state: {
        user: user,
        accessToken: `demo-token-${user.id}`,
        refreshToken: `demo-refresh-${user.id}`,
        isAuthenticated: true,
        lastActivity: new Date()
      }
    };
    
    localStorage.setItem(`auth-storage-${user.id}`, JSON.stringify(userData));
  });
  
  console.log('👥 Demo kullanıcıları localStorage\'a kaydedildi:', users.map(u => u.name));
};

export const loginAsDemoUser = (userId: string) => {
  const userData = localStorage.getItem(`auth-storage-${userId}`);
  if (userData) {
    const parsed = JSON.parse(userData);
    localStorage.setItem('auth-storage', userData);
    console.log(`👤 ${parsed.state.user.name} olarak giriş yapıldı`);
    return parsed.state.user;
  }
  return null;
};
