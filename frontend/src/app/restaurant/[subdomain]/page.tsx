import subdomains from '@/data/subdomains.json';
import { LanguageProvider } from '@/context/LanguageContext';
import { MenuPageContent } from '@/app/menu/page';

// Static params generation for build
export async function generateStaticParams() {
  return subdomains.map((subdomain) => ({ subdomain }));
}

export default function RestaurantMenuPage() {
  // Modern menü tasarimını kullan
  return (
    <LanguageProvider>
      <MenuPageContent />
    </LanguageProvider>
  );
}