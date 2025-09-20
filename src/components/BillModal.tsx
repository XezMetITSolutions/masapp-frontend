'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaPrint, FaDownload, FaCheckCircle, FaHistory, FaMoneyBillWave } from 'react-icons/fa';
import usePaymentHistoryStore from '@/store/usePaymentHistoryStore';
import { useLanguageStore } from '@/store';

interface BillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: (orderId: number, tableNumber: number) => void;
  order: {
    id: number;
    tableNumber: number;
    guests: number;
    items: Array<{
      id: string;
      name: string;
      quantity: number;
      price: number;
      notes?: string;
    }>;
    totalAmount: number;
    orderTime: string;
  };
  restaurant: {
    name: string;
    address?: string;
    phone?: string;
    taxNumber?: string;
  };
  allowPartialPayment?: boolean; // Kısmi ödeme izni
}

export default function BillModal({ isOpen, onClose, onPaymentComplete, order, restaurant, allowPartialPayment = false }: BillModalProps) {
  const { language } = useLanguageStore();
  const [isPrinted, setIsPrinted] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [paymentType, setPaymentType] = useState<'system' | 'manual'>('system');
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [showPartialPayment, setShowPartialPayment] = useState(false);
  const [partialAmount, setPartialAmount] = useState(0);
  const [payerName, setPayerName] = useState('');
  const [selectedItems, setSelectedItems] = useState<Array<{id: string, quantity: number}>>([]);
  
  const { 
    addPayment, 
    getPaymentsByTable, 
    getTotalPaidForTable, 
    getRemainingAmountForTable 
  } = usePaymentHistoryStore();
  
  // Mevcut ödemeleri al
  const existingPayments = getPaymentsByTable(order.tableNumber);
  const totalPaid = getTotalPaidForTable(order.tableNumber);
  const remainingAmount = getRemainingAmountForTable(order.tableNumber, order.totalAmount);
  
  // Kısmi ödeme için ürün seçimi
  const handleItemSelection = (itemId: string, quantity: number) => {
    setSelectedItems(prev => {
      const existing = prev.find(item => item.id === itemId);
      if (existing) {
        if (quantity === 0) {
          return prev.filter(item => item.id !== itemId);
        }
        return prev.map(item => 
          item.id === itemId ? { ...item, quantity } : item
        );
      } else {
        return [...prev, { id: itemId, quantity }];
      }
    });
  };
  
  // Seçili ürünlerin toplam tutarını hesapla
  const getSelectedItemsTotal = () => {
    return selectedItems.reduce((total, selectedItem) => {
      const orderItem = order.items.find(item => item.id === selectedItem.id);
      return total + (orderItem ? orderItem.price * selectedItem.quantity : 0);
    }, 0);
  };

  if (!isOpen) return null;

  // Fatura hesaplamaları
  const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxRate = 0.20; // %20 KDV
  const taxAmount = subtotal * taxRate;
  const totalAmount = subtotal + taxAmount;

  const handlePrint = () => {
    const printContent = document.getElementById('bill-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Fatura - ${restaurant.name}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .restaurant-name { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
                .restaurant-info { font-size: 14px; color: #666; }
                .bill-info { margin-bottom: 20px; }
                .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                .items-table th { background-color: #f5f5f5; }
                .totals { text-align: right; margin-top: 20px; }
                .total-row { font-weight: bold; font-size: 18px; margin-top: 10px; }
                .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
        setIsPrinted(true);
      }
    }
  };

  // Kısmi ödeme işlemi
  const handlePartialPayment = () => {
    const paymentAmount = partialAmount || getSelectedItemsTotal();
    
    if (paymentAmount <= 0) {
      alert('Ödeme tutarı sıfırdan büyük olmalıdır!');
      return;
    }
    
    if (paymentAmount > remainingAmount) {
      alert('Ödeme tutarı kalan tutardan fazla olamaz!');
      return;
    }
    
    // Ödeme kaydı oluştur
    const paymentItems = selectedItems.length > 0 
      ? selectedItems.map(selectedItem => {
          const orderItem = order.items.find(item => item.id === selectedItem.id);
          return {
            id: selectedItem.id,
            name: orderItem?.name || '',
            quantity: selectedItem.quantity,
            price: orderItem?.price || 0
          };
        })
      : order.items.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        }));
    
    addPayment({
      orderId: order.id.toString(),
      tableNumber: order.tableNumber,
      amount: paymentAmount,
      method: paymentType === 'system' ? 'mobile' : 'cash',
      items: paymentItems,
      payerName: payerName || undefined,
      isPartial: true,
      remainingAmount: remainingAmount - paymentAmount
    });
    
    // Bildirim gönder
    const paymentNotification = {
      type: 'partial_payment',
      tableNumber: order.tableNumber,
      orderId: order.id,
      amount: paymentAmount,
      payerName: payerName || 'Anonim',
      remainingAmount: remainingAmount - paymentAmount,
      timestamp: new Date().toISOString(),
      message: `${payerName || 'Bir müşteri'} ${paymentAmount.toFixed(2)} ₺ ödeme yaptı. Kalan: ${(remainingAmount - paymentAmount).toFixed(2)} ₺`
    };
    
    const existingNotifications = JSON.parse(localStorage.getItem('customer_notifications') || '[]');
    existingNotifications.push(paymentNotification);
    localStorage.setItem('customer_notifications', JSON.stringify(existingNotifications));
    
    // Form sıfırla
    setPartialAmount(0);
    setPayerName('');
    setSelectedItems([]);
    setShowPartialPayment(false);
    
    // Eğer tam ödeme yapıldıysa masayı kapat
    if (remainingAmount - paymentAmount <= 0) {
      onPaymentComplete(order.id, order.tableNumber);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  const handleMarkAsPaid = () => {
    setIsPaid(true);
    
    if (paymentType === 'system') {
      // Sistem ödemesi - müşteri cihazından ödeme yapacak
      console.log('💳 Sistem ödemesi seçildi - Müşteri cihazından ödeme yapılacak');
      
      // Müşteri menüsüne ödeme bildirimi gönder
      const paymentNotification = {
        type: 'payment_request',
        tableNumber: order.tableNumber,
        orderId: order.id,
        totalAmount: order.totalAmount,
        timestamp: new Date().toISOString(),
        message: 'Ödeme yapmak için cihazınızı kullanın'
      };
      
      const existingNotifications = JSON.parse(localStorage.getItem('customer_notifications') || '[]');
      existingNotifications.push(paymentNotification);
      localStorage.setItem('customer_notifications', JSON.stringify(existingNotifications));
      
    } else {
      // Manuel ödeme - garson/kasa ile ödeme
      console.log('💰 Manuel ödeme seçildi - Garson/Kasa ile ödeme yapılacak');
      console.log('📋 Herkes kendi hesabını söyleyecek - Manuel hesaplama gerekli');
    }
    
    // Ödeme tamamlandığında sepet sıfırlama işlemini başlat
    onPaymentComplete(order.id, order.tableNumber);
    
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Fatura</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            <FaTimes />
          </button>
        </div>

        {/* Fatura İçeriği */}
        <div id="bill-content" className="p-6">
          {/* Restoran Bilgileri */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{restaurant.name}</h1>
            {restaurant.address && (
              <p className="text-gray-600 mb-1">{restaurant.address}</p>
            )}
            {restaurant.phone && (
              <p className="text-gray-600 mb-1">Tel: {restaurant.phone}</p>
            )}
            {restaurant.taxNumber && (
              <p className="text-gray-600">Vergi No: {restaurant.taxNumber}</p>
            )}
          </div>

          {/* Fatura Bilgileri */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-gray-600">Fatura No: #{order.id.toString().padStart(6, '0')}</p>
                <p className="text-gray-600">Tarih: {new Date().toLocaleDateString('tr-TR')}</p>
                <p className="text-gray-600">Saat: {new Date().toLocaleTimeString('tr-TR')}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Masa: {order.tableNumber}</p>
                <p className="text-gray-600">Misafir: {order.guests} kişi</p>
              </div>
            </div>
          </div>

          {/* Ürünler Tablosu */}
          <table className="w-full border-collapse border border-gray-300 mb-6">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left">Ürün</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Adet</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Birim Fiyat</th>
                <th className="border border-gray-300 px-4 py-2 text-right">Toplam</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {item.notes && (
                        <p className="text-sm text-gray-500 italic">{item.notes}</p>
                      )}
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">{item.quantity}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{item.price.toFixed(2)} ₺</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{(item.price * item.quantity).toFixed(2)} ₺</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Toplam Hesaplamaları */}
          <div className="text-right space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Ara Toplam:</span>
              <span className="font-medium">{subtotal.toFixed(2)} ₺</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">KDV (%20):</span>
              <span className="font-medium">{taxAmount.toFixed(2)} ₺</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Toplam:</span>
              <span className="text-purple-600">{totalAmount.toFixed(2)} ₺</span>
            </div>
            
            {/* Ödeme Durumu */}
            {totalPaid > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Ödenen:</span>
                  <span className="font-medium text-blue-800">{totalPaid.toFixed(2)} ₺</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-700">Kalan:</span>
                  <span className="font-medium text-blue-800">{remainingAmount.toFixed(2)} ₺</span>
                </div>
              </div>
            )}
          </div>

          {/* Ödeme Durumu */}
          {isPaid && (
            <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg text-center">
              <FaCheckCircle className="text-green-600 text-2xl mx-auto mb-2" />
              <p className="text-green-800 font-medium">Ödeme Alındı!</p>
            </div>
          )}
        </div>

        {/* Footer Butonları */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FaPrint size={16} />
              Yazdır
            </button>
            <button
              onClick={() => {
                // PDF indirme simülasyonu
                const element = document.createElement('a');
                const file = new Blob([document.getElementById('bill-content')?.innerHTML || ''], {type: 'text/html'});
                element.href = URL.createObjectURL(file);
                element.download = `fatura-${order.id}.html`;
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FaDownload size={16} />
              İndir
            </button>
            
            {/* Ödeme Geçmişi Butonu */}
            {existingPayments.length > 0 && (
              <button
                onClick={() => setShowPaymentHistory(!showPaymentHistory)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FaHistory size={16} />
                Ödeme Geçmişi
              </button>
            )}
            
            {/* Kısmi Ödeme Butonu */}
            {allowPartialPayment && remainingAmount > 0 && (
              <button
                onClick={() => setShowPartialPayment(!showPartialPayment)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <FaMoneyBillWave size={16} />
                Kısmi Ödeme
              </button>
            )}
          </div>
          
          {/* Ödeme Türü Seçimi */}
          {!isPaid && !showPartialPayment && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Ödeme Türü</h3>
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                  <input
                    type="radio"
                    name="paymentType"
                    value="system"
                    checked={paymentType === 'system'}
                    onChange={(e) => setPaymentType(e.target.value as 'system' | 'manual')}
                    className="mr-3 text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-gray-800">Sistem Ödemesi</div>
                    <div className="text-sm text-gray-600">Müşteri kendi cihazından ödeme yapacak</div>
                  </div>
                </label>
                
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                  <input
                    type="radio"
                    name="paymentType"
                    value="manual"
                    checked={paymentType === 'manual'}
                    onChange={(e) => setPaymentType(e.target.value as 'system' | 'manual')}
                    className="mr-3 text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-gray-800">Manuel Ödeme</div>
                    <div className="text-sm text-gray-600">Garson/Kasa ile ödeme - Herkes kendi hesabını söyler</div>
                  </div>
                </label>
              </div>
            </div>
          )}

          <button
            onClick={handleMarkAsPaid}
            disabled={isPaid}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isPaid 
                ? 'bg-green-600 text-white cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isPaid ? 'Ödeme Alındı' : 'Ödeme Alındı Olarak İşaretle'}
          </button>
        </div>
        
        {/* Ödeme Geçmişi Modal */}
        {showPaymentHistory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-bold text-gray-800">Ödeme Geçmişi - Masa {order.tableNumber}</h3>
                <button
                  onClick={() => setShowPaymentHistory(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="p-6">
                {existingPayments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Henüz ödeme yapılmamış.</p>
                ) : (
                  <div className="space-y-4">
                    {existingPayments.map((payment, index) => (
                      <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-gray-800">
                              {payment.payerName || 'Anonim'} - {payment.amount.toFixed(2)} ₺
                            </h4>
                            <p className="text-sm text-gray-600">
                              {new Date(payment.timestamp).toLocaleString('tr-TR')}
                            </p>
                            <p className="text-sm text-gray-600">
                              Ödeme Yöntemi: {payment.method === 'cash' ? 'Nakit' : payment.method === 'card' ? 'Kart' : 'Mobil'}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            payment.isPartial ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {payment.isPartial ? 'Kısmi' : 'Tam'}
                          </span>
                        </div>
                        
                        {payment.items.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-700 mb-2">Ödenen Ürünler:</p>
                            <div className="space-y-1">
                              {payment.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="flex justify-between text-sm text-gray-600">
                                  <span>{typeof item.name === 'string' ? item.name : (item.name[language] || item.name.en || item.name.tr || '')} x {item.quantity}</span>
                                  <span>{(item.price * item.quantity).toFixed(2)} ₺</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Toplam Ödenen:</span>
                        <span className="text-green-600">{totalPaid.toFixed(2)} ₺</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold">
                        <span>Kalan Tutar:</span>
                        <span className="text-orange-600">{remainingAmount.toFixed(2)} ₺</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Kısmi Ödeme Modal */}
        {showPartialPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-bold text-gray-800">Kısmi Ödeme - Masa {order.tableNumber}</h3>
                <button
                  onClick={() => setShowPartialPayment(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex justify-between text-lg font-bold mb-4">
                    <span>Kalan Tutar:</span>
                    <span className="text-orange-600">{remainingAmount.toFixed(2)} ₺</span>
                  </div>
                </div>
                
                {/* Ödeme Türü Seçimi */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-4 text-gray-800">Ödeme Türü</h4>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                      <input
                        type="radio"
                        name="partialPaymentType"
                        value="system"
                        checked={paymentType === 'system'}
                        onChange={(e) => setPaymentType(e.target.value as 'system' | 'manual')}
                        className="mr-3 text-blue-600"
                      />
                      <div>
                        <div className="font-medium text-gray-800">Sistem Ödemesi</div>
                        <div className="text-sm text-gray-600">Müşteri kendi cihazından ödeme yapacak</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                      <input
                        type="radio"
                        name="partialPaymentType"
                        value="manual"
                        checked={paymentType === 'manual'}
                        onChange={(e) => setPaymentType(e.target.value as 'system' | 'manual')}
                        className="mr-3 text-blue-600"
                      />
                      <div>
                        <div className="font-medium text-gray-800">Manuel Ödeme</div>
                        <div className="text-sm text-gray-600">Garson/Kasa ile ödeme</div>
                      </div>
                    </label>
                  </div>
                </div>
                
                {/* Ödeme Yapan Kişi */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ödeme Yapan Kişi (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    placeholder="Adınızı girin..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {/* Ürün Seçimi */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-4 text-gray-800">Ödenecek Ürünleri Seçin</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {order.items.map((item) => {
                      const selectedItem = selectedItems.find(si => si.id === item.id);
                      const selectedQuantity = selectedItem?.quantity || 0;
                      
                      return (
                        <div key={item.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{item.name}</p>
                            <p className="text-sm text-gray-600">{item.price.toFixed(2)} ₺ x {item.quantity}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleItemSelection(item.id, Math.max(0, selectedQuantity - 1))}
                              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                              disabled={selectedQuantity === 0}
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{selectedQuantity}</span>
                            <button
                              onClick={() => handleItemSelection(item.id, Math.min(item.quantity, selectedQuantity + 1))}
                              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                              disabled={selectedQuantity >= item.quantity}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {selectedItems.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-700">Seçili Ürünler Toplamı:</span>
                        <span className="font-medium text-blue-800">{getSelectedItemsTotal().toFixed(2)} ₺</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Manuel Tutar Girişi */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Veya Manuel Tutar Girin
                  </label>
                  <input
                    type="number"
                    value={partialAmount}
                    onChange={(e) => setPartialAmount(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    min="0"
                    max={remainingAmount}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maksimum: {remainingAmount.toFixed(2)} ₺
                  </p>
                </div>
                
                {/* Ödeme Butonu */}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowPartialPayment(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handlePartialPayment}
                    disabled={partialAmount <= 0 && selectedItems.length === 0}
                    className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Ödeme Yap ({partialAmount > 0 ? partialAmount.toFixed(2) : getSelectedItemsTotal().toFixed(2)} ₺)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
