# Radhana Art Backend API - Examples & Usage

## Example Requests & Responses

### Authentication

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePass123",
  "confirmPassword": "securePass123",
  "phone": "9841234567",
  "address": {
    "city": "Kathmandu",
    "province": "Bagmati",
    "country": "Nepal",
    "street": "123 Main Street"
  }
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9841234567",
  "address": {
    "city": "Kathmandu",
    "province": "Bagmati",
    "country": "Nepal",
    "street": "123 Main Street"
  },
  "roles": ["USER"],
  "profileImageUrl": ""
}
```

**Headers Set:**
```
Set-Cookie: authToken=eyJhbGc...; HttpOnly; Max-Age=86400000; SameSite=Lax
```

---

#### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePass123"
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9841234567",
  "address": {
    "city": "Kathmandu",
    "province": "Bagmati",
    "country": "Nepal",
    "street": "123 Main Street"
  },
  "roles": ["USER"],
  "profileImageUrl": ""
}
```

---

#### Get Current User
```bash
GET /api/auth/me
Cookie: authToken=eyJhbGc...
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9841234567",
  "address": {...},
  "roles": ["USER"],
  "profileImageUrl": ""
}
```

---

#### Logout
```bash
POST /api/auth/logout
Cookie: authToken=eyJhbGc...
```

**Response (200):**
```json
{
  "message": "Logged out successfully."
}
```

---

#### Forgot Password
```bash
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "message": "Reset password link sent to your email."
}
```

**Email Sent To:** john@example.com with reset link like:
```
https://yourfrontend.com/reset-password.html?token=a1b2c3d4-e5f6-7890&userId=507f1f77bcf86cd799439011
```

---

#### Reset Password
```bash
POST /api/auth/reset-password?token=a1b2c3d4-e5f6-7890&userId=507f1f77bcf86cd799439011
Content-Type: application/json

{
  "password": "newSecurePass456",
  "confirmPassword": "newSecurePass456"
}
```

**Response (200):**
```json
{
  "message": "Password reset successfully."
}
```

---

### Products

#### Get All Products (with filters)
```bash
GET /api/products?category=wooden&min=500&max=5000&limit=20&offset=0
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Wooden Photo Frame",
    "category": "wooden",
    "cat": "personalized",
    "description": "Beautiful wooden frame with laser engraving",
    "price": 1500,
    "maxPrice": 3000,
    "stock": 50,
    "inStock": true,
    "imageUrls": [
      "https://res.cloudinary.com/..../image1.jpg",
      "https://res.cloudinary.com/..../image2.jpg"
    ],
    "badge": "Popular",
    "stars": 5,
    "reviews": 24,
    "popular": true,
    "forWho": ["wife", "friend", "family"],
    "festival": ["anniversary", "birthday"],
    "occasion": ["gift"],
    "createdBy": "507f1f77bcf86cd799439011",
    "isActive": true,
    "createdAt": "2025-01-15T10:30:00Z"
  },
  {
    "_id": "507f1f77bcf86cd799439013",
    "name": "Wooden Keychain",
    "category": "wooden",
    ...
  }
]
```

---

#### Get Single Product
```bash
GET /api/products/507f1f77bcf86cd799439012
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Wooden Photo Frame",
  "category": "wooden",
  ...all fields...
}
```

---

#### Create Product (Admin)
```bash
POST /api/products
Cookie: authToken=eyJhbGc...
Content-Type: multipart/form-data

name: "Neon Sign"
category: "neon"
cat: "corporate"
description: "Custom neon sign for business"
price: 8000
maxPrice: 15000
stock: 20
badge: "New"
stars: 5
popular: true
images: [file1.jpg, file2.jpg, file3.jpg]
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "name": "Neon Sign",
  "category": "neon",
  "cat": "corporate",
  "description": "Custom neon sign for business",
  "price": 8000,
  "maxPrice": 15000,
  "stock": 20,
  "inStock": true,
  "imageUrls": [
    "https://res.cloudinary.com/.../image1.jpg",
    "https://res.cloudinary.com/.../image2.jpg",
    "https://res.cloudinary.com/.../image3.jpg"
  ],
  "badge": "New",
  "stars": 5,
  "reviews": 0,
  "popular": true,
  "createdBy": "507f1f77bcf86cd799439011",
  "isActive": true,
  "createdAt": "2025-01-20T14:22:00Z"
}
```

---

#### Update Product (Admin)
```bash
PUT /api/products/507f1f77bcf86cd799439014
Cookie: authToken=eyJhbGc...
Content-Type: multipart/form-data

price: 9000
maxPrice: 16000
stock: 30
images: [newfile1.jpg, newfile2.jpg]
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439014",
  "price": 9000,
  "maxPrice": 16000,
  "stock": 30,
  "imageUrls": [
    "https://res.cloudinary.com/.../newfile1.jpg",
    "https://res.cloudinary.com/.../newfile2.jpg"
  ],
  ...other fields...
}
```

---

#### Delete Product (Admin)
```bash
DELETE /api/products/507f1f77bcf86cd799439014
Cookie: authToken=eyJhbGc...
```

**Response (200):**
```json
{
  "message": "Product deleted successfully."
}
```

---

### Orders

#### Create Order
```bash
POST /api/orders
Cookie: authToken=eyJhbGc...
Content-Type: multipart/form-data

orderItems: [
  {
    "product": "507f1f77bcf86cd799439012",
    "quantity": 2,
    "price": 1500
  },
  {
    "product": "507f1f77bcf86cd799439013",
    "quantity": 1,
    "price": 800
  }
]
totalPrice: 3800
shippingAddress: {
  "firstName": "John",
  "lastName": "Doe",
  "phone": "9841234567",
  "email": "john@example.com",
  "street": "123 Main Street",
  "city": "Kathmandu",
  "landmark": "Near Durbar Square",
  "country": "Nepal"
}
paymentMethod: "khalti"
orderNotes: "Please wrap as gift"
designFile: [customdesign.pdf]
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439020",
  "orderNumber": "RA-1705760340000-456",
  "user": "507f1f77bcf86cd799439011",
  "orderItems": [
    {
      "product": "507f1f77bcf86cd799439012",
      "quantity": 2,
      "price": 1500
    },
    {
      "product": "507f1f77bcf86cd799439013",
      "quantity": 1,
      "price": 800
    }
  ],
  "status": "PENDING",
  "totalPrice": 3800,
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "phone": "9841234567",
    "email": "john@example.com",
    "street": "123 Main Street",
    "city": "Kathmandu",
    "landmark": "Near Durbar Square",
    "country": "Nepal"
  },
  "designFileUrl": "https://res.cloudinary.com/.../customdesign.pdf",
  "orderNotes": "Please wrap as gift",
  "paymentMethod": "khalti",
  "payment": null,
  "createdAt": "2025-01-20T14:30:00Z"
}
```

---

#### Get User's Orders
```bash
GET /api/orders/user
Cookie: authToken=eyJhbGc...
```

**Response (200) - Array:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439020",
    "orderNumber": "RA-1705760340000-456",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9841234567",
      "address": {...}
    },
    "orderItems": [
      {
        "product": {
          "_id": "507f1f77bcf86cd799439012",
          "name": "Wooden Photo Frame",
          "price": 1500,
          ...
        },
        "quantity": 2,
        "price": 1500
      }
    ],
    "status": "PENDING",
    "totalPrice": 3800,
    "shippingAddress": {...},
    "paymentMethod": "khalti",
    "payment": null,
    "createdAt": "2025-01-20T14:30:00Z"
  }
]
```

---

#### Update Order Status
```bash
PUT /api/orders/507f1f77bcf86cd799439020
Cookie: authToken=eyJhbGc...
Content-Type: application/json

{
  "status": "CONFIRMED"
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439020",
  "status": "CONFIRMED",
  ...other fields...
}
```

---

#### Initiate Khalti Payment
```bash
POST /api/orders/507f1f77bcf86cd799439020/payment/khalti
Cookie: authToken=eyJhbGc...
```

**Response (200):**
```json
{
  "payment_url": "https://khalti.com/checkout/pay/?pidx=705N200bP6K3H0H0H0H0H0H0H0H0H0&_view=web"
}
```

**Side Effect:**
- Payment record created with status "PENDING"
- Payment linked to Order

---

#### Confirm Order Payment
```bash
PUT /api/orders/507f1f77bcf86cd799439020/confirm-payment
Cookie: authToken=eyJhbGc...
Content-Type: application/json

{
  "status": "COMPLETED"
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439020",
  "status": "CONFIRMED",
  "payment": {
    "_id": "507f1f77bcf86cd799439021",
    "amount": 3800,
    "method": "khalti",
    "status": "COMPLETED",
    "transactionId": "a1b2c3d4-e5f6-7890",
    "createdAt": "2025-01-20T14:35:00Z"
  },
  ...other fields...
}
```

---

#### Delete Order
```bash
DELETE /api/orders/507f1f77bcf86cd799439020
Cookie: authToken=eyJhbGc...
```

**Response (200):**
```json
{
  "message": "Order deleted successfully."
}
```

---

### Users

#### Get Current Profile
```bash
GET /api/users/profile
Cookie: authToken=eyJhbGc...
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9841234567",
  "address": {
    "city": "Kathmandu",
    "province": "Bagmati",
    "country": "Nepal",
    "street": "123 Main Street"
  },
  "roles": ["USER"],
  "profileImageUrl": "",
  "createdAt": "2025-01-15T10:30:00Z"
}
```

---

#### Update User Profile
```bash
PUT /api/users/507f1f77bcf86cd799439011
Cookie: authToken=eyJhbGc...
Content-Type: application/json

{
  "name": "John Smith Doe",
  "phone": "9841234568",
  "address": {
    "city": "Lalitpur",
    "province": "Bagmati",
    "country": "Nepal",
    "street": "456 Oak Street"
  }
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Smith Doe",
  "email": "john@example.com",
  "phone": "9841234568",
  "address": {
    "city": "Lalitpur",
    "province": "Bagmati",
    "country": "Nepal",
    "street": "456 Oak Street"
  },
  "roles": ["USER"],
  "profileImageUrl": "",
  "createdAt": "2025-01-15T10:30:00Z"
}
```

---

#### Update Profile Image
```bash
PATCH /api/users/507f1f77bcf86cd799439011/profile-image
Cookie: authToken=eyJhbGc...
Content-Type: multipart/form-data

image: [profilepic.jpg]
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9841234567",
  "address": {...},
  "roles": ["USER"],
  "profileImageUrl": "https://res.cloudinary.com/.../profilepic.jpg",
  "createdAt": "2025-01-15T10:30:00Z"
}
```

---

#### Get All Users (Admin)
```bash
GET /api/users
Cookie: authToken=eyJhbGc...
```

**Response (200) - Array:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9841234567",
    "roles": ["USER"],
    "profileImageUrl": "",
    "createdAt": "2025-01-15T10:30:00Z"
  },
  {
    "_id": "507f1f77bcf86cd799439015",
    "name": "Admin User",
    "email": "admin@example.com",
    "phone": "9849999999",
    "roles": ["ADMIN"],
    "profileImageUrl": "",
    "createdAt": "2025-01-10T08:00:00Z"
  }
]
```

---

#### Create User (Admin)
```bash
POST /api/users
Cookie: authToken=eyJhbGc...
Content-Type: application/json

{
  "name": "New Admin",
  "email": "newadmin@example.com",
  "password": "securePass789",
  "phone": "9842000000",
  "roles": ["ADMIN"]
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439016",
  "name": "New Admin",
  "email": "newadmin@example.com",
  "phone": "9842000000",
  "roles": ["ADMIN"],
  "profileImageUrl": "",
  "address": {
    "city": "",
    "province": "",
    "country": "Nepal",
    "street": ""
  },
  "createdAt": "2025-01-20T15:00:00Z"
}
```

---

#### Delete User (Admin)
```bash
DELETE /api/users/507f1f77bcf86cd799439016
Cookie: authToken=eyJhbGc...
```

**Response (200):**
```json
{
  "message": "User deleted successfully."
}
```

---

### Contact

#### Send Contact Message (Public)
```bash
POST /api/contact
Content-Type: multipart/form-data

name: "Jane Smith"
phone: "9845555555"
email: "jane@example.com"
subject: "Custom Order Inquiry"
message: "I'm interested in ordering custom wooden frames for my wedding. Can we discuss details?"
attachment: [proposal.pdf]
```

**Response (201):**
```json
{
  "message": "Message sent successfully.",
  "data": {
    "_id": "507f1f77bcf86cd799439030",
    "name": "Jane Smith",
    "phone": "9845555555",
    "email": "jane@example.com",
    "subject": "Custom Order Inquiry",
    "message": "I'm interested in ordering custom wooden frames for my wedding. Can we discuss details?",
    "attachmentUrl": "https://res.cloudinary.com/.../proposal.pdf",
    "isRead": false,
    "createdAt": "2025-01-20T15:10:00Z"
  }
}
```

**Admin Notified By Email:**
```
Subject: New Contact Message: Custom Order Inquiry
From: radhanaart@gmail.com

New message from Jane Smith
Phone: 9845555555
Email: jane@example.com
Subject: Custom Order Inquiry
Message: I'm interested in ordering custom wooden frames for my wedding...
Attachment: https://res.cloudinary.com/.../proposal.pdf
```

---

#### Get All Messages (Admin)
```bash
GET /api/contact
Cookie: authToken=eyJhbGc...
```

**Response (200) - Array:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439030",
    "name": "Jane Smith",
    "phone": "9845555555",
    "email": "jane@example.com",
    "subject": "Custom Order Inquiry",
    "message": "I'm interested in ordering custom wooden frames...",
    "attachmentUrl": "https://res.cloudinary.com/.../proposal.pdf",
    "isRead": false,
    "createdAt": "2025-01-20T15:10:00Z"
  }
]
```

---

#### Mark Message As Read (Admin)
```bash
PATCH /api/contact/507f1f77bcf86cd799439030/read
Cookie: authToken=eyJhbGc...
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439030",
  "name": "Jane Smith",
  "phone": "9845555555",
  "email": "jane@example.com",
  "subject": "Custom Order Inquiry",
  "message": "I'm interested in ordering custom wooden frames...",
  "attachmentUrl": "https://res.cloudinary.com/.../proposal.pdf",
  "isRead": true,
  "createdAt": "2025-01-20T15:10:00Z"
}
```

---

#### Delete Message (Admin)
```bash
DELETE /api/contact/507f1f77bcf86cd799439030
Cookie: authToken=eyJhbGc...
```

**Response (200):**
```json
{
  "message": "Message deleted."
}
```

---

### Gallery

#### Get Gallery
```bash
GET /api/gallery?cat=wooden
```

**Response (200) - Array:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439040",
    "title": "Wedding Photo Frame Collection",
    "description": "Beautiful wooden frames for wedding memories",
    "cat": "wooden",
    "imageUrls": [
      "https://res.cloudinary.com/.../gallery1.jpg",
      "https://res.cloudinary.com/.../gallery2.jpg",
      "https://res.cloudinary.com/.../gallery3.jpg"
    ],
    "isActive": true,
    "createdBy": "507f1f77bcf86cd799439011",
    "createdAt": "2025-01-10T12:00:00Z"
  },
  {
    "_id": "507f1f77bcf86cd799439041",
    "title": "Corporate Wooden Awards",
    "description": "Custom wooden awards for corporate events",
    "cat": "wooden",
    ...
  }
]
```

#### Get All Gallery Items
```bash
GET /api/gallery?cat=all
```

**Response (200) - Array:** All gallery items from all categories

---

#### Create Gallery Item (Admin)
```bash
POST /api/gallery
Cookie: authToken=eyJhbGc...
Content-Type: multipart/form-data

title: "Neon Sign Showcase 2025"
description: "Latest neon sign designs for businesses"
cat: "neon"
images: [neon1.jpg, neon2.jpg, neon3.jpg, neon4.jpg, neon5.jpg]
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439042",
  "title": "Neon Sign Showcase 2025",
  "description": "Latest neon sign designs for businesses",
  "cat": "neon",
  "imageUrls": [
    "https://res.cloudinary.com/.../neon1.jpg",
    "https://res.cloudinary.com/.../neon2.jpg",
    "https://res.cloudinary.com/.../neon3.jpg",
    "https://res.cloudinary.com/.../neon4.jpg",
    "https://res.cloudinary.com/.../neon5.jpg"
  ],
  "isActive": true,
  "createdBy": "507f1f77bcf86cd799439011",
  "createdAt": "2025-01-20T16:00:00Z"
}
```

---

#### Update Gallery Item (Admin)
```bash
PUT /api/gallery/507f1f77bcf86cd799439042
Cookie: authToken=eyJhbGc...
Content-Type: multipart/form-data

title: "Premium Neon Sign Collection 2025"
description: "Updated neon sign designs for premium businesses"
images: [newone.jpg, newtwo.jpg]
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439042",
  "title": "Premium Neon Sign Collection 2025",
  "description": "Updated neon sign designs for premium businesses",
  "cat": "neon",
  "imageUrls": [
    "https://res.cloudinary.com/.../newone.jpg",
    "https://res.cloudinary.com/.../newtwo.jpg"
  ],
  "isActive": true,
  "createdBy": "507f1f77bcf86cd799439011",
  "createdAt": "2025-01-20T16:00:00Z"
}
```

---

#### Delete Gallery Item (Admin)
```bash
DELETE /api/gallery/507f1f77bcf86cd799439042
Cookie: authToken=eyJhbGc...
```

**Response (200):**
```json
{
  "message": "Gallery item deleted."
}
```

---

## Error Response Examples

### 400 Bad Request
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "test"
}
```

**Response (400):**
```json
{
  "message": "Name is required."
}
```

---

### 401 Unauthorized
```bash
GET /api/users
(No Cookie)
```

**Response (401):**
```json
{
  "message": "Invalid token or unauthorized."
}
```

---

### 403 Forbidden (Not Admin)
```bash
POST /api/products
Cookie: authToken=eyJhbGc... (USER role)
Content-Type: multipart/form-data

name: "Test Product"
...
```

**Response (403):**
```json
{
  "message": "Access Denied."
}
```

---

### 404 Not Found
```bash
GET /api/products/507f1f77bcf86cd799439999
```

**Response (404):**
```json
{
  "message": "Product not found."
}
```

---

### 400 Duplicate Email
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Another John",
  "email": "john@example.com",
  "password": "securePass123",
  "confirmPassword": "securePass123",
  "phone": "9841234570"
}
```

**Response (400):**
```json
{
  "message": "User with this email already exists."
}
```

---

## CURL Examples

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePass123",
    "confirmPassword": "securePass123",
    "phone": "9841234567"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePass123"
  }' \
  -c cookies.txt
```

### Get Products
```bash
curl -X GET "http://localhost:5000/api/products?category=wooden&limit=10"
```

### Create Product (with Auth)
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: multipart/form-data" \
  -b cookies.txt \
  -F "name=Wooden Frame" \
  -F "category=wooden" \
  -F "price=1500" \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg"
```

### Get Authenticated User Orders
```bash
curl -X GET http://localhost:5000/api/orders/user \
  -b cookies.txt
```

### Send Contact Message
```bash
curl -X POST http://localhost:5000/api/contact \
  -F "name=Jane Smith" \
  -F "phone=9845555555" \
  -F "email=jane@example.com" \
  -F "subject=Inquiry" \
  -F "message=I want to place an order..." \
  -F "attachment=@proposal.pdf"
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Arrays in responses are always within `[]` even if paginated
- File uploads always return Cloudinary URLs in response
- Password is never returned in any response
- Frontend should include cookies automatically (if using fetch with `credentials: 'include'`)
