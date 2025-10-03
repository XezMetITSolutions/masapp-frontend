'use client';

import { useState, useEffect } from 'react';

import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  FaArrowLeft,
  FaUser,
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaFileAlt,
  FaDownload,
  FaCheck,
  FaTimes,
  FaClock,
  FaExclamationTriangle,
  FaPaperPlane,
  FaEdit,
  FaUserPlus,
  FaUserMinus,
  FaGraduationCap,
  FaBriefcase,
  FaLanguage,
  FaMoneyBillWave,
  FaUsers,
  FaHistory
} from 'react-icons/fa';

interface UserApprovalDetail {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    birthDate: string;
    nationality: string;
  };
  professionalInfo: {
    role: string;
    position: string;
    experience: string;
    education: string;
    languages: string[];
    skills: string[];
    availability: string;
    expectedSalary?: number;
    startDate: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  notes?: string;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: string;
    size: number;
  }>;
  references: Array<{
    name: string;
    position: string;
    company: string;
    phone: string;
    email: string;
    relationship: string;
  }>;
  interviewNotes?: string;
  backgroundCheck?: {
    status: string;
    completedAt?: string;
    notes?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function UserApprovalDetail() {
  const router = useRouter();
  const params = useParams();
  const approvalId = params.id as string;
  
  const [approval, setApproval] = useState<UserApprovalDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [action, setAction] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [notes, setNotes] = useState('');
  const [interviewNotes, setInterviewNotes] = useState('');

  useEffect(() => {
    // Demo: Kullanıcı onay detay verilerini yükle
    const loadApproval = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo veri
      const demoApproval: UserApprovalDetail = {
        id: approvalId,
        userId: 'user-1',
        restaurantId: 'rest-1',
        restaurantName: 'Pizza Palace',
        personalInfo: {
          firstName: 'Ahmet',
          lastName: 'Yılmaz',
          email: 'ahmet.yilmaz@email.com',
          phone: '+90 532 123 4567',
          address: 'Kadıköy, İstanbul',
          birthDate: '1990-05-15',
          nationality: 'Türk'
        },
        professionalInfo: {
          role: 'manager',
          position: 'Restoran Müdürü',
          experience: '5 yıl restoran yönetimi deneyimi',
          education: 'İşletme Fakültesi Mezunu',
          languages: ['Türkçe', 'İngilizce'],
          skills: ['Restoran Yönetimi', 'Personel Yönetimi', 'Müşteri Hizmetleri', 'Muhasebe'],
          availability: 'Tam zamanlı',
          expectedSalary: 15000,
          startDate: '2024-04-01'
        },
        status: 'pending',
        appliedAt: '2024-03-15T10:30:00Z',
        notes: 'Deneyimli restoran müdürü, önceki işletmede 3 yıl çalışmış. Müşteri memnuniyeti konusunda başarılı.',
        documents: [
          {
            id: 'doc-1',
            name: 'CV.pdf',
            type: 'cv',
            url: '/documents/cv-1.pdf',
            uploadedAt: '2024-03-15T10:30:00Z',
            size: 1024000
          },
          {
            id: 'doc-2',
            name: 'Kimlik Fotokopisi.pdf',
            type: 'id',
            url: '/documents/id-1.pdf',
            uploadedAt: '2024-03-15T10:32:00Z',
            size: 512000
          },
          {
            id: 'doc-3',
            name: 'Diploma.pdf',
            type: 'diploma',
            url: '/documents/diploma-1.pdf',
            uploadedAt: '2024-03-15T10:35:00Z',
            size: 2048000
          }
        ],
        references: [
          {
            name: 'Mehmet Demir',
            position: 'Genel Müdür',
            company: 'ABC Restoran',
            phone: '+90 533 111 2233',
            email: 'mehmet@abcrestoran.com',
            relationship: 'Önceki İşveren'
          },
          {
            name: 'Fatma Özkan',
            position: 'İnsan Kaynakları Müdürü',
            company: 'XYZ Şirketi',
            phone: '+90 534 444 5566',
            email: 'fatma@xyz.com',
            relationship: 'Meslektaş'
          }
        ],
        interviewNotes: 'Mülakat yapıldı, teknik bilgileri yeterli, iletişim becerileri güçlü.',
        backgroundCheck: {
          status: 'pending',
          notes: 'Arka plan kontrolü başlatıldı'
        },
        createdAt: '2024-03-15T10:30:00Z',
        updatedAt: '2024-03-15T10:30:00Z'
      };
      
      setApproval(demoApproval);
      setIsLoading(false);
    };

    if (approvalId) {
      loadApproval();
    }
  }, [approvalId]);

  const handleAction = async (actionType: string) => {
    if (!approval) return;
    
    setIsProcessing(true);
    setAction(actionType);
    
    try {
      // Demo: Kullanıcı onay işlemi simülasyonu
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let newStatus = approval.status;
      let newRejectionReason = rejectionReason;
      let newNotes = notes;
      let newInterviewNotes = interviewNotes;
      
      switch (actionType) {
        case 'approve':
          newStatus = 'approved';
          break;
        case 'reject':
          newStatus = 'rejected';
          newRejectionReason = rejectionReason || 'Belirtilmedi';
          break;
        case 'addNotes':
          newNotes = notes;
          break;
        case 'addInterviewNotes':
          newInterviewNotes = interviewNotes;
          break;
      }
      
      setApproval(prev => prev ? { 
        ...prev, 
        status: newStatus,
        rejectionReason: newRejectionReason,
        notes: newNotes,
        interviewNotes: newInterviewNotes,
        reviewedAt: actionType === 'approve' || actionType === 'reject' ? new Date().toISOString() : prev.reviewedAt,
        reviewedBy: actionType === 'approve' || actionType === 'reject' ? 'Admin User' : prev.reviewedBy,
        updatedAt: new Date().toISOString()
      } : null);
      
      if (actionType === 'addNotes' || actionType === 'addInterviewNotes') {
        setNotes('');
        setInterviewNotes('');
      } else {
        setRejectionReason('');
      }
      
      alert(`${actionType} işlemi başarıyla tamamlandı`);
    } catch (error) {
      console.error('Action error:', error);
      alert('İşlem sırasında bir hata oluştu');
    } finally {
      setIsProcessing(false);
      setAction(null);
    }
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'pending': return 'Beklemede';
      case 'approved': return 'Onaylandı';
      case 'rejected': return 'Reddedildi';
      case 'expired': return 'Süresi Doldu';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <FaClock className="text-yellow-600" />;
      case 'approved': return <FaCheck className="text-green-600" />;
      case 'rejected': return <FaTimes className="text-red-600" />;
      case 'expired': return <FaExclamationTriangle className="text-gray-600" />;
      default: return <FaExclamationTriangle className="text-gray-600" />;
    }
  };

  const getRoleClass = (role: string) => {
    switch(role) {
      case 'manager': return 'bg-purple-100 text-purple-800';
      case 'staff': return 'bg-blue-100 text-blue-800';
      case 'cashier': return 'bg-green-100 text-green-800';
      case 'waiter': return 'bg-orange-100 text-orange-800';
      case 'kitchen': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleText = (role: string) => {
    switch(role) {
      case 'manager': return 'Müdür';
      case 'staff': return 'Personel';
      case 'cashier': return 'Kasa';
      case 'waiter': return 'Garson';
      case 'kitchen': return 'Mutfak';
      default: return role;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Başvuru detayları yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!approval) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-4xl text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Başvuru Bulunamadı</h1>
          <p className="text-gray-600 mb-4">Aradığınız başvuru bulunamadı.</p>
          <Link href="/admin/user-approvals" className="text-blue-600 hover:underline">
            Başvuru listesine dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link 
                href="/admin/user-approvals"
                className="mr-4 text-gray-600 hover:text-gray-800"
              >
                <FaArrowLeft className="text-xl" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Başvuru Detayları</h1>
                <p className="text-gray-600 mt-1">{approval.personalInfo.firstName} {approval.personalInfo.lastName} - {approval.restaurantName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 text-sm rounded-full font-medium flex items-center ${getStatusClass(approval.status)}`}>
                {getStatusIcon(approval.status)}
                <span className="ml-1">{getStatusText(approval.status)}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sol Kolon - Başvuru Bilgileri */}
          <div className="lg:col-span-2 space-y-6">
            {/* Kişisel Bilgiler */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaUser className="mr-2" />
                Kişisel Bilgiler
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                  <p className="mt-1 text-sm text-gray-900">{approval.personalInfo.firstName} {approval.personalInfo.lastName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900 flex items-center">
                    <FaEnvelope className="mr-2 text-gray-400" />
                    {approval.personalInfo.email}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Telefon</label>
                  <p className="mt-1 text-sm text-gray-900 flex items-center">
                    <FaPhone className="mr-2 text-gray-400" />
                    {approval.personalInfo.phone}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Doğum Tarihi</label>
                  <p className="mt-1 text-sm text-gray-900">{new Date(approval.personalInfo.birthDate).toLocaleDateString('tr-TR')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Adres</label>
                  <p className="mt-1 text-sm text-gray-900">{approval.personalInfo.address}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Uyruk</label>
                  <p className="mt-1 text-sm text-gray-900">{approval.personalInfo.nationality}</p>
                </div>
              </div>
            </div>

            {/* Profesyonel Bilgiler */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaBriefcase className="mr-2" />
                Profesyonel Bilgiler
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pozisyon</label>
                    <p className="mt-1 text-sm text-gray-900">{approval.professionalInfo.position}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rol</label>
                    <span className={`mt-1 inline-block px-3 py-1 text-sm rounded-full font-medium ${getRoleClass(approval.professionalInfo.role)}`}>
                      {getRoleText(approval.professionalInfo.role)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Deneyim</label>
                    <p className="mt-1 text-sm text-gray-900">{approval.professionalInfo.experience}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Eğitim</label>
                    <p className="mt-1 text-sm text-gray-900">{approval.professionalInfo.education}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Diller</label>
                    <p className="mt-1 text-sm text-gray-900">{approval.professionalInfo.languages.join(', ')}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Müsaitlik</label>
                    <p className="mt-1 text-sm text-gray-900">{approval.professionalInfo.availability}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Beceri</label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {approval.professionalInfo.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                {approval.professionalInfo.expectedSalary && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Beklenen Maaş</label>
                    <p className="mt-1 text-sm text-gray-900">₺{approval.professionalInfo.expectedSalary.toLocaleString()}/ay</p>
                  </div>
                )}
              </div>
            </div>

            {/* Belgeler */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaFileAlt className="mr-2" />
                Belgeler
              </h2>
              <div className="space-y-3">
                {approval.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FaFileAlt className="mr-3 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(doc.uploadedAt).toLocaleDateString('tr-TR')} • {(doc.size / 1024).toFixed(1)} KB
                        </div>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800">
                      <FaDownload className="text-sm" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Referanslar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaUsers className="mr-2" />
                Referanslar
              </h2>
              <div className="space-y-4">
                {approval.references.map((ref, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                        <p className="mt-1 text-sm text-gray-900">{ref.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Pozisyon</label>
                        <p className="mt-1 text-sm text-gray-900">{ref.position}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Şirket</label>
                        <p className="mt-1 text-sm text-gray-900">{ref.company}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">İlişki</label>
                        <p className="mt-1 text-sm text-gray-900">{ref.relationship}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Telefon</label>
                        <p className="mt-1 text-sm text-gray-900">{ref.phone}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-sm text-gray-900">{ref.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sağ Kolon - İşlemler ve Bilgiler */}
          <div className="space-y-6">
            {/* Hızlı İşlemler */}
            {approval.status === 'pending' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Hızlı İşlemler</h2>
                
                <div className="space-y-3">
                  <button
                    onClick={() => handleAction('approve')}
                    disabled={isProcessing}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center"
                  >
                    {isProcessing && action === 'approve' ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <FaCheck className="mr-2" />
                        Onayla
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleAction('reject')}
                    disabled={isProcessing}
                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center"
                  >
                    {isProcessing && action === 'reject' ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <FaTimes className="mr-2" />
                        Reddet
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Red Sebebi */}
            {approval.status === 'rejected' && approval.rejectionReason && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Red Sebebi</h2>
                <p className="text-sm text-gray-700">{approval.rejectionReason}</p>
              </div>
            )}

            {/* Başvuru Durumu */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Başvuru Durumu</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Başvuru Tarihi</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(approval.appliedAt).toLocaleDateString('tr-TR')}
                  </span>
                </div>
                
                {approval.reviewedAt && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">İnceleme Tarihi</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(approval.reviewedAt).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                )}
                
                {approval.reviewedBy && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">İnceleyen</span>
                    <span className="text-sm font-medium text-gray-900">{approval.reviewedBy}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Durum</span>
                  <span className={`text-sm font-medium ${getStatusClass(approval.status)}`}>
                    {getStatusText(approval.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Not Ekleme */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Not Ekle</h2>
              
              <div className="space-y-3">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Not ekleyin..."
                />
                <button
                  onClick={() => handleAction('addNotes')}
                  disabled={isProcessing || !notes.trim()}
                  className="w-full bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center"
                >
                  {isProcessing && action === 'addNotes' ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <FaEdit className="mr-2" />
                      Not Ekle
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Mülakat Notları */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Mülakat Notları</h2>
              
              <div className="space-y-3">
                <textarea
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mülakat notları ekleyin..."
                />
                <button
                  onClick={() => handleAction('addInterviewNotes')}
                  disabled={isProcessing || !interviewNotes.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center"
                >
                  {isProcessing && action === 'addInterviewNotes' ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <FaEdit className="mr-2" />
                      Mülakat Notu Ekle
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Mevcut Notlar */}
            {approval.notes && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Mevcut Notlar</h2>
                <div className="text-sm text-gray-700 whitespace-pre-line">{approval.notes}</div>
              </div>
            )}

            {/* Mülakat Notları */}
            {approval.interviewNotes && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Mülakat Notları</h2>
                <div className="text-sm text-gray-700 whitespace-pre-line">{approval.interviewNotes}</div>
              </div>
            )}

            {/* Hızlı Erişim */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Hızlı Erişim</h2>
              
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center">
                  <FaPaperPlane className="mr-2" />
                  Email Gönder
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center">
                  <FaPhone className="mr-2" />
                  Telefon Et
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center">
                  <FaDownload className="mr-2" />
                  Rapor Oluştur
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center">
                  <FaEdit className="mr-2" />
                  Düzenle
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
