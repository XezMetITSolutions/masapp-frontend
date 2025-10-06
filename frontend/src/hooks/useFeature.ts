import { useAuthStore } from '@/store/useAuthStore';

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
  
  if (!authenticatedRestaurant) {
    return false;
  }
  
  // Restaurant'ın features array'inde bu özellik var mı?
  return authenticatedRestaurant.features?.includes(featureId) ?? false;
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
  
  if (!authenticatedRestaurant) {
    return featureIds.reduce((acc, id) => ({ ...acc, [id]: false }), {});
  }
  
  return featureIds.reduce((acc, id) => ({
    ...acc,
    [id]: authenticatedRestaurant.features?.includes(id) ?? false
  }), {});
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
  return authenticatedRestaurant?.features ?? [];
}

/**
 * Özellik sayısını döndüren hook
 * 
 * @returns number - Aktif özellik sayısı
 */
export function useFeatureCount(): number {
  const { authenticatedRestaurant } = useAuthStore();
  return authenticatedRestaurant?.features?.length ?? 0;
}
