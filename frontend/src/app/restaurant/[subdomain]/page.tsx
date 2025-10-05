import RestaurantMenu from './RestaurantMenu';

// Static params generation for build
export async function generateStaticParams() {
  return [
    { subdomain: 'lezzet-duragi' },
    { subdomain: 'cafe-corner' },
    { subdomain: 'bistro-34' },
    { subdomain: 'demo' },
    { subdomain: 'example' },
    { subdomain: 'test' }
  ];
}

export default function RestaurantMenuPage() {
  return <RestaurantMenu />;
}