# MasApp Backend API Migration Plan

## 🎯 Objective
Replace localStorage with Render PostgreSQL backend for centralized data management.

## 📋 Required API Endpoints

### 1. Restaurant Management
```
GET    /api/restaurants                    # List all restaurants
GET    /api/restaurants/:id                # Get restaurant by ID
GET    /api/restaurants/username/:username # Get restaurant by username (subdomain)
POST   /api/restaurants                    # Create restaurant
PUT    /api/restaurants/:id                # Update restaurant
DELETE /api/restaurants/:id                # Delete restaurant
```

### 2. Restaurant Features
```
GET    /api/restaurants/:id/features       # Get restaurant features
PUT    /api/restaurants/:id/features       # Update restaurant features
POST   /api/features                       # Create new feature type
GET    /api/features                       # List all available features
```

### 3. Menu Management
```
GET    /api/restaurants/:id/menu           # Get restaurant menu
POST   /api/restaurants/:id/menu/categories # Create category
PUT    /api/restaurants/:id/menu/categories/:categoryId # Update category
DELETE /api/restaurants/:id/menu/categories/:categoryId # Delete category
POST   /api/restaurants/:id/menu/items     # Create menu item
PUT    /api/restaurants/:id/menu/items/:itemId # Update menu item
DELETE /api/restaurants/:id/menu/items/:itemId # Delete menu item
```

### 4. Orders
```
GET    /api/restaurants/:id/orders         # Get restaurant orders
POST   /api/restaurants/:id/orders         # Create order
PUT    /api/orders/:orderId                # Update order status
GET    /api/orders/:orderId                # Get order details
```

### 5. Authentication
```
POST   /api/auth/login                     # Restaurant/Staff login
POST   /api/auth/logout                    # Logout
GET    /api/auth/me                        # Get current user
POST   /api/auth/refresh                   # Refresh token
```

### 6. Settings & Configuration
```
GET    /api/restaurants/:id/settings       # Get restaurant settings
PUT    /api/restaurants/:id/settings       # Update restaurant settings
GET    /api/restaurants/:id/business-settings # Get business settings
PUT    /api/restaurants/:id/business-settings # Update business settings
```

## 🗄️ Database Schema (PostgreSQL)

### restaurants
```sql
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL, -- subdomain
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, -- hashed
  phone VARCHAR(20),
  address TEXT,
  features TEXT[], -- Array of feature IDs
  subscription_plan VARCHAR(50) DEFAULT 'basic',
  subscription_status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### menu_categories
```sql
CREATE TABLE menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### menu_items
```sql
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  category_id UUID REFERENCES menu_categories(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url VARCHAR(500),
  is_available BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### orders
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  table_number INTEGER,
  customer_name VARCHAR(255),
  status VARCHAR(20) DEFAULT 'pending', -- pending, preparing, ready, completed, cancelled
  total_amount DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### order_items
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  notes TEXT
);
```

### features
```sql
CREATE TABLE features (
  id VARCHAR(50) PRIMARY KEY, -- qr_menu, table_management, etc.
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50), -- basic, premium, enterprise, custom
  is_active BOOLEAN DEFAULT true
);
```

## 🔄 Migration Steps

### Phase 1: Backend Setup
1. ✅ Setup Render PostgreSQL database
2. ✅ Create database schema
3. ✅ Setup Express.js API server
4. ✅ Implement authentication middleware
5. ✅ Create API endpoints

### Phase 2: Frontend Integration
1. 🔄 Create API service layer
2. 🔄 Replace localStorage calls with API calls
3. 🔄 Update Zustand stores to use API
4. 🔄 Implement loading states
5. 🔄 Add error handling

### Phase 3: Data Migration
1. 🔄 Export existing localStorage data
2. 🔄 Import data to PostgreSQL
3. 🔄 Test data integrity
4. 🔄 Remove localStorage dependencies

### Phase 4: Testing & Deployment
1. 🔄 Test all features
2. 🔄 Performance optimization
3. 🔄 Deploy to production
4. 🔄 Monitor and fix issues

## 🚀 Benefits

### ✅ Advantages
- **Centralized Data**: Single source of truth
- **Real-time Sync**: All devices see same data instantly
- **Scalability**: Can handle thousands of restaurants
- **Security**: Proper authentication & authorization
- **Backup**: Automatic database backups
- **Analytics**: Easy to generate reports
- **Multi-device**: Works across all devices seamlessly

### ❌ Removed Problems
- No more cross-domain localStorage issues
- No more data loss on browser clear
- No more subdomain sync problems
- No more client-side data limits

## 🛠️ Implementation Priority

### High Priority (Week 1)
1. Restaurant CRUD operations
2. Authentication system
3. Basic menu management
4. Feature management

### Medium Priority (Week 2)
1. Order management
2. Settings management
3. Real-time updates (WebSocket)
4. File upload (images)

### Low Priority (Week 3)
1. Advanced analytics
2. Bulk operations
3. Data export/import
4. Admin dashboard enhancements

## 📝 Notes

- Use **JWT tokens** for authentication
- Implement **rate limiting** for API security
- Use **Redis** for caching frequently accessed data
- Implement **WebSocket** for real-time order updates
- Use **Cloudinary** or similar for image storage
- Implement **database migrations** for schema changes

---

**Next Steps:** Start with Phase 1 - Backend setup and basic API endpoints.
