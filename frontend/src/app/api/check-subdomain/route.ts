import { NextResponse } from 'next/server';

// Bu listeyi veritabanınızdan gelen dinamik veriyle değiştirin.
const VALID_SUBDOMAINS = [
  'lezzet-duragi',
  'cafe-corner',
  'bistro-34',
  'demo',
  'example',
  'test',
  'pizzapalace',
  'burgerking',
  'sushimaster',
  'coffeecorner',
  'steakhouse',
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subdomain = searchParams.get('subdomain');

  if (!subdomain) {
    return NextResponse.json({ isValid: false, error: 'Subdomain is required' }, { status: 400 });
  }

  // Subdomain'in geçerli olup olmadığını kontrol et
  const isValid = VALID_SUBDOMAINS.includes(subdomain.toLowerCase());

  return NextResponse.json({ isValid });
}
