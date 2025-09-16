"use client";
import Link from "next/link";
import { FaCreditCard } from "react-icons/fa";

export default function DemoPaymentPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-blue-600">Demo Ödeme</h1>
        <p className="mb-6 text-gray-700">Bu bir demo ödeme ekranıdır. Gerçek bir ödeme işlemi yapılmayacaktır.</p>
        <div className="mb-6">
          <input type="text" placeholder="Kart Numarası" className="w-full mb-3 p-2 border rounded" disabled value="4242 4242 4242 4242" />
          <div className="flex gap-2 mb-3">
            <input type="text" placeholder="AA/YY" className="w-1/2 p-2 border rounded" disabled value="12/34" />
            <input type="text" placeholder="CVC" className="w-1/2 p-2 border rounded" disabled value="123" />
          </div>
        </div>
        <button className="btn bg-primary hover:bg-primary/90 text-white w-full flex items-center justify-center gap-2 py-2 text-lg mb-2" disabled>
          <FaCreditCard />
          Ödeme Yap (Demo)
        </button>
        <Link href="/demo/cart" className="block mt-4 text-blue-500 hover:underline">Geri Dön</Link>
      </div>
    </main>
  );
}
