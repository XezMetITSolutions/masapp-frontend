// Netlify DNS kurulum yardımcı fonksiyonları

export interface NetlifyDomainInfo {
  subdomain: string;
  domain: string;
  cnameRecord: string;
  status: 'pending' | 'active' | 'error';
  sslStatus: 'pending' | 'active' | 'error';
  createdAt: string;
}

// Netlify DNS kurulum rehberi oluştur
export const generateNetlifySetupGuide = (subdomain: string) => {
  const domainInfo: NetlifyDomainInfo = {
    subdomain,
    domain: `${subdomain}.guzellestir.com`,
    cnameRecord: 'masapp-frontend.netlify.app',
    status: 'pending',
    sslStatus: 'pending',
    createdAt: new Date().toISOString()
  };

  return {
    steps: [
      {
        id: 1,
        title: "Netlify Dashboard'a Git",
        description: "Netlify hesabınızda domain yönetim sayfasına gidin",
        action: "Domain Management → Add Domain",
        command: `${domainInfo.domain}`,
        url: "https://app.netlify.com/sites/your-site/domain-management",
        icon: "🌐"
      },
      {
        id: 2,
        title: "Domain Ekle",
        description: "Yeni domain olarak subdomain'inizi ekleyin",
        action: "Add Domain → Custom Domain",
        command: `${domainInfo.domain}`,
        url: null,
        icon: "➕"
      },
      {
        id: 3,
        title: "DNS Kaydını Kontrol Et",
        description: "CNAME kaydının doğru olduğundan emin olun",
        action: "DNS ayarlarında kontrol edin",
        command: `CNAME: ${domainInfo.subdomain} → ${domainInfo.cnameRecord}`,
        url: null,
        icon: "🔍"
      },
      {
        id: 4,
        title: "SSL Sertifikasını Bekle",
        description: "Netlify otomatik SSL sertifikası oluşturacak",
        action: "5-10 dakika bekleyin",
        command: "SSL: Let's Encrypt (Otomatik)",
        url: null,
        icon: "🔒"
      },
      {
        id: 5,
        title: "Panel Linklerini Test Et",
        description: "Restoran panellerinin çalıştığını kontrol edin",
        action: "Linklere tıklayarak test edin",
        command: "Tüm paneller aktif olacak",
        url: `https://${domainInfo.domain}/demo/menu`,
        icon: "✅"
      }
    ],
    panelLinks: [
      {
        name: "Dashboard",
        url: `https://${domainInfo.domain}/business/dashboard`,
        description: "Restoran yönetim paneli"
      },
    {
      name: "Menü",
      url: `https://${domainInfo.domain}/menu`,
      description: "Müşteri menü sayfası"
    },
      {
        name: "Garson Paneli",
        url: `https://${domainInfo.domain}/business/waiter`,
        description: "Garson sipariş paneli"
      },
      {
        name: "Mutfak Paneli",
        url: `https://${domainInfo.domain}/kitchen`,
        description: "Mutfak sipariş paneli"
      },
      {
        name: "Kasa Paneli",
        url: `https://${domainInfo.domain}/business/cashier`,
        description: "Ödeme ve kasa paneli"
      }
    ]
  };
};

// Domain durumunu kontrol et (simüle edilmiş)
export const checkDomainStatus = async (subdomain: string): Promise<NetlifyDomainInfo> => {
  // Gerçek uygulamada Netlify API'si ile kontrol edilir
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        subdomain,
        domain: `${subdomain}.guzellestir.com`,
        cnameRecord: 'masapp-frontend.netlify.app',
        status: 'active',
        sslStatus: 'active',
        createdAt: new Date().toISOString()
      });
    }, 2000);
  });
};

// DNS yayılma durumunu kontrol et
export const checkDNSPropagation = async (domain: string): Promise<boolean> => {
  // Gerçek uygulamada DNS lookup yapılır
  try {
    // Simüle edilmiş kontrol
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });
  } catch (error) {
    return false;
  }
};

// SSL sertifika durumunu kontrol et
export const checkSSLStatus = async (domain: string): Promise<'pending' | 'active' | 'error'> => {
  // Gerçek uygulamada Netlify API'si ile kontrol edilir
  return new Promise((resolve) => {
    setTimeout(() => resolve('active'), 1500);
  });
};

// Domain kurulum rehberi için Netlify linklerini oluştur
export const generateNetlifyLinks = (siteName: string = 'your-site') => {
  return {
    dashboard: `https://app.netlify.com/sites/${siteName}`,
    domainManagement: `https://app.netlify.com/sites/${siteName}/domain-management`,
    dnsSettings: `https://app.netlify.com/sites/${siteName}/domain-management/dns`,
    sslSettings: `https://app.netlify.com/sites/${siteName}/domain-management/ssl`
  };
};

// Domain kurulum durumunu localStorage'a kaydet
export const saveDomainSetupStatus = (domainInfo: NetlifyDomainInfo) => {
  const existingDomains = JSON.parse(localStorage.getItem('masapp-domains') || '[]');
  const updatedDomains = [...existingDomains.filter((d: NetlifyDomainInfo) => d.subdomain !== domainInfo.subdomain), domainInfo];
  localStorage.setItem('masapp-domains', JSON.stringify(updatedDomains));
};

// Tüm domain kurulum durumlarını getir
export const getAllDomainStatuses = (): NetlifyDomainInfo[] => {
  return JSON.parse(localStorage.getItem('masapp-domains') || '[]');
};

// Domain kurulum durumunu güncelle
export const updateDomainStatus = (subdomain: string, status: NetlifyDomainInfo['status']) => {
  const domains = getAllDomainStatuses();
  const updatedDomains = domains.map((d: NetlifyDomainInfo) => 
    d.subdomain === subdomain ? { ...d, status } : d
  );
  localStorage.setItem('masapp-domains', JSON.stringify(updatedDomains));
};
