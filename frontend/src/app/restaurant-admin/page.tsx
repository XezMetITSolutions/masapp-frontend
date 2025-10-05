import { Suspense } from 'react';
import RestaurantAdminContent from './RestaurantAdminContent';

export default function RestaurantAdminPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Yükleniyor...</div>}>
      <RestaurantAdminContent />
    </Suspense>
  );
}
