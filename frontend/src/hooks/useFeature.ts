import { useAuthStore } from '@/store/useAuthStore';
import useRestaurantStore from '@/store/useRestaurantStore';

/**
 * Restaurant'a özel özellik kontrolü için hook
 * 
 * @param featureId - Kontrol edilecek özellik ID'si
 * @returns boolean - Özellik aktif mi?
 * 
 * @example
 * const hasGoogleReviews = useFeature('google_reviews');
 * 
 * return (
 *   <>
 *     {hasGoogleReviews && <GoogleReviewsWidget />}
 *   </>
 * );
 */
export function useFeature(featureId: string): boolean {
  const { authenticatedRestaurant } = useAuthStore();
  const { restaurants } = useRestaurantStore();
  
  // Önce authenticated restaurant'ı kontrol et
  if (authenticatedRestaurant) {
    return authenticatedRestaurant.features?.includes(featureId) ?? false;
  }
  
  // Authenticated yoksa subdomain'e göre restaurant bul
  if (typeof window !== 'undefined') {
    const subdomain = window.location.hostname.split('.')[0];
    const restaurant = restaurants.find(r => r.username === subdomain);
    
    if (restaurant) {
      return restaurant.features?.includes(featureId) ?? false;
    }
  }
  
  return false;
}

/**
 * Birden fazla özelliği kontrol etmek için hook
 * 
 * @param featureIds - Kontrol edilecek özellik ID'leri
 * @returns object - Her özellik için boolean değer
 * 
 * @example
 * const features = useFeatures(['google_reviews', 'online_ordering', 'loyalty_program']);
 * 
 * return (
 *   <>
 *     {features.google_reviews && <GoogleReviewsWidget />}
 *     {features.online_ordering && <OnlineOrderButton />}
 *     {features.loyalty_program && <LoyaltyPoints />}
 *   </>
 * );
 */
export function useFeatures(featureIds: string[]): Record<string, boolean> {
  const { authenticatedRestaurant } = useAuthStore();
  const { restaurants } = useRestaurantStore();
  
  // Önce authenticated restaurant'ı kontrol et
  if (authenticatedRestaurant) {
    return featureIds.reduce((acc, id) => ({
      ...acc,
      [id]: authenticatedRestaurant.features?.includes(id) ?? false
    }), {});
  }
  
  // Authenticated yoksa subdomain'e göre restaurant bul
  if (typeof window !== 'undefined') {
    const subdomain = window.location.hostname.split('.')[0];
    const restaurant = restaurants.find(r => r.username === subdomain);
    
    if (restaurant) {
      return featureIds.reduce((acc, id) => ({
        ...acc,
        [id]: restaurant.features?.includes(id) ?? false
      }), {});
    }
  }
  
  return featureIds.reduce((acc, id) => ({ ...acc, [id]: false }), {});
}

/**
 * Tüm aktif özellikleri döndüren hook
 * 
 * @returns string[] - Aktif özellik ID'leri
 * 
 * @example
 * const activeFeatures = useActiveFeatures();
 * console.log('Aktif özellikler:', activeFeatures);
 */
export function useActiveFeatures(): string[] {
  const { authenticatedRestaurant } = useAuthStore();
  const { restaurants } = useRestaurantStore();
  
  // Önce authenticated restaurant'ı kontrol et
  if (authenticatedRestaurant) {
    return authenticatedRestaurant.features ?? [];
  }
  
  // Authenticated yoksa subdomain'e göre restaurant bul
  if (typeof window !== 'undefined') {
    const subdomain = window.location.hostname.split('.')[0];
    const restaurant = restaurants.find(r => r.username === subdomain);
    
    if (restaurant) {
      return restaurant.features ?? [];
    }
  }
  
  return [];
}

/**
 * Özellik sayısını döndüren hook
 * 
 * @returns number - Aktif özellik sayısı
 */
export function useFeatureCount(): number {
  const { authenticatedRestaurant } = useAuthStore();
  const { restaurants } = useRestaurantStore();
  
  // Önce authenticated restaurant'ı kontrol et
  if (authenticatedRestaurant) {
    return authenticatedRestaurant.features?.length ?? 0;
  }
  
  // Authenticated yoksa subdomain'e göre restaurant bul
  if (typeof window !== 'undefined') {
    const subdomain = window.location.hostname.split('.')[0];
    const restaurant = restaurants.find(r => r.username === subdomain);
    
    if (restaurant) {
      return restaurant.features?.length ?? 0;
    }
  }
  
  return 0;
}
