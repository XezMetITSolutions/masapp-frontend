'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaHeadset, 
  FaPlus, 
  FaPaperPlane, 
  FaClock, 
  FaCheckCircle, 
  FaExclamationCircle,
  FaTimes,
  FaBars,
  FaSignOutAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaTag,
  FaCalendarAlt,
  FaEye,
  FaReply,
  FaStar,
  FaFilter,
  FaSearch
} from 'react-icons/fa';
import { useAuthStore } from '@/store/useAuthStore';
import { useLanguage } from '@/context/LanguageContext';
import BusinessSidebar from '@/components/BusinessSidebar';

interface Ticket {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'billing' | 'feature' | 'bug' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  userId: string;
  userName: string;
  userEmail: string;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  messages: TicketMessage[];
  rating?: number;
  feedback?: string;
}

interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  message: string;
  isFromAdmin: boolean;
  createdAt: Date;
  attachments?: string[];
}

export default function SupportPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { currentLanguage, setLanguage } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [showTicketDetail, setShowTicketDetail] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Yeni ticket formu
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: 'general' as const,
    priority: 'medium' as const
  });

  // Ticket detay modal'ında yeni mesaj
  const [newMessage, setNewMessage] = useState('');

  const getLanguageCode = () => {
    switch (currentLanguage) {
      case 'English': return 'en';
      case 'German': return 'de';
      default: return 'tr';
    }
  };

  const languageCode = getLanguageCode();

  const translations = {
    en: {
      title: 'Support Center',
      subtitle: 'Get help and support',
      newTicket: 'New Ticket',
      myTickets: 'My Tickets',
      allTickets: 'All Tickets',
      search: 'Search tickets...',
      filter: 'Filter',
      status: 'Status',
      category: 'Category',
      priority: 'Priority',
      created: 'Created',
      updated: 'Updated',
      actions: 'Actions',
      open: 'Open',
      inProgress: 'In Progress',
      resolved: 'Resolved',
      closed: 'Closed',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      urgent: 'Urgent',
      technical: 'Technical',
      billing: 'Billing',
      feature: 'Feature Request',
      bug: 'Bug Report',
      general: 'General',
      noTickets: 'No tickets found',
      createFirstTicket: 'Create your first support ticket',
      ticketDetails: 'Ticket Details',
      sendMessage: 'Send Message',
      closeTicket: 'Close Ticket',
      rateExperience: 'Rate Experience',
      submitRating: 'Submit Rating',
      logout: 'Logout'
    },
    tr: {
      title: 'Destek Merkezi',
      subtitle: 'Yardım ve destek alın',
      newTicket: 'Yeni Ticket',
      myTickets: 'Ticketlarım',
      allTickets: 'Tüm Ticketlar',
      search: 'Ticket ara...',
      filter: 'Filtrele',
      status: 'Durum',
      category: 'Kategori',
      priority: 'Öncelik',
      created: 'Oluşturuldu',
      updated: 'Güncellendi',
      actions: 'İşlemler',
      open: 'Açık',
      inProgress: 'İşlemde',
      resolved: 'Çözüldü',
      closed: 'Kapalı',
      low: 'Düşük',
      medium: 'Orta',
      high: 'Yüksek',
      urgent: 'Acil',
      technical: 'Teknik',
      billing: 'Faturalandırma',
      feature: 'Özellik İsteği',
      bug: 'Hata Bildirimi',
      general: 'Genel',
      noTickets: 'Ticket bulunamadı',
      createFirstTicket: 'İlk destek ticketınızı oluşturun',
      ticketDetails: 'Ticket Detayları',
      sendMessage: 'Mesaj Gönder',
      closeTicket: 'Ticketı Kapat',
      rateExperience: 'Deneyimi Değerlendir',
      submitRating: 'Değerlendirmeyi Gönder',
      logout: 'Çıkış'
    },
    de: {
      title: 'Support-Zentrum',
      subtitle: 'Hilfe und Support erhalten',
      newTicket: 'Neues Ticket',
      myTickets: 'Meine Tickets',
      allTickets: 'Alle Tickets',
      search: 'Tickets suchen...',
      filter: 'Filtern',
      status: 'Status',
      category: 'Kategorie',
      priority: 'Priorität',
      created: 'Erstellt',
      updated: 'Aktualisiert',
      actions: 'Aktionen',
      open: 'Offen',
      inProgress: 'In Bearbeitung',
      resolved: 'Gelöst',
      closed: 'Geschlossen',
      low: 'Niedrig',
      medium: 'Mittel',
      high: 'Hoch',
      urgent: 'Dringend',
      technical: 'Technisch',
      billing: 'Abrechnung',
      feature: 'Feature-Anfrage',
      bug: 'Fehlerbericht',
      general: 'Allgemein',
      noTickets: 'Keine Tickets gefunden',
      createFirstTicket: 'Erstellen Sie Ihr erstes Support-Ticket',
      ticketDetails: 'Ticket-Details',
      sendMessage: 'Nachricht senden',
      closeTicket: 'Ticket schließen',
      rateExperience: 'Erfahrung bewerten',
      submitRating: 'Bewertung abschicken',
      logout: 'Abmelden'
    }
  };

  const t = translations[languageCode as 'en' | 'tr' | 'de'] || translations.tr;

  // Demo ticket verilerini yükle
  useEffect(() => {
    const loadTickets = () => {
      const savedTickets = localStorage.getItem(`masapp-tickets-${user?.id || 'demo'}`);
      if (savedTickets) {
        try {
          const parsedTickets = JSON.parse(savedTickets);
          setTickets(parsedTickets);
          setFilteredTickets(parsedTickets);
        } catch (error) {
          console.error('Ticket verileri yüklenemedi:', error);
        }
      } else {
        // Demo ticketlar oluştur
        const demoTickets: Ticket[] = [
          {
            id: 'ticket-1',
            title: 'QR Kodlar çalışmıyor',
            description: 'Masa QR kodları müşteriler tarafından okunamıyor. Telefon kamerası ile tarandığında hata veriyor.',
            category: 'technical',
            priority: 'high',
            status: 'open',
            userId: user?.id || 'demo',
            userName: user?.name || 'Demo User',
            userEmail: user?.email || 'demo@example.com',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            messages: [
              {
                id: 'msg-1',
                ticketId: 'ticket-1',
                senderId: user?.id || 'demo',
                senderName: user?.name || 'Demo User',
                senderRole: user?.role || 'user',
                message: 'QR kodlar çalışmıyor, acil çözüm gerekiyor.',
                isFromAdmin: false,
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
              },
              {
                id: 'msg-2',
                ticketId: 'ticket-1',
                senderId: 'admin-1',
                senderName: 'MasApp Support',
                senderRole: 'super_admin',
                message: 'Merhaba! QR kod sorununuzu inceliyoruz. En kısa sürede çözüm sunacağız.',
                isFromAdmin: true,
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
              }
            ]
          },
          {
            id: 'ticket-2',
            title: 'Fatura çıktısı alınamıyor',
            description: 'Kasa panelinden fatura çıktısı alırken hata alıyorum. Yazıcı bağlı ama çıktı vermiyor.',
            category: 'technical',
            priority: 'medium',
            status: 'in_progress',
            userId: user?.id || 'demo',
            userName: user?.name || 'Demo User',
            userEmail: user?.email || 'demo@example.com',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
            assignedTo: 'admin-1',
            messages: [
              {
                id: 'msg-3',
                ticketId: 'ticket-2',
                senderId: user?.id || 'demo',
                senderName: user?.name || 'Demo User',
                senderRole: user?.role || 'user',
                message: 'Fatura çıktısı sorunu devam ediyor.',
                isFromAdmin: false,
                createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
              }
            ]
          },
          {
            id: 'ticket-3',
            title: 'Yeni özellik isteği: WhatsApp entegrasyonu',
            description: 'Müşterilere WhatsApp üzerinden sipariş onayı gönderebilmek istiyoruz.',
            category: 'feature',
            priority: 'low',
            status: 'resolved',
            userId: user?.id || 'demo',
            userName: user?.name || 'Demo User',
            userEmail: user?.email || 'demo@example.com',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            assignedTo: 'admin-1',
            rating: 5,
            feedback: 'Çok hızlı çözüm, teşekkürler!',
            messages: [
              {
                id: 'msg-4',
                ticketId: 'ticket-3',
                senderId: user?.id || 'demo',
                senderName: user?.name || 'Demo User',
                senderRole: user?.role || 'user',
                message: 'WhatsApp entegrasyonu eklenebilir mi?',
                isFromAdmin: false,
                createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
              },
              {
                id: 'msg-5',
                ticketId: 'ticket-3',
                senderId: 'admin-1',
                senderName: 'MasApp Support',
                senderRole: 'super_admin',
                message: 'WhatsApp entegrasyonu özelliği geliştirme planımıza eklendi. 2 hafta içinde aktif olacak.',
                isFromAdmin: true,
                createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
              }
            ]
          }
        ];
        
        setTickets(demoTickets);
        setFilteredTickets(demoTickets);
        localStorage.setItem(`masapp-tickets-${user?.id || 'demo'}`, JSON.stringify(demoTickets));
      }
    };

    loadTickets();
  }, [user]);

  // Filtreleme
  useEffect(() => {
    let filtered = tickets;

    if (searchTerm) {
      filtered = filtered.filter(ticket => 
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.category === categoryFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }

    setFilteredTickets(filtered);
  }, [tickets, searchTerm, statusFilter, categoryFilter, priorityFilter]);

  const handleCreateTicket = () => {
    if (!newTicket.title || !newTicket.description) {
      alert('Lütfen başlık ve açıklama alanlarını doldurun.');
      return;
    }

    const ticket: Ticket = {
      id: `ticket-${Date.now()}`,
      title: newTicket.title,
      description: newTicket.description,
      category: newTicket.category,
      priority: newTicket.priority,
      status: 'open',
      userId: user?.id || 'demo',
      userName: user?.name || 'Demo User',
      userEmail: user?.email || 'demo@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          ticketId: `ticket-${Date.now()}`,
          senderId: user?.id || 'demo',
          senderName: user?.name || 'Demo User',
          senderRole: user?.role || 'user',
          message: newTicket.description,
          isFromAdmin: false,
          createdAt: new Date()
        }
      ]
    };

    const updatedTickets = [ticket, ...tickets];
    setTickets(updatedTickets);
    setFilteredTickets(updatedTickets);
    localStorage.setItem(`masapp-tickets-${user?.id || 'demo'}`, JSON.stringify(updatedTickets));

    // Super admin'e bildirim gönder
    const adminNotification = {
      id: `notif-${Date.now()}`,
      type: 'new_ticket',
      title: 'Yeni Destek Ticketı',
      message: `${user?.name || 'Kullanıcı'} yeni bir destek ticketı oluşturdu: ${newTicket.title}`,
      ticketId: ticket.id,
      userId: user?.id || 'demo',
      userName: user?.name || 'Demo User',
      priority: newTicket.priority,
      category: newTicket.category,
      createdAt: new Date().toISOString(),
      isRead: false
    };

    const existingNotifications = JSON.parse(localStorage.getItem('admin-notifications') || '[]');
    existingNotifications.unshift(adminNotification);
    localStorage.setItem('admin-notifications', JSON.stringify(existingNotifications));

    setNewTicket({ title: '', description: '', category: 'general', priority: 'medium' });
    setShowNewTicketModal(false);
    
    alert('Ticket başarıyla oluşturuldu! Super admin bilgilendirildi.');
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTicket) return;

    const message: TicketMessage = {
      id: `msg-${Date.now()}`,
      ticketId: selectedTicket.id,
      senderId: user?.id || 'demo',
      senderName: user?.name || 'Demo User',
      senderRole: user?.role || 'user',
      message: newMessage,
      isFromAdmin: false,
      createdAt: new Date()
    };

    const updatedTickets = tickets.map(ticket => 
      ticket.id === selectedTicket.id 
        ? { 
            ...ticket, 
            messages: [...ticket.messages, message],
            updatedAt: new Date()
          }
        : ticket
    );

    setTickets(updatedTickets);
    setFilteredTickets(updatedTickets);
    localStorage.setItem(`masapp-tickets-${user?.id || 'demo'}`, JSON.stringify(updatedTickets));

    // Super admin'e yeni mesaj bildirimi gönder
    const adminNotification = {
      id: `notif-${Date.now()}`,
      type: 'ticket_message',
      title: 'Yeni Ticket Mesajı',
      message: `${user?.name || 'Kullanıcı'} ticket "${selectedTicket.title}" için yeni mesaj gönderdi`,
      ticketId: selectedTicket.id,
      userId: user?.id || 'demo',
      userName: user?.name || 'Demo User',
      createdAt: new Date().toISOString(),
      isRead: false
    };

    const existingNotifications = JSON.parse(localStorage.getItem('admin-notifications') || '[]');
    existingNotifications.unshift(adminNotification);
    localStorage.setItem('admin-notifications', JSON.stringify(existingNotifications));

    setNewMessage('');
  };

  const handleCloseTicket = (ticketId: string) => {
    const updatedTickets = tickets.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, status: 'closed' as const, updatedAt: new Date() }
        : ticket
    );

    setTickets(updatedTickets);
    setFilteredTickets(updatedTickets);
    localStorage.setItem(`masapp-tickets-${user?.id || 'demo'}`, JSON.stringify(updatedTickets));
    
    alert('Ticket kapatıldı.');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return '🔧';
      case 'billing': return '💳';
      case 'feature': return '💡';
      case 'bug': return '🐛';
      default: return '📋';
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
      <BusinessSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={() => logout()}
      />

      {/* Main Content */}
      <div className="ml-0 lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FaBars className="text-lg text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FaHeadset className="text-purple-600" />
                    {t.title}
                  </h1>
                  <p className="text-gray-500 mt-1">{t.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {/* Language Selector */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setLanguage('Turkish')}
                    className={`px-2 py-1 rounded text-xs ${languageCode === 'tr' ? 'bg-white text-purple-600' : 'text-gray-600'}`}
                  >
                    TR
                  </button>
                  <button
                    onClick={() => setLanguage('English')}
                    className={`px-2 py-1 rounded text-xs ${languageCode === 'en' ? 'bg-white text-purple-600' : 'text-gray-600'}`}
                  >
                    EN
                  </button>
                  <button
                    onClick={() => setLanguage('German')}
                    className={`px-2 py-1 rounded text-xs ${languageCode === 'de' ? 'bg-white text-purple-600' : 'text-gray-600'}`}
                  >
                    DE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-4 sm:p-6 lg:p-8">
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={() => setShowNewTicketModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <FaPlus />
            {t.newTicket}
          </button>
          
          <div className="flex-1 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">{t.status}: Tümü</option>
                <option value="open">{t.open}</option>
                <option value="in_progress">{t.inProgress}</option>
                <option value="resolved">{t.resolved}</option>
                <option value="closed">{t.closed}</option>
              </select>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">{t.category}: Tümü</option>
                <option value="technical">{t.technical}</option>
                <option value="billing">{t.billing}</option>
                <option value="feature">{t.feature}</option>
                <option value="bug">{t.bug}</option>
                <option value="general">{t.general}</option>
              </select>
              
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">{t.priority}: Tümü</option>
                <option value="urgent">{t.urgent}</option>
                <option value="high">{t.high}</option>
                <option value="medium">{t.medium}</option>
                <option value="low">{t.low}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="bg-white rounded-lg shadow-sm">
          {filteredTickets.length === 0 ? (
            <div className="text-center py-12">
              <FaHeadset className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t.noTickets}</h3>
              <p className="text-gray-500 mb-4">{t.createFirstTicket}</p>
              <button
                onClick={() => setShowNewTicketModal(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                {t.newTicket}
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setSelectedTicket(ticket);
                    setShowTicketDetail(true);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg">{getCategoryIcon(ticket.category)}</span>
                        <h3 className="text-lg font-medium text-gray-900">{ticket.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {t[ticket.status as keyof typeof t]}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                          {t[ticket.priority as keyof typeof t]}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">{ticket.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt />
                          {t.created}: {ticket.createdAt.toLocaleDateString('tr-TR')}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaClock />
                          {t.updated}: {ticket.updatedAt.toLocaleDateString('tr-TR')}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaUser />
                          {ticket.userName}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {ticket.messages.length} mesaj
                      </span>
                      <FaEye className="text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">{t.newTicket}</h3>
              <button
                onClick={() => setShowNewTicketModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlık *
                </label>
                <input
                  type="text"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Ticket başlığını girin..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  value={newTicket.category}
                  onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="general">{t.general}</option>
                  <option value="technical">{t.technical}</option>
                  <option value="billing">{t.billing}</option>
                  <option value="feature">{t.feature}</option>
                  <option value="bug">{t.bug}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Öncelik
                </label>
                <select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="low">{t.low}</option>
                  <option value="medium">{t.medium}</option>
                  <option value="high">{t.high}</option>
                  <option value="urgent">{t.urgent}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama *
                </label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Sorununuzu detaylı olarak açıklayın..."
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={() => setShowNewTicketModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleCreateTicket}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <FaPaperPlane />
                Ticket Oluştur
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {showTicketDetail && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{t.ticketDetails}</h3>
                <p className="text-gray-600">{selectedTicket.title}</p>
              </div>
              <button
                onClick={() => setShowTicketDetail(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="p-6">
              {/* Ticket Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Kategori</p>
                    <p className="font-medium">{getCategoryIcon(selectedTicket.category)} {t[selectedTicket.category as keyof typeof t]}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Öncelik</p>
                    <p className={`font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                      {t[selectedTicket.priority as keyof typeof t]}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Durum</p>
                    <p className={`font-medium ${getStatusColor(selectedTicket.status)}`}>
                      {t[selectedTicket.status as keyof typeof t]}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Oluşturuldu</p>
                    <p className="font-medium">{selectedTicket.createdAt.toLocaleDateString('tr-TR')}</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="space-y-4 mb-6">
                <h4 className="font-medium text-gray-800">Mesajlar</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {selectedTicket.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg ${
                        message.isFromAdmin 
                          ? 'bg-blue-50 border-l-4 border-blue-400' 
                          : 'bg-gray-50 border-l-4 border-gray-400'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {message.senderName}
                          </span>
                          {message.isFromAdmin && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              Admin
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">
                          {message.createdAt.toLocaleString('tr-TR')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{message.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* New Message */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-800">Yeni Mesaj</h4>
                <div className="flex gap-2">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Mesajınızı yazın..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    rows={3}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <FaReply />
                    Gönder
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <div className="flex gap-2">
                  {selectedTicket.status !== 'closed' && (
                    <button
                      onClick={() => handleCloseTicket(selectedTicket.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                    >
                      <FaTimes />
                      {t.closeTicket}
                    </button>
                  )}
                </div>
                
                {selectedTicket.status === 'resolved' && !selectedTicket.rating && (
                  <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center gap-2">
                    <FaStar />
                    {t.rateExperience}
                  </button>
                )}
              </div>
        </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}