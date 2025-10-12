'use client';

import Link from 'next/link';
import { FaBell, FaUtensils, FaDollarSign, FaBuilding, FaArrowLeft, FaCheckCircle, FaUsers, FaChartLine, FaClock, FaShieldAlt } from 'react-icons/fa';
import { LanguageProvider } from '@/context/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import TranslatedText from '@/components/TranslatedText';

export default function PanelsPage() {
  return (
    <LanguageProvider>
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center text-orange-600 hover:text-orange-700 transition-colors">
                <FaArrowLeft className="mr-2" />
                <span className="font-semibold">Ana Sayfaya Dön</span>
              </Link>
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">MasApp Panelleri</h1>
                <p className="text-gray-600 mt-1">Restoran operasyonlarınızı yönetin</p>
              </div>
              <LanguageSelector />
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <TranslatedText>Restoran Yönetim Panelleri</TranslatedText>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              <TranslatedText>MasApp ile restoranınızın tüm operasyonlarını tek platformdan yönetin. 
              Her departman için özel tasarlanmış paneller ile verimliliğinizi artırın.</TranslatedText>
            </p>
          </div>
        </section>

        {/* Panels Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              
              {/* Garson Paneli */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="bg-white/20 p-4 rounded-xl mr-6">
                    <FaBell className="text-4xl text-yellow-300" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Garson Paneli</h3>
                    <p className="text-blue-100">Siparişleri yönet ve müşteri çağrılarını gör</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-300 mr-3" />
                    <span>Gerçek zamanlı sipariş takibi</span>
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-300 mr-3" />
                    <span>Müşteri çağrı bildirimleri</span>
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-300 mr-3" />
                    <span>Sipariş durumu güncelleme</span>
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-300 mr-3" />
                    <span>Masa yönetimi</span>
                  </li>
                </ul>
                <Link href="/business/waiter" className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors inline-block">
                  Paneli Görüntüle
                </Link>
              </div>

              {/* Mutfak Paneli */}
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="bg-white/20 p-4 rounded-xl mr-6">
                    <FaUtensils className="text-4xl text-yellow-300" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Mutfak Paneli</h3>
                    <p className="text-orange-100">Siparişleri hazırla ve durumları güncelle</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-300 mr-3" />
                    <span>Sipariş kuyruğu yönetimi</span>
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-300 mr-3" />
                    <span>Hazırlık süresi takibi</span>
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-300 mr-3" />
                    <span>Stok uyarıları</span>
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-300 mr-3" />
                    <span>Otomatik bildirimler</span>
                  </li>
                </ul>
                <Link href="/business/kitchen" className="bg-white text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-orange-50 transition-colors inline-block">
                  Paneli Görüntüle
                </Link>
              </div>

              {/* Kasa Paneli */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="bg-white/20 p-4 rounded-xl mr-6">
                    <FaDollarSign className="text-4xl text-yellow-300" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Kasa Paneli</h3>
                    <p className="text-green-100">Ödemeleri al ve kasa işlemlerini yönet</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-300 mr-3" />
                    <span>Hesap ödeme işlemleri</span>
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-300 mr-3" />
                    <span>Fatura ve makbuz yazdırma</span>
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-300 mr-3" />
                    <span>Günlük kasa raporları</span>
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-300 mr-3" />
                    <span>Ödeme yöntemi analizi</span>
                  </li>
                </ul>
                <Link href="/business/payment" className="bg-white text-green-600 px-6 py-3 rounded-xl font-bold hover:bg-green-50 transition-colors inline-block">
                  Paneli Görüntüle
                </Link>
              </div>

              {/* İşletme Paneli */}
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="bg-white/20 p-4 rounded-xl mr-6">
                    <FaBuilding className="text-4xl text-yellow-300" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">İşletme Paneli</h3>
                    <p className="text-purple-100">Restoranı yönet ve istatistikleri gör</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-300 mr-3" />
                    <span>Detaylı satış analizleri</span>
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-300 mr-3" />
                    <span>Menü yönetimi</span>
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-300 mr-3" />
                    <span>Personel performans takibi</span>
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-300 mr-3" />
                    <span>Müşteri analitikleri</span>
                  </li>
                </ul>
                <Link href="/business/dashboard" className="bg-white text-purple-600 px-6 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors inline-block">
                  Paneli Görüntüle
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
              <TranslatedText>Neden MasApp Panelleri?</TranslatedText>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              
              <div className="text-center">
                <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaUsers className="text-3xl text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  <TranslatedText>Çoklu Kullanıcı Desteği</TranslatedText>
                </h3>
                <p className="text-gray-600">
                  <TranslatedText>Her departman için ayrı yetki seviyeleri ile güvenli çoklu kullanıcı yönetimi</TranslatedText>
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaChartLine className="text-3xl text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  <TranslatedText>Gerçek Zamanlı Analitik</TranslatedText>
                </h3>
                <p className="text-gray-600">
                  <TranslatedText>Canlı veriler ile anlık kararlar alın ve performansınızı artırın</TranslatedText>
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaShieldAlt className="text-3xl text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  <TranslatedText>Güvenli ve Stabil</TranslatedText>
                </h3>
                <p className="text-gray-600">
                  <TranslatedText>SSL şifreleme ve 99.9% uptime garantisi ile güvenli operasyon</TranslatedText>
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">
              <TranslatedText>Hemen Başlayın!</TranslatedText>
            </h2>
            <p className="text-xl mb-8 text-orange-50 max-w-2xl mx-auto">
              <TranslatedText>MasApp panellerini 14 gün ücretsiz deneyin ve restoranınızın verimliliğini artırın.</TranslatedText>
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link href="#pricing" className="bg-white text-orange-600 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-orange-50 transition-colors">
                <TranslatedText>Ücretsiz Deneme Başlat</TranslatedText>
              </Link>
              <a href="tel:+905393222797" className="bg-orange-700 hover:bg-orange-800 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-colors">
                <TranslatedText>Hemen Arayın</TranslatedText>
              </a>
            </div>
          </div>
        </section>

      </main>
    </LanguageProvider>
  );
}
