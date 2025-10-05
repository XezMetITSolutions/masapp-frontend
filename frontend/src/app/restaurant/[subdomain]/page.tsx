import { redirect } from 'next/navigation';
import subdomains from '@/data/subdomains.json';

// Static params generation for build
export async function generateStaticParams() {
  return subdomains.map((subdomain) => ({ subdomain }));
}

export default function RestaurantMenuPage() {
  // Modern menü sayfasına yönlendir
  redirect('/menu');
}