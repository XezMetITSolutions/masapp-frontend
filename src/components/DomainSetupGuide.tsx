'use client';

import { useState } from 'react';
import { FaCopy, FaCheck, FaExternalLinkAlt, FaGlobe, FaCog } from 'react-icons/fa';

interface DomainSetupGuideProps {
  subdomain: string;
  restaurantName: string;
  onClose: () => void;
}

export default function DomainSetupGuide({ subdomain, restaurantName, onClose }: DomainSetupGuideProps) {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(step);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const steps = [
    {
      id: 1,
      title: "Netlify'da Domain Ekle",
      description: "Netlify dashboard'unuzda domain ekleyin",
      action: "Domain Management → Add Domain",
      command: `${subdomain}.guzellestir.com`,
      url: "https://app.netlify.com/teams/your-team/sites/your-site/domain-management"
    },
    {
      id: 2,
      title: "DNS Kaydını Kontrol Et",
      description: "CNAME kaydının doğru olduğundan emin ol",
      action: "DNS ayarlarında kontrol et",
      command: `CNAME: ${subdomain}.guzellestir.com → masapp-frontend.netlify.app`,
      url: null
    },
    {
      id: 3,
      title: "SSL Sertifikasını Bekle",
      description: "Netlify otomatik SSL sertifikası oluşturacak",
      action: "5-10 dakika bekle",
      command: "SSL: Let's Encrypt (Otomatik)",
      url: null
    },
    {
      id: 4,
      title: "Panel Linklerini Test Et",
      description: "Restoran panellerinin çalıştığını kontrol et",
      action: "Linklere tıklayarak test et",
      command: "Tüm paneller aktif olacak",
      url: `https://${subdomain}.guzellestir.com/demo/menu`
    }
  ];

  const panelLinks = [
    {
      name: "Dashboard",
      url: `https://${subdomain}.guzellestir.com/business/dashboard`,
      description: "Restoran yönetim paneli"
    },
    {
      name: "Menü",
      url: `https://${subdomain}.guzellestir.com/demo/menu`,
      description: "Müşteri menü sayfası"
    },
    {
      name: "Garson Paneli",
      url: `https://${subdomain}.guzellestir.com/business/waiter`,
      description: "Garson sipariş paneli"
    },
    {
      name: "Mutfak Paneli",
      url: `https://${subdomain}.guzellestir.com/kitchen`,
      description: "Mutfak sipariş paneli"
    },
    {
      name: "Kasa Paneli",
      url: `https://${subdomain}.guzellestir.com/business/cashier`,
      description: "Ödeme ve kasa paneli"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                🌐 Domain Kurulum Rehberi
              </h2>
              <p className="text-gray-600 mt-1">
                <strong>{restaurantName}</strong> için <strong>{subdomain}.guzellestir.com</strong> domain'ini kurun
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaCheck className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Steps */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Kurulum Adımları */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Kurulum Adımları</h3>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                            {step.id}
                          </span>
                          <h4 className="font-semibold text-gray-900">{step.title}</h4>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{step.description}</p>
                        <p className="text-blue-600 text-sm font-medium mb-3">{step.action}</p>
                        
                        {/* Command Box */}
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <div className="flex items-center justify-between">
                            <code className="text-sm text-gray-800 font-mono">{step.command}</code>
                            <button
                              onClick={() => copyToClipboard(step.command, step.id)}
                              className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
                            >
                              {copiedStep === step.id ? (
                                <FaCheck className="w-4 h-4 text-green-600" />
                              ) : (
                                <FaCopy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* URL Link */}
                        {step.url && (
                          <a
                            href={step.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                          >
                            <FaExternalLinkAlt className="w-3 h-3 mr-1" />
                            {step.url.includes('netlify') ? 'Netlify Dashboard' : 'Test Et'}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel Linkleri */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🔗 Panel Linkleri</h3>
              <div className="space-y-3">
                {panelLinks.map((panel, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{panel.name}</h4>
                      <a
                        href={panel.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                      >
                        <FaExternalLinkAlt className="w-3 h-3 mr-1" />
                        Aç
                      </a>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{panel.description}</p>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <code className="text-xs text-gray-800 font-mono break-all">{panel.url}</code>
                    </div>
                  </div>
                ))}
              </div>

              {/* Status Check */}
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <FaGlobe className="w-5 h-5 text-yellow-600 mr-2" />
                  <h4 className="font-semibold text-yellow-800">Domain Durumu</h4>
                </div>
                <p className="text-yellow-700 text-sm mb-3">
                  Domain kurulumu tamamlandıktan sonra tüm paneller otomatik olarak aktif olacak.
                </p>
                <div className="flex items-center text-yellow-700 text-sm">
                  <FaCog className="w-4 h-4 mr-2 animate-spin" />
                  DNS yayılması: 5-10 dakika
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>💡 <strong>İpucu:</strong> Domain kurulumu tamamlandıktan sonra bu rehberi kapatabilirsiniz.</p>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Anladım
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
