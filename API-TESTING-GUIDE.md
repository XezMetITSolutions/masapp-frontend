# API Testing Guide - Menu Management

## 🌐 Base URL
```
Production: https://masapp-backend.onrender.com/api
Local: http://localhost:5000/api
```

## 📋 Test All Endpoints

### **1. Get Complete Menu**
```bash
GET /restaurants/:restaurantId/menu
```

**Example Request:**
```bash
curl -X GET "https://masapp-backend.onrender.com/api/restaurants/YOUR_RESTAURANT_ID/menu" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "cat-1",
        "restaurantId": "rest-1",
        "name": "Ana Yemekler",
        "description": "Lezzetli ana yemekler",
        "displayOrder": 0,
        "isActive": true
      }
    ],
    "items": [
      {
        "id": "item-1",
        "restaurantId": "rest-1",
        "categoryId": "cat-1",
        "name": "Adana Kebap",
        "description": "Acılı kıyma kebabı",
        "price": "85.00",
        "imageUrl": null,
        "displayOrder": 0,
        "isAvailable": true
      }
    ]
  }
}
```

---

### **2. Create Category**
```bash
POST /restaurants/:restaurantId/menu/categories
```

**Example Request:**
```bash
curl -X POST "https://masapp-backend.onrender.com/api/restaurants/YOUR_RESTAURANT_ID/menu/categories" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Başlangıçlar",
    "description": "Soğuk ve sıcak başlangıçlar",
    "displayOrder": 0,
    "isActive": true
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "generated-uuid",
    "restaurantId": "rest-1",
    "name": "Başlangıçlar",
    "description": "Soğuk ve sıcak başlangıçlar",
    "displayOrder": 0,
    "isActive": true,
    "createdAt": "2025-10-08T20:45:35.000Z",
    "updatedAt": "2025-10-08T20:45:35.000Z"
  }
}
```

---

### **3. Create Menu Item**
```bash
POST /restaurants/:restaurantId/menu/items
```

**Example Request:**
```bash
curl -X POST "https://masapp-backend.onrender.com/api/restaurants/YOUR_RESTAURANT_ID/menu/items" \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId": "cat-123",
    "name": "Mercimek Çorbası",
    "description": "Geleneksel mercimek çorbası",
    "price": 25,
    "displayOrder": 0,
    "isAvailable": true
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "generated-uuid",
    "restaurantId": "rest-1",
    "categoryId": "cat-123",
    "name": "Mercimek Çorbası",
    "description": "Geleneksel mercimek çorbası",
    "price": "25.00",
    "imageUrl": null,
    "displayOrder": 0,
    "isAvailable": true,
    "createdAt": "2025-10-08T20:45:35.000Z",
    "updatedAt": "2025-10-08T20:45:35.000Z"
  }
}
```

---

### **4. Update Category**
```bash
PUT /restaurants/:restaurantId/menu/categories/:categoryId
```

**Example Request:**
```bash
curl -X PUT "https://masapp-backend.onrender.com/api/restaurants/YOUR_RESTAURANT_ID/menu/categories/cat-123" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Çorbalar",
    "description": "Sıcak çorbalar",
    "isActive": true
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "cat-123",
    "restaurantId": "rest-1",
    "name": "Çorbalar",
    "description": "Sıcak çorbalar",
    "displayOrder": 0,
    "isActive": true,
    "updatedAt": "2025-10-08T20:50:00.000Z"
  }
}
```

---

### **5. Update Menu Item**
```bash
PUT /restaurants/:restaurantId/menu/items/:itemId
```

**Example Request:**
```bash
curl -X PUT "https://masapp-backend.onrender.com/api/restaurants/YOUR_RESTAURANT_ID/menu/items/item-123" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mercimek Çorbası",
    "description": "Ev yapımı mercimek çorbası",
    "price": 30,
    "isAvailable": true
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": "item-123",
    "name": "Mercimek Çorbası",
    "description": "Ev yapımı mercimek çorbası",
    "price": "30.00",
    "isAvailable": true,
    "updatedAt": "2025-10-08T20:55:00.000Z"
  }
}
```

---

### **6. Delete Category**
```bash
DELETE /restaurants/:restaurantId/menu/categories/:categoryId
```

**Example Request:**
```bash
curl -X DELETE "https://masapp-backend.onrender.com/api/restaurants/YOUR_RESTAURANT_ID/menu/categories/cat-123" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

**Note:** This will also delete all menu items in this category.

---

### **7. Delete Menu Item**
```bash
DELETE /restaurants/:restaurantId/menu/items/:itemId
```

**Example Request:**
```bash
curl -X DELETE "https://masapp-backend.onrender.com/api/restaurants/YOUR_RESTAURANT_ID/menu/items/item-123" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Menu item deleted successfully"
}
```

---

## ❌ Error Responses

### **Restaurant Not Found**
```json
{
  "success": false,
  "message": "Restaurant not found"
}
```

### **Category Not Found**
```json
{
  "success": false,
  "message": "Category not found"
}
```

### **Missing Required Fields**
```json
{
  "success": false,
  "message": "Missing required fields: name, price"
}
```

### **Database Error**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 🧪 Testing Workflow

### **Step 1: Get Restaurant ID**
First, find your restaurant ID from the database or admin panel.

### **Step 2: Create a Category**
```bash
# Create "Çorbalar" category
curl -X POST "https://masapp-backend.onrender.com/api/restaurants/YOUR_ID/menu/categories" \
  -H "Content-Type: application/json" \
  -d '{"name": "Çorbalar", "description": "Sıcak çorbalar", "displayOrder": 0, "isActive": true}'
```

### **Step 3: Create Menu Items**
```bash
# Create "Mercimek Çorbası" in the category
curl -X POST "https://masapp-backend.onrender.com/api/restaurants/YOUR_ID/menu/items" \
  -H "Content-Type: application/json" \
  -d '{"categoryId": "CATEGORY_ID", "name": "Mercimek Çorbası", "description": "Geleneksel", "price": 25, "displayOrder": 0, "isAvailable": true}'
```

### **Step 4: Verify Data**
```bash
# Get complete menu
curl -X GET "https://masapp-backend.onrender.com/api/restaurants/YOUR_ID/menu"
```

### **Step 5: Update Item**
```bash
# Update price
curl -X PUT "https://masapp-backend.onrender.com/api/restaurants/YOUR_ID/menu/items/ITEM_ID" \
  -H "Content-Type: application/json" \
  -d '{"price": 30}'
```

### **Step 6: Delete Item**
```bash
# Delete item
curl -X DELETE "https://masapp-backend.onrender.com/api/restaurants/YOUR_ID/menu/items/ITEM_ID"
```

---

## 🔍 Debugging Tips

### **1. Check if Backend is Running**
```bash
curl https://masapp-backend.onrender.com/api/health
```

### **2. Verify Database Connection**
Check Render logs for PostgreSQL connection errors.

### **3. Test with Postman**
1. Import this collection
2. Set `baseUrl` variable to your backend URL
3. Set `restaurantId` variable
4. Run all requests in sequence

### **4. Check Browser Console**
Frontend makes these calls - watch Network tab for:
- Request payload
- Response data
- Status codes

### **5. Common Issues**

**404 Error:**
- Check URL is correct
- Verify restaurant/category/item ID exists

**400 Error:**
- Missing required fields
- Check request body format

**500 Error:**
- Backend or database error
- Check Render logs

---

## 📊 Data Validation

### **Category Fields**
- `name`: **Required**, String, max 255 chars
- `description`: Optional, String
- `displayOrder`: Optional, Integer, default 0
- `isActive`: Optional, Boolean, default true

### **Menu Item Fields**
- `name`: **Required**, String, max 255 chars
- `description`: **Required**, String
- `price`: **Required**, Decimal (positive number)
- `categoryId`: **Required**, Valid category UUID
- `imageUrl`: Optional, String (URL)
- `displayOrder`: Optional, Integer, default 0
- `isAvailable`: Optional, Boolean, default true
- `preparationTime`: Optional, Integer (minutes)
- `calories`: Optional, Integer

---

## ✅ Success Criteria

- [ ] Can create category
- [ ] Can create menu item in category
- [ ] Can update category name
- [ ] Can update item price
- [ ] Can toggle item availability
- [ ] Can delete item
- [ ] Can delete category (cascades to items)
- [ ] Data persists after refresh
- [ ] All responses return proper JSON
- [ ] Turkish characters display correctly

---

**Last Updated:** 2025-10-08
**Backend:** https://masapp-backend.onrender.com
**Frontend:** https://aksaray.guzellestir.com
