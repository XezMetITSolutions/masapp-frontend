'use client';

import Link from 'next/link';
import { FaQrcode, FaUtensils, FaShoppingCart, FaBell, FaMagic, FaChartLine, FaUsers, FaClock, FaCheckCircle, FaRocket, FaShieldAlt, FaStar, FaPhone, FaWhatsapp } from 'react-icons/fa';
import { LanguageProvider } from '@/context/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import TranslatedText from '@/components/TranslatedText';
import PriceDisplay from '@/components/PriceDisplay';

export default function Home() {
  return (
    <LanguageProvider>
      <main className="min-h-screen bg-white relative">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center px-6 py-3 bg-white/20 rounded-full shadow-lg mb-6 text-lg font-semibold backdrop-blur-md border border-white/30">
            <FaStar className="text-yellow-200 mr-3" /> 
            <TranslatedText>120+ Restoran Güveniyor</TranslatedText>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            <TranslatedText>Restoranınız</TranslatedText> <span className="text-white"><TranslatedText>Dijital Çağa</TranslatedText></span><br/><TranslatedText>Hazır mı?</TranslatedText>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-orange-50 leading-relaxed max-w-4xl mx-auto font-medium">
            🚀 <TranslatedText>Türkiye'nin en gelişmiş QR menü ve sipariş yönetim sistemi ile</TranslatedText> <br/>
            <span className="text-white font-bold"><TranslatedText>satışlarınızı %300 artırın!</TranslatedText></span> <TranslatedText>Rakiplerinizi geride bırakın.</TranslatedText>
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 max-w-2xl mx-auto">
            <a href="tel:+905393222797" className="bg-white text-orange-600 px-8 py-4 rounded-2xl text-lg font-black flex items-center justify-center gap-3 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105">
              <FaPhone className="text-xl" /> <TranslatedText>Hemen Bizi Arayın</TranslatedText>
            </a>
            <Link href="#pricing" className="bg-orange-700 hover:bg-orange-800 text-white px-8 py-4 rounded-2xl text-lg font-black transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105">
              <FaRocket className="inline mr-3 text-xl" /> <TranslatedText>14 Gün Ücretsiz Deneyin</TranslatedText>
            </Link>
          </div>
        </div>
      </section>

      

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-blue-900 mb-6 text-center"><TranslatedText>Hizmetlerimiz</TranslatedText></h2>
          <p className="text-2xl text-blue-700 max-w-4xl mx-auto mb-16 text-center">
            <TranslatedText>Restoranınızı dijital dünyaya taşıyacak kapsamlı çözümlerimizi keşfedin.</TranslatedText>
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <div className="bg-white p-8 rounded-3xl shadow-xl text-center border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 transform hover:scale-105">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaQrcode className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-4 text-center"><TranslatedText>QR Menü Sistemi</TranslatedText></h3>
              <p className="text-blue-700 mb-4 text-center"><TranslatedText>Temassız menü deneyimi</TranslatedText></p>
              <ul className="text-left space-y-2 text-sm text-blue-600">
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> <TranslatedText>Anlık menü güncelleme</TranslatedText></li>
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> <TranslatedText>Çoklu dil desteği</TranslatedText></li>
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> <TranslatedText>Mobil uyumlu tasarım</TranslatedText></li>
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> <TranslatedText>Hijyen güvencesi</TranslatedText></li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl text-center border-2 border-emerald-200 hover:border-emerald-400 transition-all duration-300 transform hover:scale-105">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaShoppingCart className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-900 mb-4 text-center"><TranslatedText>Akıllı Sipariş Yönetimi</TranslatedText></h3>
              <p className="text-emerald-700 mb-4 text-center"><TranslatedText>Otomatik sipariş akışı</TranslatedText></p>
              <ul className="text-left space-y-2 text-sm text-emerald-600">
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> <TranslatedText>Gerçek zamanlı takip</TranslatedText></li>
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> <TranslatedText>Öncelik sıralaması</TranslatedText></li>
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> <TranslatedText>Otomatik bildirimler</TranslatedText></li>
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> <TranslatedText>Hata önleme</TranslatedText></li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl text-center border-2 border-violet-200 hover:border-violet-400 transition-all duration-300 transform hover:scale-105">
              <div className="bg-gradient-to-r from-violet-500 to-purple-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaChartLine className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-violet-900 mb-4 text-center"><TranslatedText>Analitik & Raporlama</TranslatedText></h3>
              <p className="text-violet-700 mb-4 text-center"><TranslatedText>Detaylı iş zekası</TranslatedText></p>
              <ul className="text-left space-y-2 text-sm text-violet-600">
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> <TranslatedText>Satış analizleri</TranslatedText></li>
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> <TranslatedText>Müşteri davranışları</TranslatedText></li>
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> <TranslatedText>Performans metrikleri</TranslatedText></li>
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> <TranslatedText>Kar marjı analizi</TranslatedText></li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl text-center border-2 border-amber-200 hover:border-amber-400 transition-all duration-300 transform hover:scale-105">
              <div className="bg-gradient-to-r from-amber-500 to-yellow-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaMagic className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-amber-900 mb-4 text-center"><TranslatedText>AI Menü Optimizasyonu</TranslatedText></h3>
              <p className="text-amber-700 mb-4 text-center"><TranslatedText>Yapay zeka destekli öneriler</TranslatedText></p>
              <ul className="text-left space-y-2 text-sm text-amber-600">
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> <TranslatedText>Fiyat optimizasyonu</TranslatedText></li>
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> <TranslatedText>Popüler ürün analizi</TranslatedText></li>
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> <TranslatedText>Stok yönetimi</TranslatedText></li>
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> <TranslatedText>Trend tahminleri</TranslatedText></li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl text-center border-2 border-rose-200 hover:border-rose-400 transition-all duration-300 transform hover:scale-105">
              <div className="bg-gradient-to-r from-rose-500 to-pink-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaShieldAlt className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-rose-900 mb-4 text-center"><TranslatedText>Güvenli Ödeme Sistemi</TranslatedText></h3>
              <p className="text-rose-700 mb-4 text-center"><TranslatedText>PCI DSS uyumlu güvenlik</TranslatedText></p>
              <ul className="text-left space-y-2 text-sm text-rose-600">
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> <TranslatedText>Kredi kartı güvenliği</TranslatedText></li>
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> <TranslatedText>SSL şifreleme</TranslatedText></li>
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> <TranslatedText>Fraud koruması</TranslatedText></li>
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> <TranslatedText>Güvenli API</TranslatedText></li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl text-center border-2 border-slate-200 hover:border-slate-400 transition-all duration-300 transform hover:scale-105">
              <div className="bg-gradient-to-r from-slate-500 to-gray-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaUsers className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center"><TranslatedText>Çoklu Panel Yönetimi</TranslatedText></h3>
              <p className="text-slate-700 mb-4 text-center"><TranslatedText>Entegre işletme sistemi</TranslatedText></p>
              <ul className="text-left space-y-2 text-sm text-slate-600">
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> <TranslatedText>Mutfak paneli</TranslatedText></li>
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> <TranslatedText>Garson paneli</TranslatedText></li>
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> <TranslatedText>Kasa paneli</TranslatedText></li>
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> <TranslatedText>Yönetim paneli</TranslatedText></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-indigo-900 mb-6 text-center"><TranslatedText>MasApp ile Kazançlarınız</TranslatedText></h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="bg-red-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaChartLine className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4"><TranslatedText>%95 Daha Az Hata</TranslatedText></h3>
              <p className="text-gray-600"><TranslatedText>Sistemsel yaklaşım ile insan hatalarını ortadan kaldırın</TranslatedText></p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaRocket className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4"><TranslatedText>%300 Verimlilik Artışı</TranslatedText></h3>
              <p className="text-gray-600"><TranslatedText>Otomatik süreçler ile zaman ve kaynak tasarrufu</TranslatedText></p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaUsers className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4"><TranslatedText>Müşteri Memnuniyeti</TranslatedText></h3>
              <p className="text-gray-600"><TranslatedText>Daha hızlı servis, doğru siparişler, daha iyi deneyim</TranslatedText></p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6"><TranslatedText>Canlı Demo İnceleyin</TranslatedText></h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            <TranslatedText>MasApp'in nasıl çalıştığını görmek için demo menümüzü inceleyin. Gerçek restoran deneyimini yaşayın!</TranslatedText>
          </p>
          <Link href="/demo/menu" className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg">
            <FaUtensils className="inline mr-2" />
            <TranslatedText>Demo Menüyü İncele</TranslatedText>
            </Link>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6"><TranslatedText>Fiyatlandırma</TranslatedText></h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              <TranslatedText>14 gün ücretsiz deneme, 30 gün iade garantisi ve uzun süreli paketlerde büyük indirimler!</TranslatedText>
            </p>
            <div className="inline-flex items-center bg-green-100 text-green-800 px-6 py-3 rounded-full font-semibold">
              <FaRocket className="mr-2" />
              <TranslatedText>Yıllık planlar %20 daha avantajlı!</TranslatedText>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Premium Paket - En Popüler */}
            <div className="bg-white rounded-3xl shadow-2xl border-2 border-orange-400 p-10 text-center relative transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full text-lg font-bold shadow-lg">
                  🔥 EN POPÜLER
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6 mt-4"><TranslatedText>Premium Paket</TranslatedText></h3>
              <div className="mb-8">
                <div className="text-5xl font-black text-orange-600 mb-4">
                  <PriceDisplay turkishLira={4980} showPerMonth={true} />
                </div>
                <div className="space-y-3">
                  <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-base font-bold inline-block">
                    6 Ay: <PriceDisplay turkishLira={24900} /> (<TranslatedText>%17 İndirim</TranslatedText>)
                  </div>
                  <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-base font-bold inline-block ml-2">
                    <TranslatedText>Yıllık:</TranslatedText> <PriceDisplay turkishLira={47900} /> (<TranslatedText>%20 İndirim</TranslatedText>)
                  </div>
                </div>
              </div>
              <ul className="text-left space-y-4 mb-10 text-base">
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-3 text-lg" /> <TranslatedText>QR Menü & Sipariş Sistemi</TranslatedText></li>
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-3 text-lg" /> <TranslatedText>AI Menü Optimizasyonu</TranslatedText></li>
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-3 text-lg" /> <TranslatedText>Tüm Panel Erişimi</TranslatedText></li>
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-3 text-lg" /> <TranslatedText>Gelişmiş Analitik</TranslatedText></li>
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-3 text-lg" /> <TranslatedText>Öncelikli Destek</TranslatedText></li>
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-3 text-lg" /> <TranslatedText>Ücretsiz Kurulum</TranslatedText></li>
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-3 text-lg" /> <TranslatedText>SSL Güvenlik</TranslatedText></li>
              </ul>
              <a href="https://wa.me/905393222797?text=Premium%20paket%20hakkında%20bilgi%20almak%20istiyorum" target="_blank" className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-2xl text-xl font-bold hover:from-orange-600 hover:to-red-600 transition-colors inline-block shadow-xl">
                <TranslatedText>Premium Paketi Seç</TranslatedText>
              </a>
            </div>

            {/* Kurumsal Paket */}
            <div className="bg-white rounded-3xl shadow-xl border-2 border-purple-300 p-10 text-center relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  🏢 KURUMSAL
                </span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6 mt-4"><TranslatedText>Kurumsal Paket</TranslatedText></h3>
              <p className="text-lg text-purple-600 mb-6 font-semibold"><TranslatedText>Büyük işletmeler ve zincirler için</TranslatedText></p>
              <div className="mb-8">
                <div className="text-5xl font-black text-purple-600 mb-4">
                  <PriceDisplay turkishLira={9980} showPerMonth={true} />
                </div>
                <div className="space-y-3">
                  <div className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-base font-bold inline-block">
                    6 Ay: <PriceDisplay turkishLira={49900} /> (<TranslatedText>%17 İndirim</TranslatedText>)
                  </div>
                  <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-base font-bold inline-block ml-2">
                    <TranslatedText>Yıllık:</TranslatedText> <PriceDisplay turkishLira={95900} /> (<TranslatedText>%20 İndirim</TranslatedText>)
                  </div>
                </div>
              </div>
              <ul className="text-left space-y-4 mb-10 text-base">
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-3 text-lg" /> <TranslatedText>Özel Menü & Logo Entegrasyonu</TranslatedText></li>
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-3 text-lg" /> <TranslatedText>Sınırsız Kullanıcı (Tüm Paneller)</TranslatedText></li>
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-3 text-lg" /> <TranslatedText>Çoklu Şube Yönetimi</TranslatedText></li>
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-3 text-lg" /> <TranslatedText>API Entegrasyonları</TranslatedText></li>
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-3 text-lg" /> <TranslatedText>7/24 Telefon Desteği</TranslatedText></li>
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-3 text-lg" /> <TranslatedText>Beyaz Etiket Çözümü</TranslatedText></li>
                <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-3 text-lg" /> <TranslatedText>Özel Eğitim & Kurulum</TranslatedText></li>
              </ul>
              <a href="https://wa.me/905393222797?text=Kurumsal%20paket%20hakkında%20bilgi%20almak%20istiyorum" target="_blank" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl text-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-colors inline-block shadow-xl">
                <TranslatedText>Kurumsal Çözüm Al</TranslatedText>
              </a>
            </div>
          </div>
          
          {/* Güven Unsurları */}
          <div className="mt-16 text-center">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="flex flex-col items-center">
                <FaRocket className="text-3xl text-green-500 mb-2" />
                <p className="font-semibold text-gray-900"><TranslatedText>14 Gün Ücretsiz</TranslatedText></p>
                <p className="text-sm text-gray-600"><TranslatedText>Deneme Süresi</TranslatedText></p>
          </div>
              <div className="flex flex-col items-center">
                <FaShieldAlt className="text-3xl text-blue-500 mb-2" />
                <p className="font-semibold text-gray-900"><TranslatedText>30 Gün İade</TranslatedText></p>
                <p className="text-sm text-gray-600"><TranslatedText>Garantisi</TranslatedText></p>
        </div>
              <div className="flex flex-col items-center">
                <FaCheckCircle className="text-3xl text-purple-500 mb-2" />
                <p className="font-semibold text-gray-900"><TranslatedText>SSL Güvenlik</TranslatedText></p>
                <p className="text-sm text-gray-600"><TranslatedText>Sertifikası</TranslatedText></p>
          </div>
              <div className="flex flex-col items-center">
                <FaUsers className="text-3xl text-orange-500 mb-2" />
                <p className="font-semibold text-gray-900"><TranslatedText>Ücretsiz Kurulum</TranslatedText></p>
                <p className="text-sm text-gray-600"><TranslatedText>6+ Ay Planlar</TranslatedText></p>
            </div>
            </div>
            <p className="text-sm text-gray-500 mt-6 max-w-2xl mx-auto">
              * <TranslatedText>Kurulum yapıldıktan sonra iptal durumunda sadece kurulum ücreti alınır. Tüm planlar SSL güvenlik sertifikası ile korunmaktadır.</TranslatedText>
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center"><TranslatedText>Müşterilerimiz Ne Diyor?</TranslatedText></h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            <TranslatedText>120+ restoran MasApp ile operasyonlarını dijitalleştirdi ve müşteri memnuniyetini artırdı.</TranslatedText>
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">
                <TranslatedText>"MasApp sayesinde siparişlerdeki hatalar %90 azaldı. Müşterilerimiz artık daha hızlı servis alıyor ve memnuniyet oranımız arttı."</TranslatedText>
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  AK
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Ahmet Kaya</p>
                  <p className="text-sm text-gray-500">Lezzet Durağı - İstanbul</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">
                <TranslatedText>"QR menü sistemi müşterilerimizin çok hoşuna gitti. Özellikle pandemi sonrası temassız hizmet çok önemli oldu."</TranslatedText>
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  MÖ
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Mehmet Özkan</p>
                  <p className="text-sm text-gray-500">Cafe Corner - Ankara</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">
                <TranslatedText>"AI menü optimizasyonu harika! Ürün fotoğraflarımız artık çok daha profesyonel görünüyor. Satışlarımız %25 arttı."</TranslatedText>
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  SY
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Selin Yılmaz</p>
                  <p className="text-sm text-gray-500">Bistro 34 - İzmir</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 text-center"><TranslatedText>Sıkça Sorulan Sorular</TranslatedText></h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            <TranslatedText>MasApp hakkında merak ettiklerinizin cevapları burada. Başka sorularınız için bize ulaşın!</TranslatedText>
          </p>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-orange-500">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <FaQrcode className="text-orange-500 mr-3" />
                  <TranslatedText>MasApp nedir?</TranslatedText>
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  <TranslatedText>MasApp, menüden siparişe, personelden muhasebeye kadar tüm operasyonu tek platformda yöneten restoran işletim sistemidir. AI ile görsellerinizi profesyonelleştirir, menüyü optimize eder ve satışları artırır; POS ve muhasebe sistemlerinizle sorunsuz entegre olur.</TranslatedText>
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-blue-500">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <FaRocket className="text-blue-500 mr-3" />
                  <TranslatedText>Kurulum süreci nasıl işliyor?</TranslatedText>
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  <TranslatedText>6 ay ve üzeri planlar için kurulum tamamen ücretsizdir. Uzman teknik ekibimiz restoranınıza gelir, sistemi kurar ve tüm personellerinizi eğitir. Kurulum süreci 1-2 gün sürer ve hemen kullanmaya başlayabilirsiniz.</TranslatedText>
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-green-500">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <FaShieldAlt className="text-green-500 mr-3" />
                  <TranslatedText>İade garantisi nasıl çalışır?</TranslatedText>
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  <TranslatedText>30 gün içinde herhangi bir sebeple memnun kalmazsanız, ücretinizi tam olarak iade ediyoruz. Kurulum yapılmış ise sadece kurulum maliyeti kesilerek kalan tutar iade edilir. Risk almadan deneyin!</TranslatedText>
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-purple-500">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <FaShoppingCart className="text-purple-500 mr-3" />
                  <TranslatedText>Hangi ödeme yöntemlerini kabul ediyorsunuz?</TranslatedText>
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  <TranslatedText>Kredi kartı, banka kartı, havale/EFT ve tüm mobil ödeme seçeneklerini kabul ediyoruz. 6 aylık ve yıllık ödemeler için büyük indirimler sunuyoruz. Taksit seçenekleri de mevcuttur.</TranslatedText>
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-red-500">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <FaPhone className="text-red-500 mr-3" />
                  <TranslatedText>Teknik destek sağlıyor musunuz?</TranslatedText>
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  <TranslatedText>Elbette! Premium pakette WhatsApp ve öncelikli destek, Kurumsal pakette 7/24 telefon desteği sunuyoruz. Ayrıca tüm müşterilerimiz için online eğitim videoları ve dokümantasyon sağlıyoruz.</TranslatedText>
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-yellow-500">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <FaClock className="text-yellow-500 mr-3" />
                  <TranslatedText>Sistemi öğrenmek ne kadar sürer?</TranslatedText>
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  <TranslatedText>MasApp çok kullanıcı dostu tasarlandı. Personelleriniz 1-2 saatte sistemi öğrenebilir. Kurulum sırasında detaylı eğitim veriyoruz ve sürekli destek sağlıyoruz.</TranslatedText>
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-indigo-500">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <FaUtensils className="text-indigo-500 mr-3" />
                  <TranslatedText>Mevcut POS sistemimle uyumlu mu?</TranslatedText>
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  <TranslatedText>MasApp bağımsız çalışır ancak mevcut POS sistemlerinizle entegre edilebilir. Kurumsal pakette API entegrasyonları ile tüm sistemlerinizi birbirine bağlayabilirsiniz.</TranslatedText>
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-pink-500">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <FaChartLine className="text-pink-500 mr-3" />
                  <TranslatedText>Raporlama özellikleri neler?</TranslatedText>
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  <TranslatedText>Günlük/haftalık/aylık satış raporları, en çok satan ürünler, masa verimliliği, personel performansı ve müşteri analitikleri gibi detaylı raporlar alabilirsiniz.</TranslatedText>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl font-bold mb-8"><TranslatedText>Hemen Başlayın!</TranslatedText></h2>
          <p className="text-2xl mb-12 text-orange-50 max-w-3xl mx-auto font-medium">
            🚀 <TranslatedText>Restoranınızı bugün dijital dünyaya taşıyın!</TranslatedText> <br/>
            <span className="text-white font-bold"><TranslatedText>14 gün ücretsiz deneme</TranslatedText></span> <TranslatedText>ile risk almadan başlayın.</TranslatedText>
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-10">
            <a href="tel:+905393222797" className="bg-white text-orange-600 px-10 py-5 rounded-2xl text-xl font-black flex items-center justify-center gap-3 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105">
              <FaPhone className="text-2xl" /> <TranslatedText>Hemen Bizi Arayın</TranslatedText>
            </a>
            <Link href="#pricing" className="bg-orange-700 hover:bg-orange-800 text-white px-10 py-5 rounded-2xl text-xl font-black transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105">
              <FaRocket className="inline mr-3 text-2xl" /> <TranslatedText>14 Gün Ücretsiz Deneyin</TranslatedText>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-gray-800 py-20 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 bg-orange-500 rounded-xl flex items-center justify-center text-white mr-4">
              <FaUtensils size={20} />
                </div>
                <h3 className="text-3xl font-bold text-gray-800">MasApp</h3>
              </div>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Türkiye'nin en gelişmiş QR menü ve restoran yönetim sistemi. 
                120+ restoranın güvendiği çözümle satışlarınızı artırın.
              </p>
              <div className="flex space-x-4">
                <a href="tel:+905393222797" className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-all duration-300 flex items-center gap-2">
                  <FaPhone /> Hemen Arayın
                </a>
                <a href="https://wa.me/905393222797" target="_blank" className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-all duration-300 flex items-center gap-2">
                  <FaWhatsapp /> WhatsApp
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-6 text-gray-800"><TranslatedText>Hizmetlerimiz</TranslatedText></h4>
              <ul className="space-y-3">
                <li className="text-gray-600 flex items-center gap-2"><FaQrcode className="text-orange-500" /> <TranslatedText>QR Menü Sistemi</TranslatedText></li>
                <li className="text-gray-600 flex items-center gap-2"><FaShoppingCart className="text-orange-500" /> <TranslatedText>Akıllı Sipariş Yönetimi</TranslatedText></li>
                <li className="text-gray-600 flex items-center gap-2"><FaChartLine className="text-orange-500" /> <TranslatedText>Analitik & Raporlama</TranslatedText></li>
                <li className="text-gray-600 flex items-center gap-2"><FaMagic className="text-orange-500" /> <TranslatedText>AI Menü Optimizasyonu</TranslatedText></li>
                <li className="text-gray-600 flex items-center gap-2"><FaShieldAlt className="text-orange-500" /> <TranslatedText>Güvenli Ödeme Sistemi</TranslatedText></li>
                <li className="text-gray-600 flex items-center gap-2"><FaUsers className="text-orange-500" /> <TranslatedText>Çoklu Panel Yönetimi</TranslatedText></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-600 mb-4 md:mb-0">
                <p><TranslatedText>© 2025 MasApp. Tüm hakları saklıdır.</TranslatedText></p>
                <p className="text-sm mt-1"><TranslatedText>Türkiye'nin öncü restoran dijitalleştirme platformu</TranslatedText></p>
              </div>
              <div className="flex items-center space-x-6">
                <span className="text-gray-600 flex items-center gap-2">
                  <FaShieldAlt className="text-orange-500" />
                  <TranslatedText>SSL Güvenli</TranslatedText>
                </span>
                <span className="text-gray-600 flex items-center gap-2">
                  <FaStar className="text-orange-500" />
                  <TranslatedText>120+ Restoran</TranslatedText>
                </span>
                <span className="text-gray-600 flex items-center gap-2">
                  <FaPhone className="text-orange-500" />
                  <TranslatedText>7/24 Destek</TranslatedText>
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>

        {/* Language Selector - Fixed Position */}
        <div className="fixed top-1 right-6 z-50">
          <LanguageSelector />
        </div>
    </main>
    </LanguageProvider>
  );
}


