import { Suspense } from 'react';
import EditRestaurantForm from './EditRestaurantForm';

export default function EditRestaurantPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Yükleniyor...</div>}>
      <EditRestaurantForm />
    </Suspense>
  );
}
