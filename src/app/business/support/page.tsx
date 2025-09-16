'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FaHeadset, 
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
  FaQuestionCircle,
  FaComments,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimes,
  FaSignOutAlt,
  FaCog,
  FaUtensils,
  FaShoppingCart,
  FaUsers,
  FaQrcode,
  FaChartBar,
  FaChartLine,
  FaClock,
  FaCalendarAlt,
  FaFileAlt,
  FaVideo,
  FaBook,
  FaLightbulb,
  FaBug,
  FaRocket,
  FaStar,
  FaThumbsUp,
  FaThumbsDown,
  FaArrowRight,
  FaDownload,
  FaExternalLinkAlt,
  FaPlus,
  FaTrash,
  FaSearch,
  FaBars
} from 'react-icons/fa';
import { useAuthStore } from '@/store/useAuthStore';

export default function SupportPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('faq');
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportType, setSupportType] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low'|'medium'|'high'>('low');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Sayfa yüklendiğinde demo işletme kullanıcısı oluştur
    const timer = setTimeout(() => {
      if (!user) {
        const demoUser = {
          id: 'demo-restaurant-1',
          name: 'Demo İşletme',
          email: 'demo@restaurant.com',
          role: 'restaurant_owner' as const,
          restaurantId: 'demo-restaurant-1',
          status: 'active' as const,
          createdAt: new Date()
        };
        
        const { login } = useAuthStore.getState();
        login(demoUser, 'demo-token');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/business/login');
  };

  const handleSupportRequest = (type: string) => {
    setSupportType(type);
    setShowSupportModal(true);
  };

  const handleSubmitSupportRequest = () => {
    if (!supportType) { alert('Lütfen talep türünü seçin.'); return; }
    if (!subject.trim()) { alert('Lütfen konu girin.'); return; }
    if (!description.trim()) { alert('Lütfen açıklama girin.'); return; }
    const now = new Date();
    const newTicket: any = {
      id: Date.now(),
      title: subject.trim(),
      status: 'open',
      priority: priority,
      createdAt: now.toISOString().slice(0,16).replace('T',' '),
      lastUpdate: now.toISOString().slice(0,16).replace('T',' '),
      category: supportType === 'billing' ? 'billing' : supportType === 'technical' ? 'technical' : 'general',
      messages: [
        { from: 'user', text: description.trim(), at: now.toISOString().slice(0,16).replace('T',' ') }
      ]
    };
    // listeye ekle ve tickets sekmesine geç
    setSupportTickets((prev: any[]) => [newTicket, ...(prev || [])]);
    setActiveTab('tickets');
    alert('Destek talebiniz alındı! Destek Taleplerim listesine eklendi.');
    setShowSupportModal(false);
    setSubject('');
    setDescription('');
    setSupportType('');
    setPriority('low');
  };

  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState<any | null>(null);
  const [replyText, setReplyText] = useState('');
  const canDeleteTicket = (t: any) => !(t?.messages || []).some((m: any) => m.from === 'support');

  const [supportTickets, setSupportTickets] = useState<any[]>([
    {
      id: 1,
      title: 'QR Kod oluşturma sorunu',
      status: 'open',
      priority: 'high',
      createdAt: '2024-01-15 14:30',
      lastUpdate: '2024-01-15 15:45',
      category: 'technical',
      messages: [
        { from: 'user', text: 'QR kod oluştururken hata alıyorum.', at: '2024-01-15 14:30' },
        { from: 'support', text: 'Hangi masa için denediniz?', at: '2024-01-15 14:45' }
      ]
    },
    {
      id: 2,
      title: 'Menü öğesi ekleme hatası',
      status: 'in_progress',
      priority: 'medium',
      createdAt: '2024-01-14 10:15',
      lastUpdate: '2024-01-15 09:30',
      category: 'technical',
      messages: [
        { from: 'user', text: 'Yeni ürün kaydetmiyor.', at: '2024-01-14 10:15' }
      ]
    },
    {
      id: 3,
      title: 'Fatura ödeme sorunu',
      status: 'resolved',
      priority: 'high',
      createdAt: '2024-01-13 16:20',
      lastUpdate: '2024-01-14 11:00',
      category: 'billing',
      messages: [
        { from: 'user', text: 'Ödeme ekranı açılmıyor.', at: '2024-01-13 16:20' },
        { from: 'support', text: 'Çözüldü, tekrar dener misiniz?', at: '2024-01-14 11:00' }
      ]
    }
  ]);

  const faqItems = [
    {
      question: 'MasApp nasıl kullanılır?',
      answer: 'MasApp kullanımı çok basittir. Önce menünüzü oluşturun, sonra QR kodlarınızı masa başlarına yerleştirin. Müşteriler QR kodu okutarak menüyü görüntüleyebilir ve sipariş verebilir.',
      category: 'general'
    },
    {
      question: 'QR kodlar nasıl oluşturulur?',
      answer: 'QR Kodlar menüsünden "QR Kod Oluştur" butonuna tıklayın. Masa numarasını girin ve QR kodunuzu indirin. Her masa için ayrı QR kod oluşturmanızı öneririz.',
      category: 'technical'
    },
    {
      question: 'Ödeme nasıl yapılır?',
      answer: 'MasApp\'te nakit, kredi kartı ve QR kod ile ödeme seçenekleri mevcuttur. Müşteriler tercih ettikleri yöntemi seçebilir.',
      category: 'billing'
    },
    {
      question: 'Personel nasıl eklenir?',
      answer: 'Personel menüsünden "Personel Ekle" butonuna tıklayın. Gerekli bilgileri doldurun ve personeli sisteminize ekleyin.',
      category: 'general'
    },
    {
      question: 'Raporlar nasıl görüntülenir?',
      answer: 'Raporlar menüsünden istediğiniz rapor türünü seçin. Günlük, haftalık ve aylık raporları görüntüleyebilirsiniz.',
      category: 'reports'
    },
    {
      question: 'Menü öğesi nasıl düzenlenir?',
      answer: 'Menü Yönetimi sayfasından düzenlemek istediğiniz öğeye tıklayın. "Düzenle" butonuna basarak değişiklikleri yapabilirsiniz.',
      category: 'technical'
    },
    {
      question: 'Sipariş durumu nasıl değiştirilir?',
      answer: 'Siparişler sayfasından siparişe tıklayın ve durum butonlarını kullanarak sipariş durumunu güncelleyin.',
      category: 'general'
    },
    {
      question: 'Fatura nasıl görüntülenir?',
      answer: 'Ayarlar menüsünden "Faturalandırma" bölümüne gidin. Buradan faturalarınızı görüntüleyebilir ve indirebilirsiniz.',
      category: 'billing'
    }
  ];

  const categories = [
    { id: 'all', name: 'Tümü', icon: FaQuestionCircle },
    { id: 'general', name: 'Genel', icon: FaComments },
    { id: 'technical', name: 'Teknik', icon: FaBug },
    { id: 'billing', name: 'Faturalandırma', icon: FaPhone },
    { id: 'reports', name: 'Raporlar', icon: FaChartBar }
  ];

  const filteredFaqItems = faqItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Açık';
      case 'in_progress': return 'İşlemde';
      case 'resolved': return 'Çözüldü';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Yüksek';
      case 'medium': return 'Orta';
      case 'low': return 'Düşük';
      default: return priority;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-purple-900 to-purple-800 text-white transform transition-transform duration-300 ease-in-out z-50 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">MasApp</h1>
              <p className="text-purple-200 text-xs sm:text-sm mt-1">Restoran Yönetim Sistemi</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-purple-700 rounded-lg transition-colors"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>

        <nav className="mt-4 sm:mt-6">
          <Link href="/business/dashboard" className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-3 sm:py-3 hover:bg-purple-700 hover:bg-opacity-50 transition-colors rounded-r-lg mx-2 sm:mx-0">
            <FaChartLine className="mr-2 sm:mr-3 text-sm sm:text-base" />
            <span className="text-sm sm:text-base font-medium">Kontrol Paneli</span>
          </Link>
          <Link href="/business/menu" className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-3 sm:py-3 hover:bg-purple-700 hover:bg-opacity-50 transition-colors rounded-r-lg mx-2 sm:mx-0">
            <FaUtensils className="mr-2 sm:mr-3 text-sm sm:text-base" />
            <span className="text-sm sm:text-base font-medium">Menü Yönetimi</span>
          </Link>
          <Link href="/business/staff" className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-3 sm:py-3 hover:bg-purple-700 hover:bg-opacity-50 transition-colors rounded-r-lg mx-2 sm:mx-0">
            <FaUsers className="mr-2 sm:mr-3 text-sm sm:text-base" />
            <span className="text-sm sm:text-base font-medium">Personel</span>
          </Link>
          <Link href="/business/qr-codes" className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-3 sm:py-3 hover:bg-purple-700 hover:bg-opacity-50 transition-colors rounded-r-lg mx-2 sm:mx-0">
            <FaQrcode className="mr-2 sm:mr-3 text-sm sm:text-base" />
            <span className="text-sm sm:text-base font-medium">QR Kodlar</span>
          </Link>
          <Link href="/business/reports" className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-3 sm:py-3 hover:bg-purple-700 hover:bg-opacity-50 transition-colors rounded-r-lg mx-2 sm:mx-0">
            <FaChartBar className="mr-2 sm:mr-3 text-sm sm:text-base" />
            <span className="text-sm sm:text-base font-medium">Raporlar</span>
          </Link>
          <Link href="/business/support" className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-3 sm:py-3 bg-purple-700 bg-opacity-50 border-l-4 border-white rounded-r-lg mx-2 sm:mx-0">
            <FaHeadset className="mr-2 sm:mr-3 text-sm sm:text-base" />
            <span className="text-sm sm:text-base font-medium">Destek</span>
          </Link>
          <Link href="/business/settings" className="flex items-center justify-center sm:justify-start px-4 sm:px-6 py-3 sm:py-3 hover:bg-purple-700 hover:bg-opacity-50 transition-colors rounded-r-lg mx-2 sm:mx-0">
            <FaCog className="mr-2 sm:mr-3 text-sm sm:text-base" />
            <span className="text-sm sm:text-base font-medium">Ayarlar</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <div className="border-t border-purple-700 pt-3 sm:pt-4">
            <div className="flex items-center justify-between">
              <div className="hidden sm:block">
                <p className="text-sm font-medium">MasApp</p>
                <p className="text-xs text-purple-300">info@masapp.com</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-purple-700 rounded-lg transition-colors"
                title="Çıkış Yap"
              >
                <FaSignOutAlt className="text-sm sm:text-base" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-0 lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-3 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaBars className="text-lg text-gray-600" />
              </button>
              <div>
                <h2 className="text-lg sm:text-2xl font-semibold text-gray-800">Destek</h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">MasApp</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-3 sm:p-6 lg:p-8">
          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('faq')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'faq'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <FaQuestionCircle className="inline mr-2" />
                Sık Sorulan Sorular
              </button>
              <button
                onClick={() => setActiveTab('tickets')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'tickets'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <FaComments className="inline mr-2" />
                Destek Talepleri
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'contact'
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <FaHeadset className="inline mr-2" />
                İletişim
              </button>
            </div>
          </div>

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Sorunuzu arayın..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 overflow-x-auto">
                    {categories.map(category => {
                      const IconComponent = category.icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                            selectedCategory === category.id
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <IconComponent />
                          {category.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* FAQ Items */}
              <div className="space-y-4">
                {filteredFaqItems.map((faq, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <FaQuestionCircle className="text-purple-500" />
                      {faq.question}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        faq.category === 'general' ? 'bg-blue-100 text-blue-800' :
                        faq.category === 'technical' ? 'bg-orange-100 text-orange-800' :
                        faq.category === 'billing' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {categories.find(c => c.id === faq.category)?.name || faq.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Helpful Actions */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Yardımcı Olmadı mı?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleSupportRequest('technical')}
                    className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow text-left"
                  >
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <FaBug className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Teknik Destek Talebi</h4>
                      <p className="text-sm text-gray-600">Sorununuzu detaylı olarak açıklayın</p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleSupportRequest('general')}
                    className="flex items-center gap-3 p-4 bg-white rounded-lg hover:shadow-md transition-shadow text-left"
                  >
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <FaComments className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Genel Soru</h4>
                      <p className="text-sm text-gray-600">Genel sorularınızı sorun</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tickets Tab */}
          {activeTab === 'tickets' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Destek Taleplerim</h3>
                <button 
                  onClick={() => handleSupportRequest('general')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                >
                  <FaPlus />
                  Yeni Talep
                </button>
              </div>
              <div className="space-y-4">
                {supportTickets.map(ticket => (
                  <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer" onClick={()=>{setActiveTicket(ticket); setTicketModalOpen(true);}}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 mb-2">{ticket.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>#{ticket.id}</span>
                          <span>{ticket.createdAt}</span>
                          <span>Son güncelleme: {ticket.lastUpdate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {getStatusText(ticket.status)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                          {getPriorityText(ticket.priority)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">İletişim Bilgileri</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <FaWhatsapp className="text-4xl text-green-500 mx-auto mb-4" />
                  <h4 className="font-semibold text-gray-800 mb-2">WhatsApp Destek</h4>
                  <p className="text-xs text-gray-500">7/24 Hızlı Yanıt</p>
                  <a 
                    href="https://wa.me/905393222797" target="_blank" rel="noopener noreferrer"
                    className="inline-block mt-3 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                  >
                    Mesaj Gönder
                  </a>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <FaEnvelope className="text-4xl text-purple-500 mx-auto mb-4" />
                  <h4 className="font-semibold text-gray-800 mb-2">E-posta Destek</h4>
                  <p className="text-sm text-gray-600 mb-3">destek@masapp.com</p>
                  <p className="text-xs text-gray-500">24 saat içinde yanıt</p>
                  <button 
                    onClick={() => handleSupportRequest('general')}
                    className="mt-3 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm"
                  >
                    Talep Oluştur
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Ticket Detail Modal */}
      {ticketModalOpen && activeTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={()=>setTicketModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">#{activeTicket.id} - {activeTicket.title}</h3>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className={`px-2 py-1 rounded-full ${getStatusColor(activeTicket.status)}`}>{getStatusText(activeTicket.status)}</span>
                  <span className={`px-2 py-1 rounded-full ${getPriorityColor(activeTicket.priority)}`}>{getPriorityText(activeTicket.priority)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {canDeleteTicket(activeTicket) && (
                  <button
                    className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                    onClick={()=>{
                      if (!confirm('Bu talebi silmek istiyor musunuz?')) return;
                      setSupportTickets(supportTickets.filter(t=>t.id!==activeTicket.id));
                      setTicketModalOpen(false);
                    }}
                    title="Talebi Sil"
                  >
                    <FaTrash />
                  </button>
                )}
                <button className="p-2 hover:bg-gray-100 rounded-lg" onClick={()=>setTicketModalOpen(false)}>
                  <FaTimes className="text-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {activeTicket.messages?.map((m:any, idx:number)=>(
                  <div key={idx} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`${m.from==='user' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-800'} px-3 py-2 rounded-lg max-w-[75%]`}>
                      <p className="text-sm whitespace-pre-wrap">{m.text}</p>
                      <p className="text-[10px] opacity-70 mt-1">{m.at}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <input value={replyText} onChange={(e)=>setReplyText(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Yanıt yazın..." />
                <button
                  onClick={()=>{
                    if (!replyText.trim()) return;
                    const at = new Date().toISOString().slice(0,16).replace('T',' ');
                    const updated = supportTickets.map(t=> t.id===activeTicket.id ? { ...t, lastUpdate: at, messages:[...(t.messages||[]), {from:'user', text: replyText.trim(), at}] } : t);
                    setSupportTickets(updated);
                    setActiveTicket(updated.find(t=>t.id===activeTicket.id));
                    setReplyText('');
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >Gönder</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Destek Talebi Modalı */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={()=>setShowSupportModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e)=>e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <FaHeadset className="text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Destek Talebi Oluştur</h3>
                  <p className="text-sm text-gray-500">Sorununuzu detaylı olarak açıklayın</p>
                </div>
              </div>
              <button
                onClick={() => setShowSupportModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Talep Türü
                  </label>
                  <select 
                    value={supportType}
                    onChange={(e) => setSupportType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Seçiniz</option>
                    <option value="urgent">Acil Destek</option>
                    <option value="technical">Teknik Destek</option>
                    <option value="billing">Faturalandırma</option>
                    <option value="feature">Özellik İsteği</option>
                    <option value="general">Genel Soru</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Konu
                  </label>
                  <input
                    type="text"
                    placeholder="Sorununuzu kısaca özetleyin"
                    value={subject}
                    onChange={(e)=>setSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Sorununuzu detaylı olarak açıklayın..."
                    value={description}
                    onChange={(e)=>setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Öncelik
                  </label>
                  <select value={priority} onChange={(e)=>setPriority(e.target.value as any)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option value="low">Düşük</option>
                    <option value="medium">Orta</option>
                    <option value="high">Yüksek</option>
                  </select>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowSupportModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleSubmitSupportRequest}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Talep Gönder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
