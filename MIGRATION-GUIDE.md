# Migration Guide - Menu Item Details

## Yeni Eklenen Alanlar

Backend'e aşağıdaki yeni alanlar eklendi:

1. **ingredients** (TEXT) - Malzemeler listesi (virgülle ayrılmış)
2. **allergens** (JSONB) - Alerjen dizisi
3. **portion_size** (VARCHAR) - Porsiyon boyutu

## Migration Çalıştırma

### Render.com'da Migration Çalıştırma:

1. **Render Dashboard'a git:**
   - https://dashboard.render.com

2. **Backend servisini seç:**
   - `masapp-backend` servisini bul

3. **Shell'i aç:**
   - Sağ üstteki "Shell" butonuna tıkla

4. **Migration komutunu çalıştır:**
   ```bash
   npm run migrate
   ```

   VEYA doğrudan:
   ```bash
   npx sequelize-cli db:migrate
   ```

5. **Migration başarılı olduğunu doğrula:**
   - Console'da "Migration completed successfully" mesajını gör
   - Veya database'i kontrol et

### Lokal Olarak Test Etme:

```bash
cd backend
npm run migrate
```

## Yeni Alanların Kullanımı

### Frontend'de Ürün Ekleme/Düzenleme:

Artık menü formunda şu alanlar mevcut:
- ✅ Kalori
- ✅ Hazırlık Süresi (dakika)
- ✅ Porsiyon (örn: "250g", "1 porsiyon")
- ✅ Malzemeler (textarea)
- ✅ Alerjenler (checkboxlar):
  - Gluten
  - Süt
  - Yumurta
  - Fındık
  - Fıstık
  - Soya
  - Balık
  - Kabuklu Deniz Ürünleri

### API Endpoint'leri:

Mevcut endpoint'ler otomatik olarak yeni alanları destekliyor:

**POST** `/api/restaurants/:restaurantId/menu/items`
```json
{
  "name": "Margherita Pizza",
  "description": "Klasik İtalyan pizzası",
  "price": 85,
  "categoryId": "uuid",
  "calories": 800,
  "preparationTime": 20,
  "ingredients": "Domates, mozzarella, fesleğen, zeytinyağı",
  "allergens": ["gluten", "dairy"],
  "portionSize": "30cm"
}
```

**PUT** `/api/restaurants/:restaurantId/menu/items/:itemId`
- Aynı format

## Rollback (Geri Alma)

Eğer bir sorun olursa migration'ı geri alabilirsin:

```bash
npx sequelize-cli db:migrate:undo
```

## Doğrulama

Migration başarılı olduktan sonra:

1. Frontend'de yeni bir ürün ekle
2. Tüm yeni alanları doldur
3. Kaydet
4. Ürünü düzenle ve alanların geldiğini doğrula
5. Menü listesinde ürünün göründüğünü kontrol et

## Notlar

- Mevcut ürünler için yeni alanlar `NULL` olacak (sorun değil)
- Frontend form'u geriye uyumlu - eski ürünler de çalışır
- Alerjenler JSONB olarak saklanıyor - PostgreSQL'de array olarak sorgulanabilir
