import { useEffect } from 'react';
import { useBusinessSettingsStore } from '@/store/useBusinessSettingsStore';

// Her restoran için kendi settings'ini yükle/kaydet
export function useRestaurantSettings(restaurantId: string | undefined) {
  const store = useBusinessSettingsStore();
  
  useEffect(() => {
    if (!restaurantId) return;
    
    // Restaurant ID'ye göre localStorage'dan settings yükle
    const storageKey = `business-settings-${restaurantId}`;
    const savedSettings = localStorage.getItem(storageKey);
    
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.state) {
          // Sadece settings, branding gibi önemli verileri yükle
          if (parsed.state.settings) {
            Object.keys(parsed.state.settings).forEach(key => {
              const settingsKey = key as keyof typeof parsed.state.settings;
              const value = parsed.state.settings[settingsKey];
              
              // Her settings kategorisini güncelle
              if (settingsKey === 'basicInfo' && store.updateBasicInfo) {
                store.updateBasicInfo(value);
              } else if (settingsKey === 'branding' && store.updateBranding) {
                store.updateBranding(value);
              } else if (settingsKey === 'menuSettings' && store.updateMenuSettings) {
                store.updateMenuSettings(value);
              } else if (settingsKey === 'paymentSettings' && store.updatePaymentSettings) {
                store.updatePaymentSettings(value);
              } else if (settingsKey === 'technicalSettings' && store.updateTechnicalSettings) {
                store.updateTechnicalSettings(value);
              } else if (settingsKey === 'customerExperience' && store.updateCustomerExperience) {
                store.updateCustomerExperience(value);
              } else if (settingsKey === 'notificationSettings' && store.updateNotificationSettings) {
                store.updateNotificationSettings(value);
              } else if (settingsKey === 'securitySettings' && store.updateSecuritySettings) {
                store.updateSecuritySettings(value);
              } else if (settingsKey === 'backupSettings' && store.updateBackupSettings) {
                store.updateBackupSettings(value);
              }
            });
          }
        }
      } catch (error) {
        console.error('Failed to load restaurant settings:', error);
      }
    }
  }, [restaurantId]);
  
  // Settings değiştiğinde restaurant-specific localStorage'a kaydet
  useEffect(() => {
    if (!restaurantId) return;
    
    const storageKey = `business-settings-${restaurantId}`;
    const dataToSave = {
      state: {
        settings: store.settings,
        accountInfo: store.accountInfo,
        stats: store.stats
      },
      version: 0
    };
    
    localStorage.setItem(storageKey, JSON.stringify(dataToSave));
  }, [restaurantId, store.settings, store.accountInfo, store.stats]);
  
  return store;
}
