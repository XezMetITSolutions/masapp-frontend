'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import subdomains from '@/data/subdomains.json';

// Static params generation for build
export async function generateStaticParams() {
  return subdomains.map((subdomain) => ({ subdomain }));
}

export default function RestaurantMenuPage() {
  const router = useRouter();

  useEffect(() => {
    // Modern menü sayfasına yönlendir
    router.replace('/menu');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}