import { useAuthStore } from '@/store/useAuthStore';
import useRestaurantStore from '@/store/useRestaurantStore';
import { useEffect, useState, useMemo } from 'react';

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
  const [remoteFeatures, setRemoteFeatures] = useState<string[] | null>(null);

  const localHas = useMemo(() => {
    if (authenticatedRestaurant) {
      return authenticatedRestaurant.features?.includes(featureId) ?? false;
    }
    if (typeof window !== 'undefined') {
      const subdomain = window.location.hostname.split('.')[0];
      const restaurant = restaurants.find(r => r.username === subdomain);
      if (restaurant) return restaurant.features?.includes(featureId) ?? false;
    }
    return false;
  }, [authenticatedRestaurant?.id, authenticatedRestaurant?.features, restaurants, featureId]);

  useEffect(() => {
    if (localHas) return; // local true ise uzak çağrıya gerek yok
    if (authenticatedRestaurant) return; // loginli ise localdan okunur
    if (typeof window === 'undefined') return;
    const subdomain = window.location.hostname.split('.')[0];
    if (!subdomain) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/restaurants/${encodeURIComponent(subdomain)}/features`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setRemoteFeatures(Array.isArray(data?.features) ? data.features : []);
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [localHas, authenticatedRestaurant?.id]);

  if (localHas) return true;
  if (remoteFeatures) return remoteFeatures.includes(featureId);
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
  const [remoteFeatures, setRemoteFeatures] = useState<string[] | null>(null);

  const local = useMemo(() => {
    if (authenticatedRestaurant) {
      return featureIds.reduce((acc, id) => ({
        ...acc,
        [id]: authenticatedRestaurant.features?.includes(id) ?? false
      }), {} as Record<string, boolean>);
    }
    if (typeof window !== 'undefined') {
      const subdomain = window.location.hostname.split('.')[0];
      const restaurant = restaurants.find(r => r.username === subdomain);
      if (restaurant) {
        return featureIds.reduce((acc, id) => ({
          ...acc,
          [id]: restaurant.features?.includes(id) ?? false
        }), {} as Record<string, boolean>);
      }
    }
    return null;
  }, [authenticatedRestaurant?.id, authenticatedRestaurant?.features, restaurants, featureIds.join('|')]);

  useEffect(() => {
    if (local) return;
    if (authenticatedRestaurant) return;
    if (typeof window === 'undefined') return;
    const subdomain = window.location.hostname.split('.')[0];
    if (!subdomain) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/restaurants/${encodeURIComponent(subdomain)}/features`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setRemoteFeatures(Array.isArray(data?.features) ? data.features : []);
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [local, authenticatedRestaurant?.id, featureIds.join('|')]);

  if (local) return local;
  if (remoteFeatures) {
    return featureIds.reduce((acc, id) => ({ ...acc, [id]: remoteFeatures.includes(id) }), {} as Record<string, boolean>);
  }
  return featureIds.reduce((acc, id) => ({ ...acc, [id]: false }), {} as Record<string, boolean>);
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
  const [remoteFeatures, setRemoteFeatures] = useState<string[] | null>(null);

  const local = useMemo(() => {
    if (authenticatedRestaurant) return authenticatedRestaurant.features ?? [];
    if (typeof window !== 'undefined') {
      const subdomain = window.location.hostname.split('.')[0];
      const restaurant = restaurants.find(r => r.username === subdomain);
      if (restaurant) return restaurant.features ?? [];
    }
    return null;
  }, [authenticatedRestaurant?.id, authenticatedRestaurant?.features, restaurants]);

  useEffect(() => {
    if (local) return;
    if (authenticatedRestaurant) return;
    if (typeof window === 'undefined') return;
    const subdomain = window.location.hostname.split('.')[0];
    if (!subdomain) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/restaurants/${encodeURIComponent(subdomain)}/features`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setRemoteFeatures(Array.isArray(data?.features) ? data.features : []);
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [local, authenticatedRestaurant?.id]);

  return local ?? remoteFeatures ?? [];
}

/**
 * Özellik sayısını döndüren hook
 * 
 * @returns number - Aktif özellik sayısı
 */
export function useFeatureCount(): number {
  const local = useActiveFeatures();
  return local.length;
}
