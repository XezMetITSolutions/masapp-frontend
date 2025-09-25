'use client';

import ModernAdminLayout from '@/components/ModernAdminLayout';
import { 
  FaServer, 
  FaDatabase, 
  FaCog, 
  FaMemory,
  FaMicrochip,
  FaHdd,
  FaNetworkWired,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaExclamationTriangle,
  FaSync,
  FaDownload,
  FaUpload
} from 'react-icons/fa';

export default function SystemPage() {
  const systemMetrics = {
    cpu: {
      usage: 45,
      cores: 8,
      temperature: 65
    },
    memory: {
      used: 6.2,
      total: 16,
      percentage: 38.75
    },
    disk: {
      used: 120.5,
      total: 500,
      percentage: 24.1
    },
    network: {
      upload: 12.5,
      download: 45.8,
      latency: 15
    }
  };

  const services = [
    {
      name: 'Web Server',
      status: 'running',
      uptime: '15 gün, 3 saat',
      port: 3000,
      version: '1.0.0'
    },
    {
      name: 'Database',
      status: 'running',
      uptime: '15 gün, 3 saat',
      port: 5432,
      version: 'PostgreSQL 14.0'
    },
    {
      name: 'Redis Cache',
      status: 'running',
      uptime: '15 gün, 3 saat',
      port: 6379,
      version: '6.2.0'
    },
    {
      name: 'File Storage',
      status: 'warning',
      uptime: '2 gün, 5 saat',
      port: 9000,
      version: 'MinIO 1.0.0'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'running':
        return 'Çalışıyor';
      case 'warning':
        return 'Uyarı';
      case 'error':
        return 'Hata';
      default:
        return 'Bilinmiyor';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return FaCheckCircle;
      case 'warning':
        return FaExclamationTriangle;
      case 'error':
        return FaTimesCircle;
      default:
        return FaClock;
    }
  };

  return (
    <ModernAdminLayout title="Sistem" description="Sistem durumu ve performansını izleyin">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">Sistem Yönetimi</h2>
          <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
            Sistem Sağlıklı
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <FaSync className="w-4 h-4" />
            <span>Yenile</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FaDownload className="w-4 h-4" />
            <span>Log İndir</span>
          </button>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">CPU Kullanımı</p>
              <p className="text-3xl font-bold text-gray-900">{systemMetrics.cpu.usage}%</p>
            </div>
            <FaMicrochip className="w-8 h-8 text-blue-600" />
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${systemMetrics.cpu.usage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">{systemMetrics.cpu.cores} çekirdek, {systemMetrics.cpu.temperature}°C</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Bellek Kullanımı</p>
              <p className="text-3xl font-bold text-gray-900">{systemMetrics.memory.percentage}%</p>
            </div>
            <FaMemory className="w-8 h-8 text-green-600" />
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full" 
              style={{ width: `${systemMetrics.memory.percentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">{systemMetrics.memory.used}GB / {systemMetrics.memory.total}GB</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Disk Kullanımı</p>
              <p className="text-3xl font-bold text-gray-900">{systemMetrics.disk.percentage}%</p>
            </div>
            <FaHdd className="w-8 h-8 text-purple-600" />
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full" 
              style={{ width: `${systemMetrics.disk.percentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">{systemMetrics.disk.used}GB / {systemMetrics.disk.total}GB</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Ağ Gecikmesi</p>
              <p className="text-3xl font-bold text-gray-900">{systemMetrics.network.latency}ms</p>
            </div>
            <FaNetworkWired className="w-8 h-8 text-orange-600" />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>↑ {systemMetrics.network.upload} Mbps</span>
            <span>↓ {systemMetrics.network.download} Mbps</span>
          </div>
        </div>
      </div>

      {/* Services Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Servis Durumu</h3>
          <div className="space-y-4">
            {services.map((service, index) => {
              const StatusIcon = getStatusIcon(service.status);
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <StatusIcon className={`w-5 h-5 ${getStatusColor(service.status).split(' ')[1]}`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{service.name}</p>
                      <p className="text-xs text-gray-500">Port: {service.port} | {service.version}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.status)}`}>
                      {getStatusText(service.status)}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{service.uptime}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sistem Bilgileri</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">İşletim Sistemi</span>
              <span className="text-sm font-medium text-gray-900">Ubuntu 20.04 LTS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Node.js Versiyonu</span>
              <span className="text-sm font-medium text-gray-900">v18.17.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">PostgreSQL Versiyonu</span>
              <span className="text-sm font-medium text-gray-900">14.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Redis Versiyonu</span>
              <span className="text-sm font-medium text-gray-900">6.2.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Sistem Uptime</span>
              <span className="text-sm font-medium text-gray-900">15 gün, 3 saat</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Son Güncelleme</span>
              <span className="text-sm font-medium text-gray-900">2 gün önce</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sistem İşlemleri</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center space-x-2 p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
            <FaSync className="w-5 h-5" />
            <span>Sistem Yenile</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
            <FaDownload className="w-5 h-5" />
            <span>Yedekleme Al</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-4 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors">
            <FaUpload className="w-5 h-5" />
            <span>Güncelleme Yükle</span>
          </button>
        </div>
      </div>
    </ModernAdminLayout>
  );
}