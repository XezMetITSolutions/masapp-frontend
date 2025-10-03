export async function generateStaticParams() {
  return [
    { subdomain: 'demo' },
    { subdomain: 'test' },
    { subdomain: 'example' }
  ];
}

export default function RestaurantPage({ params }: { params: { subdomain: string } }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Restaurant</h1>
        <p className="text-gray-600">Subdomain: {params.subdomain}</p>
      </div>
    </div>
  );
}