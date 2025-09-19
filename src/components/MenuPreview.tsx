'use client';

import { useState } from 'react';
import { FaFire, FaClock, FaUtensils, FaTag, FaEye, FaEyeSlash } from 'react-icons/fa';
import { LanguageProvider } from '@/context/LanguageContext';
import OptimizedImage from '@/components/OptimizedImage';
import LanguageSelector from '@/components/LanguageSelector';
import TranslatedText from '@/components/TranslatedText';

interface MenuPreviewProps {
  items: any[];
  categories: any[];
  subcategories: any[];
  getItemsByCategory: (categoryId: string) => any[];
  getSubcategoriesByParent: (parentId: string) => any[];
  onEditItem: (item: any) => void;
  onToggleAvailability: (itemId: string) => void;
}

function MenuPreviewContent({
  items,
  categories,
  subcategories,
  getItemsByCategory,
  getSubcategoriesByParent,
  onEditItem,
  onToggleAvailability
}: MenuPreviewProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUnavailable, setShowUnavailable] = useState(false);

  const filteredItems = items.filter(item => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
    const availabilityMatch = showUnavailable || item.isAvailable !== false;
    return categoryMatch && availabilityMatch;
  });

  const groupedItems = selectedCategory === 'all' 
    ? categories.reduce((acc, category) => {
        const categoryItems = getItemsByCategory(category.id);
        if (categoryItems.length > 0) {
          acc[category.id] = {
            category,
            items: categoryItems.filter(item => showUnavailable || item.isAvailable !== false)
          };
        }
        return acc;
      }, {} as any)
    : {
        [selectedCategory]: {
          category: categories.find(c => c.id === selectedCategory),
          items: filteredItems
        }
      };

  return (
    <div className="space-y-6">
      {/* Kontroller */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all"><TranslatedText>Tüm Kategoriler</TranslatedText></option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name.tr}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showUnavailable}
                onChange={(e) => setShowUnavailable(e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">
                <TranslatedText>Mevcut olmayan ürünleri göster</TranslatedText>
              </span>
            </label>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
                viewMode === 'grid'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaUtensils />
              <TranslatedText>Grid</TranslatedText>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
                viewMode === 'list'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaTag />
              <TranslatedText>Liste</TranslatedText>
            </button>
          </div>
        </div>
      </div>

      {/* Menü İçeriği */}
      <div className="space-y-8">
        {Object.entries(groupedItems).map(([categoryId, group]: [string, any]) => (
          <div key={categoryId} className="space-y-4">
            {/* Kategori Başlığı */}
            <div className="flex items-center gap-4">
              {group.category.image && (
                <OptimizedImage
                  src={group.category.image}
                  alt={group.category.name.tr}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {group.category.name.tr}
                </h2>
                {group.category.description?.tr && (
                  <p className="text-gray-600 mt-1">
                    {group.category.description.tr}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  {group.items.length} <TranslatedText>ürün</TranslatedText>
                </p>
              </div>
            </div>

            {/* Alt Kategoriler */}
            {getSubcategoriesByParent(categoryId)?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {getSubcategoriesByParent(categoryId).map(subcategory => {
                  const subcategoryItems = group.items.filter((item: any) => item.subcategory === subcategory.id);
                  if (subcategoryItems.length === 0) return null;
                  
                  return (
                    <div key={subcategory.id} className="bg-gray-100 rounded-lg p-3">
                      <h3 className="font-semibold text-gray-900">
                        {subcategory.name.tr}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {subcategoryItems.length} <TranslatedText>ürün</TranslatedText>
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Ürünler */}
            <div className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {group.items.map((item: any) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-lg shadow-sm border overflow-hidden transition-all hover:shadow-md ${
                    item.isAvailable === false ? 'opacity-60' : ''
                  }`}
                >
                  {viewMode === 'grid' ? (
                    <div className="space-y-4">
                      {/* Görsel */}
                      <div className="relative">
                        <OptimizedImage
                          src={item.image || '/placeholder-food.jpg'}
                          alt={item.name.tr}
                          width={800}
                          height={384}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                          {item.popular && (
                            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                              <FaFire />
                              <TranslatedText>Popüler</TranslatedText>
                            </span>
                          )}
                          <button
                            onClick={() => onToggleAvailability(item.id)}
                            className={`p-2 rounded-full ${
                              item.isAvailable !== false 
                                ? 'bg-green-500 text-white' 
                                : 'bg-red-500 text-white'
                            }`}
                            title={item.isAvailable !== false ? 'Mevcut' : 'Mevcut Değil'}
                          >
                            {item.isAvailable !== false ? <FaEye /> : <FaEyeSlash />}
                          </button>
                        </div>
                      </div>

                      {/* İçerik */}
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">{item.name.tr}</h3>
                          <span className="text-lg font-bold text-purple-600">₺{item.price}</span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {item.description.tr}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          {item.calories && (
                            <span className="flex items-center gap-1">
                              <FaFire />
                              {item.calories} cal
                            </span>
                          )}
                          {item.preparationTime && (
                            <span className="flex items-center gap-1">
                              <FaClock />
                              {item.preparationTime} dk
                            </span>
                          )}
                        </div>

                        {/* Malzemeler */}
                        {item.ingredients && item.ingredients.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-2">
                              <TranslatedText>Malzemeler:</TranslatedText>
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {item.ingredients.slice(0, 3).map((ingredient: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                                >
                                  {ingredient}
                                </span>
                              ))}
                              {item.ingredients.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                  +{item.ingredients.length - 3} <TranslatedText>daha</TranslatedText>
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Alerjenler */}
                        {item.allergens && item.allergens.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs text-gray-500 mb-2">
                              <TranslatedText>Alerjenler:</TranslatedText>
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {item.allergens.slice(0, 3).map((allergen: any, index: number) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs"
                                >
                                  {allergen.tr}
                                </span>
                              ))}
                              {item.allergens.length > 3 && (
                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                                  +{item.allergens.length - 3} <TranslatedText>daha</TranslatedText>
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <button
                          onClick={() => onEditItem(item)}
                          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <TranslatedText>Düzenle</TranslatedText>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center p-4 space-x-4">
                      <OptimizedImage
                        src={item.image || '/placeholder-food.jpg'}
                        alt={item.name.tr}
                        width={64}
                        height={64}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{item.name.tr}</h3>
                            <p className="text-gray-600 text-sm line-clamp-1">
                              {item.description.tr}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-bold text-purple-600">₺{item.price}</span>
                            {item.popular && (
                              <span className="block text-xs text-red-600 flex items-center gap-1">
                                <FaFire />
                                <TranslatedText>Popüler</TranslatedText>
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                          {item.calories && (
                            <span className="flex items-center gap-1">
                              <FaFire />
                              {item.calories} cal
                            </span>
                          )}
                          {item.preparationTime && (
                            <span className="flex items-center gap-1">
                              <FaClock />
                              {item.preparationTime} dk
                            </span>
                          )}
                          <button
                            onClick={() => onToggleAvailability(item.id)}
                            className={`px-2 py-1 rounded text-xs ${
                              item.isAvailable !== false 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {item.isAvailable !== false ? <TranslatedText>Mevcut</TranslatedText> : <TranslatedText>Mevcut Değil</TranslatedText>}
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => onEditItem(item)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        <TranslatedText>Düzenle</TranslatedText>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Boş Durum */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <FaUtensils className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            <TranslatedText>Ürün Bulunamadı</TranslatedText>
          </h3>
          <p className="text-gray-600">
            <TranslatedText>Seçilen kriterlere uygun ürün bulunmuyor.</TranslatedText>
          </p>
        </div>
      )}
    </div>
  );
}

export default function MenuPreview(props: MenuPreviewProps) {
  return (
    <LanguageProvider>
      <MenuPreviewContent {...props} />
    </LanguageProvider>
  );
}
