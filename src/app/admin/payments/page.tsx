'use client';

import { useState, useEffect } from 'react';
import ModernAdminLayout from '@/components/ModernAdminLayout';
import { 
  FaCreditCard, 
  FaPlus, 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaMoneyBillWave,
  FaStore,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
  FaEdit,
  FaTrash
} from 'react-icons/fa';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [showNewPaymentModal, setShowNewPaymentModal] = useState(false);
  const [newPayment, setNewPayment] = useState({
    restaurant: '',
    amount: '',
    method: 'credit_card',
    status: 'completed',
    description: ''
  });

  // localStorage'dan ödemeleri yükle
  useEffect(() => {
    const savedPayments = localStorage.getItem('masapp-payments');
    if (savedPayments) {
      setPayments(JSON.parse(savedPayments));
    }
  }, []);

  // Ödemeleri localStorage'a kaydet
  const savePaymentsToStorage = (newPayments: any[]) => {
    localStorage.setItem('masapp-payments', JSON.stringify(newPayments));
  };

  // Yeni ödeme ekle
  const handleCreatePayment = () => {
    if (!newPayment.restaurant || !newPayment.amount) {
      alert('Lütfen restoran ve tutar alanlarını doldurun.');
      return;
    }

    const payment = {
      id: `payment-${Date.now()}`,
      restaurant: newPayment.restaurant,
      amount: parseFloat(newPayment.amount),
      method: newPayment.method,
      status: newPayment.status,
      description: newPayment.description,
      date: new Date().toLocaleString('tr-TR'),
      transactionId: `TXN-${Date.now().toString().slice(-6)}`
    };

    const updatedPayments = [payment, ...payments];
    setPayments(updatedPayments);
    savePaymentsToStorage(updatedPayments);
    
    setNewPayment({
      restaurant: '',
      amount: '',
      method: 'credit_card',
      status: 'completed',
      description: ''
    });
    setShowNewPaymentModal(false);
    
    alert('Ödeme başarıyla oluşturuldu!');
  };

  // Ödeme sil
  const handleDeletePayment = (paymentId: string) => {
    if (confirm('Bu ödemeyi silmek istediğinizden emin misiniz?')) {
      const updatedPayments = payments.filter(payment => payment.id !== paymentId);
      setPayments(updatedPayments);
      savePaymentsToStorage(updatedPayments);
      alert('Ödeme başarıyla silindi!');
    }
  };

  // Ödeme düzenle
  const handleEditPayment = (paymentId: string) => {
    const paymentToEdit = payments.find(payment => payment.id === paymentId);
    if (paymentToEdit) {
      setNewPayment({
        restaurant: paymentToEdit.restaurant,
        amount: paymentToEdit.amount.toString(),
        method: paymentToEdit.method,
        status: paymentToEdit.status,
        description: paymentToEdit.description || ''
      });
      setShowNewPaymentModal(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Tamamlandı';
      case 'failed':
        return 'Başarısız';
      case 'pending':
        return 'Beklemede';
      default:
        return 'Bilinmiyor';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return FaCheckCircle;
      case 'failed':
        return FaTimesCircle;
      case 'pending':
        return FaClock;
      default:
        return FaClock;
    }
  };

  const getMethodText = (method: string) => {
    switch (method) {
      case 'credit_card':
        return 'Kredi Kartı';
      case 'bank_transfer':
        return 'Banka Havalesi';
      case 'paypal':
        return 'PayPal';
      default:
        return 'Bilinmiyor';
    }
  };

  return (
    <ModernAdminLayout title="Ödemeler" description="Ödeme işlemlerini yönetin">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">Ödeme Yönetimi</h2>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            {payments.length} İşlem
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <FaFilter className="w-4 h-4" />
            <span>Filtrele</span>
          </button>
          <button 
            onClick={() => setShowNewPaymentModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="w-4 h-4" />
            <span>Yeni Ödeme</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Toplam Gelir</p>
              <p className="text-3xl font-bold text-gray-900">₺1,049.96</p>
            </div>
            <FaMoneyBillWave className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Başarılı</p>
              <p className="text-3xl font-bold text-green-600">
                {payments.filter(p => p.status === 'completed').length}
              </p>
            </div>
            <FaCheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Başarısız</p>
              <p className="text-3xl font-bold text-red-600">
                {payments.filter(p => p.status === 'failed').length}
              </p>
            </div>
            <FaTimesCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Beklemede</p>
              <p className="text-3xl font-bold text-yellow-600">
                {payments.filter(p => p.status === 'pending').length}
              </p>
            </div>
            <FaClock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Restoran
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutar
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yöntem
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Açıklama
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => {
                const StatusIcon = getStatusIcon(payment.status);
                return (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                          <FaStore className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{payment.restaurant}</div>
                          <div className="text-sm text-gray-500">{payment.transactionId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {payment.amount} {payment.currency}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaCreditCard className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-900">{getMethodText(payment.method)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <StatusIcon className="w-4 h-4 mr-2 text-gray-400" />
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                          {getStatusText(payment.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.createdAt}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => alert(`Ödeme Detayları:\nRestoran: ${payment.restaurant}\nTutar: ₺${payment.amount}\nYöntem: ${payment.method}\nDurum: ${getStatusText(payment.status)}\nTarih: ${payment.date}\nTransaction ID: ${payment.transactionId}`)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Görüntüle"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditPayment(payment.id)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Düzenle"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeletePayment(payment.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Sil"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                        {payment.status === 'failed' && (
                          <button 
                            onClick={() => alert('Ödeme yeniden işleme alınıyor...')}
                            className="text-yellow-600 hover:text-yellow-900 p-1"
                            title="Yeniden Dene"
                          >
                            <FaCheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Payment Modal */}
      {showNewPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-gray-800">Yeni Ödeme Ekle</h3>
              <button
                onClick={() => setShowNewPaymentModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimesCircle />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Restoran *
                  </label>
                  <input
                    type="text"
                    value={newPayment.restaurant}
                    onChange={(e) => setNewPayment({ ...newPayment, restaurant: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Restoran adını girin..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tutar (₺) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ödeme Yöntemi
                  </label>
                  <select
                    value={newPayment.method}
                    onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="credit_card">Kredi Kartı</option>
                    <option value="bank_transfer">Banka Havalesi</option>
                    <option value="paypal">PayPal</option>
                    <option value="stripe">Stripe</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durum
                  </label>
                  <select
                    value={newPayment.status}
                    onChange={(e) => setNewPayment({ ...newPayment, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="completed">Tamamlandı</option>
                    <option value="pending">Beklemede</option>
                    <option value="failed">Başarısız</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  value={newPayment.description}
                  onChange={(e) => setNewPayment({ ...newPayment, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Ödeme açıklaması girin..."
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={() => setShowNewPaymentModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleCreatePayment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <FaPlus />
                Ödeme Ekle
              </button>
            </div>
          </div>
        </div>
      )}
    </ModernAdminLayout>
  );
}
