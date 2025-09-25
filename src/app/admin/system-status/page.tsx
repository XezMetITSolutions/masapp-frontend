'use client';

import { useState, useEffect } from 'react';
import { 
  FaServer, 
  FaDatabase, 
  FaCloud, 
  FaShieldAlt, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaTimesCircle,
  FaClock,
  FaMemory,
  FaHdd,
  FaNetworkWired,
  FaMicrochip,
  FaChartLine,
  FaSync,
  FaInfoCircle
} from 'react-icons/fa';
import AdminLayout from '@/components/AdminLayout';

export default function SystemStatus() {
  const [systemStats, setSystemStats] = useState({
    server: {
      status: 'online',
      uptime: '99.9%',
      responseTime: '45ms',
      cpu: 23,
      memory: 67,
      disk: 45
    },
    database: {
      status: 'online',
      connections: 156,
      queries: 1250,
      size: '2.4GB'
    },
    services: [
      { name: 'API Gateway', status: 'online', uptime: '99.9%' },
      { name: 'Authentication', status: 'online', uptime: '99.8%' },
      { name: 'Payment Service', status: 'online', uptime: '99.7%' },
      { name: 'Notification Service', status: 'online', uptime: '99.9%' },
      { name: 'Analytics Service', status: 'online', uptime: '99.6%' },
      { name: 'File Storage', status: 'online', uptime: '99.8%' }
    ],
    recentIncidents: [
      {
        id: 1,
        title: 'API Response Time Increase',
        severity: 'warning',
        time: '2 hours ago',
        description: 'API response times increased by 200ms due to high traffic'
      },
      {
        id: 2,
        title: 'Database Connection Pool Exhausted',
        severity: 'critical',
        time: '1 day ago',
        description: 'Database connection pool reached maximum capacity'
      },
      {
        id: 3,
        title: 'Payment Service Maintenance',
        severity: 'info',
        time: '3 days ago',
        description: 'Scheduled maintenance completed successfully'
      }
    ]
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      case 'offline': return 'text-gray-600 bg-gray-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return FaCheckCircle;
      case 'warning': return FaExclamationTriangle;
      case 'critical': return FaTimesCircle;
      case 'offline': return FaTimesCircle;
      default: return FaInfoCircle;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-200 bg-red-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'info': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <AdminLayout 
      title="Sistem Durumu" 
      description="Sistem performansı ve servis durumu izleme"
    >
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Sunucu Durumu</h3>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(systemStats.server.status)}`}>
              {systemStats.server.status.toUpperCase()}
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Uptime</span>
              <span className="font-medium">{systemStats.server.uptime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Response Time</span>
              <span className="font-medium">{systemStats.server.responseTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">CPU Usage</span>
              <span className="font-medium">{systemStats.server.cpu}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Memory</span>
              <span className="font-medium">{systemStats.server.memory}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Disk</span>
              <span className="font-medium">{systemStats.server.disk}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Veritabanı</h3>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(systemStats.database.status)}`}>
              {systemStats.database.status.toUpperCase()}
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Aktif Bağlantılar</span>
              <span className="font-medium">{systemStats.database.connections}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sorgu/Saat</span>
              <span className="font-medium">{systemStats.database.queries}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Boyut</span>
              <span className="font-medium">{systemStats.database.size}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Sistem Sağlığı</h3>
            <div className="flex items-center text-green-600">
              <FaCheckCircle className="mr-2" />
              <span className="text-sm font-medium">Sağlıklı</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Aktif Servisler</span>
              <span className="font-medium">{systemStats.services.filter(s => s.status === 'online').length}/{systemStats.services.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Son Güncelleme</span>
              <span className="font-medium">2 dk önce</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ortalama Uptime</span>
              <span className="font-medium">99.8%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Services Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Servis Durumu</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {systemStats.services.map((service, index) => {
                const StatusIcon = getStatusIcon(service.status);
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <StatusIcon className={`mr-3 ${getStatusColor(service.status).split(' ')[0]}`} />
                      <div>
                        <p className="font-medium text-gray-900">{service.name}</p>
                        <p className="text-sm text-gray-500">Uptime: {service.uptime}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(service.status)}`}>
                      {service.status.toUpperCase()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Son Olaylar</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {systemStats.recentIncidents.map((incident) => (
                <div key={incident.id} className={`p-4 rounded-lg border ${getSeverityColor(incident.severity)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{incident.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{incident.description}</p>
                    </div>
                    <span className="text-xs text-gray-500 ml-4">{incident.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Performans Metrikleri</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaMicrochip className="text-blue-600 text-2xl" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{systemStats.server.cpu}%</p>
              <p className="text-sm text-gray-600">CPU Kullanımı</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaMemory className="text-green-600 text-2xl" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{systemStats.server.memory}%</p>
              <p className="text-sm text-gray-600">Bellek Kullanımı</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaHdd className="text-yellow-600 text-2xl" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{systemStats.server.disk}%</p>
              <p className="text-sm text-gray-600">Disk Kullanımı</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaNetworkWired className="text-purple-600 text-2xl" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{systemStats.server.responseTime}</p>
              <p className="text-sm text-gray-600">Yanıt Süresi</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}


