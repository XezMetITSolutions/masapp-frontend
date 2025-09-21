'use client';

import { useState, useEffect } from 'react';
import { translations } from '@/data/translations';

interface TranslationItem {
  key: string;
  tr: string;
  en: string;
  de: string;
}

export default function TranslationsPage() {
  const [translationItems, setTranslationItems] = useState<TranslationItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({});
  const [editedTranslations, setEditedTranslations] = useState<{ [key: string]: { tr: string; en: string; de: string } }>({});

  useEffect(() => {
    // Çevirileri array'e dönüştür
    const items: TranslationItem[] = Object.entries(translations).map(([key, value]) => ({
      key,
      tr: value.tr,
      en: value.en,
      de: value.de
    }));
    setTranslationItems(items);
  }, []);

  const filteredItems = translationItems.filter(item =>
    item.tr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.de.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (key: string) => {
    setIsEditing(prev => ({ ...prev, [key]: true }));
    setEditedTranslations(prev => ({
      ...prev,
      [key]: {
        tr: translationItems.find(item => item.key === key)?.tr || '',
        en: translationItems.find(item => item.key === key)?.en || '',
        de: translationItems.find(item => item.key === key)?.de || ''
      }
    }));
  };

  const handleSave = (key: string) => {
    const edited = editedTranslations[key];
    if (edited) {
      setTranslationItems(prev => prev.map(item =>
        item.key === key
          ? { ...item, ...edited }
          : item
      ));
    }
    setIsEditing(prev => ({ ...prev, [key]: false }));
  };

  const handleCancel = (key: string) => {
    setIsEditing(prev => ({ ...prev, [key]: false }));
    setEditedTranslations(prev => {
      const newState = { ...prev };
      delete newState[key];
      return newState;
    });
  };

  const handleInputChange = (key: string, language: 'tr' | 'en' | 'de', value: string) => {
    setEditedTranslations(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [language]: value
      }
    }));
  };

  const generateNewTranslationsFile = () => {
    let content = '// Pre-defined translations for static export\n';
    content += 'export const translations: { [key: string]: { en: string; de: string; tr: string } } = {\n';
    
    translationItems.forEach((item, index) => {
      content += `  '${item.key}': {\n`;
      content += `    en: '${item.en.replace(/'/g, "\\'")}',\n`;
      content += `    de: '${item.de.replace(/'/g, "\\'")}',\n`;
      content += `    tr: '${item.tr.replace(/'/g, "\\'")}'\n`;
      content += `  }${index < translationItems.length - 1 ? ',' : ''}\n`;
    });
    
    content += '};\n';
    
    // Dosyayı indir
    const blob = new Blob([content], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translations.ts';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Çeviri Yönetimi</h1>
              <p className="text-gray-600 mt-2">
                Tüm çevirileri buradan yönetebilirsiniz. Değişiklikler tüm sayfalarda otomatik olarak güncellenir.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={generateNewTranslationsFile}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                📥 Çevirileri İndir
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Çeviri ara... (Türkçe, İngilizce veya Almanca)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute right-3 top-3 text-gray-400">
              🔍
            </div>
          </div>
        </div>

        {/* Translations Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-1/3">
                    🇹🇷 Türkçe
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-1/3">
                    🇬🇧 İngilizce
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-1/3">
                    🇩🇪 Almanca
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 w-32">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.key} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {isEditing[item.key] ? (
                        <textarea
                          value={editedTranslations[item.key]?.tr || ''}
                          onChange={(e) => handleInputChange(item.key, 'tr', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded resize-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                        />
                      ) : (
                        <div className="text-sm text-gray-900">
                          {item.tr}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing[item.key] ? (
                        <textarea
                          value={editedTranslations[item.key]?.en || ''}
                          onChange={(e) => handleInputChange(item.key, 'en', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded resize-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                        />
                      ) : (
                        <div className="text-sm text-gray-900">
                          {item.en}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing[item.key] ? (
                        <textarea
                          value={editedTranslations[item.key]?.de || ''}
                          onChange={(e) => handleInputChange(item.key, 'de', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded resize-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                        />
                      ) : (
                        <div className="text-sm text-gray-900">
                          {item.de}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isEditing[item.key] ? (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleSave(item.key)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            ✅ Kaydet
                          </button>
                          <button
                            onClick={() => handleCancel(item.key)}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            ❌ İptal
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(item.key)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                        >
                          ✏️ Düzenle
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{translationItems.length}</div>
              <div className="text-sm text-gray-600">Toplam Çeviri</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{filteredItems.length}</div>
              <div className="text-sm text-gray-600">Filtrelenen</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Object.keys(isEditing).filter(key => isEditing[key]).length}
              </div>
              <div className="text-sm text-gray-600">Düzenleniyor</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">3</div>
              <div className="text-sm text-gray-600">Desteklenen Dil</div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">📝 Kullanım Talimatları</h3>
          <div className="text-blue-800 space-y-2">
            <p>• <strong>Düzenle:</strong> Herhangi bir çeviriyi düzenlemek için "Düzenle" butonuna tıklayın</p>
            <p>• <strong>Kaydet:</strong> Değişikliklerinizi kaydetmek için "Kaydet" butonuna tıklayın</p>
            <p>• <strong>İptal:</strong> Değişiklikleri iptal etmek için "İptal" butonuna tıklayın</p>
            <p>• <strong>Arama:</strong> Üstteki arama kutusunu kullanarak çevirileri filtreleyin</p>
            <p>• <strong>İndir:</strong> "Çevirileri İndir" butonu ile güncellenmiş translations.ts dosyasını indirin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
