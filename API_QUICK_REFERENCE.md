# Radhana Art Backend API - Quick Reference

## All API Endpoints Summary

| Module | Method | Route | Auth | Admin | Request Body | Response |
|--------|--------|-------|------|-------|--------------|----------|
| **AUTH** |
| Register | POST | `/auth/register` | ❌ | ❌ | name, email, password, phone, address, roles | User (safe) |
| Login | POST | `/auth/login` | ❌ | ❌ | email, password | User (safe) |
| Logout | POST | `/auth/logout` | ❌ | ❌ | - | {message} |
| Get Me | GET | `/auth/me` | ✅ | ❌ | - | Current User |
| Forgot Password | POST | `/auth/forgot-password` | ❌ | ❌ | email | {message} |
| Reset Password | POST | `/auth/reset-password` | ❌ | ❌ | password, confirmPassword | {message} |
| **PRODUCTS** |
| Get All | GET | `/products` | ❌ | ❌ | Query: category, cat, min, max, name, limit, offset | Product[] |
| Get By ID | GET | `/products/:id` | ❌ | ❌ | - | Product |
| Create | POST | `/products` | ✅ | ✅ | Multipart: name, category, price, images | Product |
| Update | PUT | `/products/:id` | ✅ | ✅ | Multipart: same as create | Product |
| Delete | DELETE | `/products/:id` | ✅ | ✅ | - | {message} |
| **ORDERS** |
| Get All (Admin) | GET | `/orders` | ✅ | ✅ | - | Order[] |
| Get User Orders | GET | `/orders/user` | ✅ | ❌ | - | Order[] (filtered) |
| Get By ID | GET | `/orders/:id` | ✅ | ✅ | - | Order |
| Create | POST | `/orders` | ✅ | ❌ | orderItems, totalPrice, shippingAddress, designFile | Order |
| Update Status | PUT | `/orders/:id` | ✅ | ❌* | status | Order |
| Delete | DELETE | `/orders/:id` | ✅ | ❌* | - | {message} |
| Payment (Khalti) | POST | `/orders/:id/payment/khalti` | ✅ | ❌ | - | {payment_url} |
| Confirm Payment | PUT | `/orders/:id/confirm-payment` | ✅ | ❌* | status | Order |
| **USERS** |
| Get Profile | GET | `/users/profile` | ✅ | ❌ | - | User |
| Create (Admin) | POST | `/users` | ✅ | ✅ | name, email, password, phone, address, roles | User |
| Get All (Admin) | GET | `/users` | ✅ | ✅ | - | User[] |
| Get By ID (Admin) | GET | `/users/:id` | ✅ | ✅ | - | User |
| Update | PUT | `/users/:id` | ✅ | ❌* | name, phone, address | User |
| Update Image | PATCH | `/users/:id/profile-image` | ✅ | ❌* | image (file) | User |
| Delete (Admin) | DELETE | `/users/:id` | ✅ | ✅ | - | {message} |
| **CONTACT** |
| Create Message | POST | `/contact` | ❌ | ❌ | name, phone, email, subject, message, attachment | {message, data} |
| Get All (Admin) | GET | `/contact` | ✅ | ✅ | - | Contact[] |
| Mark Read (Admin) | PATCH | `/contact/:id/read` | ✅ | ✅ | - | Contact |
| Delete (Admin) | DELETE | `/contact/:id` | ✅ | ✅ | - | {message} |
| **GALLERY** |
| Get Gallery | GET | `/gallery` | ❌ | ❌ | Query: cat | Gallery[] |
| Create Item (Admin) | POST | `/gallery` | ✅ | ✅ | title, cat, description, images | Gallery |
| Update Item (Admin) | PUT | `/gallery/:id` | ✅ | ✅ | title, cat, description, images | Gallery |
| Delete Item (Admin) | DELETE | `/gallery/:id` | ✅ | ✅ | - | {message} |

**Legend:**
- ✅ = Required
- ❌ = Not required  
- * = Or owner of resource
- Multipart = FormData/files supported

---

## File Upload Routes

| Route | Method | Files Supported | Field Name | Max Count | Size Limit |
|-------|--------|-----------------|-----------|-----------|------------|
| `/products` | POST/PUT | Images | `images` | 5 | 50MB total |
| `/orders` | POST | Design file | `designFile` | 1 | 50MB total |
| `/users/:id/profile-image` | PATCH | Image | `image` | 1 | 50MB total |
| `/contact` | POST | Attachment | `attachment` | 1 | 50MB total |
| `/gallery` | POST/PUT | Images | `images` | 10 | 50MB total |

---

## Data Structure Reference

### User (Auth Response)
```
_id, name, email, phone, address, roles, profileImageUrl
```

### Product (Get/Create)
```
_id, name, category, cat, description, price, maxPrice, stock, inStock, 
imageUrls[], badge, stars, reviews, popular, forWho[], festival[], occasion[], 
createdBy, isActive, createdAt
```

### Order (Get/Create)
```
_id, orderNumber, user, orderItems[], status, totalPrice, shippingAddress, 
designFileUrl, orderNotes, paymentMethod, payment, createdAt
```

### Order Item
```
product, quantity, price
```

### Shipping Address
```
firstName, lastName, phone, email, street, city, landmark, country
```

### Payment
```
_id, amount, method, status, transactionId, createdAt
```

### Contact
```
_id, name, phone, email, subject, message, attachmentUrl, isRead, createdAt
```

### Gallery
```
_id, title, description, cat, imageUrls[], isActive, createdBy, createdAt
```

---

## Enums & Constants

### Product Category
```
wooden | qr | keyring | award | numberplate | signboard | neon | mug | leafart
```

### Catalog Group (cat)
```
personalized | corporate | homedecor
```

### Product Badge
```
"" | Popular | New | Trending | Hot | Sale | Premium | Unique
```

### Order Status
```
PENDING | CONFIRMED | SHIPPED | DELIVERED
```

### Payment Status
```
PENDING | COMPLETED | FAILED
```

### Payment Method
```
esewa | khalti | bank | cod | cash
```

### User Role
```
USER | ADMIN
```

---

## Query Parameters

### GET /products
- `category` / `type` - Filter by product category
- `cat` - Catalog grouping (personalized/corporate/homedecor)
- `min` - Minimum price
- `max` / `maxprice` - Maximum price
- `name` / `q` - Search query
- `forWho` - Recipient filter
- `festival` - Festival category
- `occ` - Occasion filter
- `limit` - Results per page (default: 50)
- `offset` - Pagination offset (default: 0)

### GET /gallery
- `cat` - Filter by category (or "all" for no filter)

---

## Status Codes

| Code | Meaning | Common Scenarios |
|------|---------|------------------|
| 200 | OK | Successful GET/PUT/PATCH operations |
| 201 | Created | Successful POST operations (create) |
| 400 | Bad Request | Missing required fields, validation errors |
| 401 | Unauthorized | Not authenticated or invalid JWT |
| 403 | Forbidden | Not authorized (e.g., not admin or not owner) |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Unexpected server error |

---

## Common Validations

### Required Fields by Endpoint

**Register:**
- name, email, password, confirmPassword (must match), phone

**Login:**
- email, password

**Create Product:**
- name, category, price

**Create Order:**
- orderItems (non-empty array), totalPrice, shippingAddress

**Shipping Address:**
- firstName, lastName, phone, email, street, city

**Create Contact:**
- name, phone, subject, message

**Create Gallery:**
- title, cat, images (at least 1)

---

## Middleware & Security

### Global Middleware (app.js)
```
File uploads: multer (memory storage, 50MB limit)
CORS: Enabled, credentials allowed
Body parser: JSON (50MB limit)
Cookie parser: Enabled (for JWT authToken)
Logger: Custom endpoint logging
```

### Route-Level Auth
```
/api/products - No auth required (files uploaded if provided)
/api/orders - Auth required + file upload for design
/api/users - Auth required + file upload for profile image
/api/contact - No auth + file upload for attachments
/api/gallery - No auth for GET, auth+admin for POST/PUT/DELETE + multi-file
```

### Special Middleware
```
auth - Validates JWT cookie and populates req.user
roleBasedAuth(ADMIN) - Checks if user has ADMIN role
```

---

## Common Response Patterns

### Success Response
```json
{
  "_id": "...",
  "field1": "value",
  "field2": "value"
}
```

### Success Message Response
```json
{
  "message": "Operation successful."
}
```

### Error Response
```json
{
  "message": "Error description"
}
```

### Creation Response (201)
```json
{
  "_id": "newly_created_id",
  ...resource_data
}
```

---

## Authentication Flow

1. **Register/Login** → Receive user object + `authToken` cookie set
2. **Subsequent Requests** → Browser automatically sends `authToken` cookie
3. **Auth Middleware** → Validates JWT, populates `req.user`
4. **Logout** → Clears `authToken` cookie

---

## Pagination Notes

**GET /products** supports:
- `limit` (default: 50)
- `offset` (default: 0)

**Other list endpoints** (orders, users, contacts) return ALL records (no pagination params)

---

## File Upload Notes

- All uploads go to **Cloudinary** (cloud storage)
- Returns secure_url for accessing uploaded files
- Max file size: 50MB per file
- Product images: up to 5 files
- Gallery images: up to 10 files
- Orders/users/contact: single file

---

## Error Scenarios

| Error | Status | Solution |
|-------|--------|----------|
| Email already exists | 400 | Use unique email |
| Password mismatch | 400 | Ensure passwords match |
| Not authenticated | 401 | Login to get authToken |
| Not authorized (not admin) | 403 | Request admin user |
| Resource not found | 404 | Check ID is correct |
| Invalid token | 401 | Login again |
| Required field missing | 400 | Provide all required fields |

---

## Quick Testing Checklist

- [ ] POST /auth/register - Create new user
- [ ] POST /auth/login - Authenticate
- [ ] GET /auth/me - Verify login
- [ ] GET /products - View products
- [ ] POST /products - Create product (admin)
- [ ] POST /orders - Create order (authenticated)
- [ ] GET /orders/user - View own orders
- [ ] POST /contact - Send message (public)
- [ ] POST /auth/logout - Logout
