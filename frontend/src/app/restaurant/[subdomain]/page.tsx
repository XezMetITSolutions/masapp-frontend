import RestaurantMenu from './RestaurantMenu';

import subdomains from '@/data/subdomains.json';

// Static params generation for build
export async function generateStaticParams() {
  return subdomains.map((subdomain) => ({ subdomain }));
}

export default function RestaurantMenuPage() {
  return <RestaurantMenu />;
}