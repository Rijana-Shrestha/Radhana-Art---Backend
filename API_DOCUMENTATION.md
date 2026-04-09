# Radhana Art Backend API Documentation

## Overview
This document provides a comprehensive guide to all backend APIs for the Radhana Art platform. All endpoints return JSON responses.

**Base URL:** `/api`  
**Database:** MongoDB  
**Authentication:** Cookie-based JWT token (`authToken`)

---

## Table of Contents
1. [Authentication APIs](#authentication-apis)
2. [Products APIs](#products-apis)
3. [Orders APIs](#orders-apis)
4. [Users APIs](#users-apis)
5. [Contact APIs](#contact-apis)
6. [Gallery APIs](#gallery-apis)
7. [Data Models](#data-models)
8. [Constants & Enums](#constants--enums)

---

## Authentication APIs

### 1. Register User
- **Route:** `POST /auth/register`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "name": "string (required)",
    "email": "string (required, unique, valid email)",
    "password": "string (required, min 6 chars)",
    "confirmPassword": "string (required, must match password)",
    "phone": "string (required, unique)",
    "address": {
      "city": "string (optional)",
      "province": "string (optional)",
      "country": "string (default: Nepal)",
      "street": "string (optional)"
    },
    "roles": ["string"] (optional, default: ["USER"], enum: ["USER", "ADMIN"])
  }
  ```
- **Response (201):**
  ```json
  {
    "_id": "string (ObjectId)",
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": {
      "city": "string",
      "province": "string",
      "country": "string",
      "street": "string"
    },
    "roles": ["string"],
    "profileImageUrl": "string"
  }
  ```
- **Validation:**
  - Email must be valid format and unique
  - Password must match confirmPassword
  - Password minimum 6 characters
  - Phone must be unique
- **Sets Cookie:** `authToken` (HttpOnly, 1 day expiration)
- **Error Responses:**
  - `400`: Password/Email/Confirmation missing or mismatch
  - `400`: Email already exists
  - `400`: Invalid email format

---

### 2. Login
- **Route:** `POST /auth/login`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "email": "string (required)",
    "password": "string (required)"
  }
  ```
- **Response (200):**
  ```json
  {
    "_id": "string (ObjectId)",
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": {
      "city": "string",
      "province": "string",
      "country": "string",
      "street": "string"
    },
    "roles": ["string"],
    "profileImageUrl": "string"
  }
  ```
- **Sets Cookie:** `authToken` (HttpOnly, 1 day expiration)
- **Error Responses:**
  - `400`: Email or password missing
  - `404`: User not found
  - `400`: Incorrect password

---

### 3. Logout
- **Route:** `POST /auth/logout`
- **Auth Required:** No
- **Request Body:** Empty
- **Response (200):**
  ```json
  {
    "message": "Logged out successfully."
  }
  ```
- **Clears Cookie:** `authToken`

---

### 4. Get Current User
- **Route:** `GET /auth/me`
- **Auth Required:** Yes (JWT cookie)
- **Request Body:** N/A
- **Response (200):**
  ```json
  {
    "_id": "string (ObjectId)",
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": {
      "city": "string",
      "province": "string",
      "country": "string",
      "street": "string"
    },
    "roles": ["string"],
    "profileImageUrl": "string"
  }
  ```
- **Error Responses:**
  - `401`: Invalid/expired token

---

### 5. Forgot Password
- **Route:** `POST /auth/forgot-password`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "email": "string (required)"
  }
  ```
- **Response (200):**
  ```json
  {
    "message": "Reset password link sent to your email."
  }
  ```
- **Side Effect:** Sends email with reset link (valid for 1 hour)
- **Error Responses:**
  - `400`: Email missing
  - `404`: User not found

---

### 6. Reset Password
- **Route:** `POST /auth/reset-password?token=STRING&userId=STRING`
- **Auth Required:** No
- **Query Parameters:**
  - `token` (required): Reset token from email
  - `userId` (required): User ID from email
- **Request Body:**
  ```json
  {
    "password": "string (required, min 6 chars)",
    "confirmPassword": "string (required, must match password)"
  }
  ```
- **Response (200):**
  ```json
  {
    "message": "Password reset successfully."
  }
  ```
- **Error Responses:**
  - `400`: Token/userId missing
  - `400`: Password/ConfirmPassword missing or mismatch
  - `400`: Invalid or expired reset token

---

## Products APIs

### 1. Get All Products
- **Route:** `GET /products`
- **Auth Required:** No
- **Query Parameters:**
  ```
  category (string): Filter by product category
              enum: [wooden, qr, keyring, award, numberplate, signboard, neon, mug, leafart]
  type (string): Alias for category
  cat (string): Broader catalog grouping
              enum: [personalized, corporate, homedecor]
  min (number): Minimum price
  max (number): Maximum price
  name (string): Search by product name
  q (string): Alternative search query
  forWho (string): "who this gift is for" filter
  festival (string): Festival category filter
  occ (string): Occasion filter
  limit (number): Pagination limit (default: 50)
  offset (number): Pagination offset (default: 0)
  ```
- **Response (200) - Array:**
  ```json
  [
    {
      "_id": "string (ObjectId)",
      "name": "string",
      "category": "string",
      "cat": "string",
      "description": "string",
      "price": "number (starting price)",
      "maxPrice": "number (optional)",
      "stock": "number",
      "inStock": "boolean",
      "imageUrls": ["string (Cloudinary URLs)"],
      "badge": "string (Popular|New|Trending|Hot|Sale|Premium|Unique|empty)",
      "stars": "number (1-5)",
      "reviews": "number",
      "popular": "boolean",
      "forWho": ["string"],
      "festival": ["string"],
      "occasion": ["string"],
      "createdBy": "string (ObjectId)",
      "isActive": "boolean",
      "createdAt": "ISO 8601 date"
    }
  ]
  ```

---

### 2. Get Product By ID
- **Route:** `GET /products/:id`
- **Auth Required:** No
- **URL Parameters:**
  - `id` (required): Product MongoDB ObjectId
- **Response (200):**
  ```json
  {
    "_id": "string (ObjectId)",
    "name": "string",
    "category": "string",
    "cat": "string",
    "description": "string",
    "price": "number",
    "maxPrice": "number",
    "stock": "number",
    "inStock": "boolean",
    "imageUrls": ["string"],
    "badge": "string",
    "stars": "number (1-5)",
    "reviews": "number",
    "popular": "boolean",
    "forWho": ["string"],
    "festival": ["string"],
    "occasion": ["string"],
    "createdBy": "string (ObjectId)",
    "isActive": "boolean",
    "createdAt": "ISO 8601 date"
  }
  ```
- **Error Responses:**
  - `404`: Product not found

---

### 3. Create Product (Admin Only)
- **Route:** `POST /products`
- **Auth Required:** Yes (JWT) + Admin role
- **Multipart Form Data:**
  ```
  name (string, required): Product name
  category (string, required): Product category
  cat (string, optional): Broader catalog grouping
  description (string, optional): Product description
  price (number, required): Starting price (positive)
  maxPrice (number, optional): Maximum price
  stock (number, optional): Stock quantity (default: 99)
  badge (string, optional): Product badge
  stars (number, optional): Rating 1-5 (default: 5)
  reviews (number, optional): Review count
  popular (boolean, optional): Popular flag
  forWho (array, optional): Recipient filter array
  festival (array, optional): Festival categories array
  occasion (array, optional): Occasions array
  images (files, optional): Max 5 product images
  ```
- **Response (201):**
  ```json
  {
    "_id": "string (ObjectId)",
    "name": "string",
    "category": "string",
    "cat": "string",
    "description": "string",
    "price": "number",
    "maxPrice": "number",
    "stock": "number",
    "inStock": "boolean",
    "imageUrls": ["string (Cloudinary URLs)"],
    "badge": "string",
    "stars": "number",
    "reviews": "number",
    "popular": "boolean",
    "forWho": ["string"],
    "festival": ["string"],
    "occasion": ["string"],
    "createdBy": "string (ObjectId)",
    "isActive": "boolean",
    "createdAt": "ISO 8601 date"
  }
  ```
- **Error Responses:**
  - `401`: Not authenticated
  - `403`: Not admin
  - `400`: Required fields missing
  - `400`: Invalid price/stock

---

### 4. Update Product (Admin Only)
- **Route:** `PUT /products/:id`
- **Auth Required:** Yes (JWT) + Admin role
- **URL Parameters:**
  - `id` (required): Product MongoDB ObjectId
- **Multipart Form Data:**
  ```
  (Same fields as Create Product - all optional)
  ```
- **Response (200):** Updated product object (same structure as Create)
- **Error Responses:**
  - `401`: Not authenticated
  - `403`: Not authorized (not creator/admin)
  - `404`: Product not found

---

### 5. Delete Product (Admin Only)
- **Route:** `DELETE /products/:id`
- **Auth Required:** Yes (JWT) + Admin role
- **URL Parameters:**
  - `id` (required): Product MongoDB ObjectId
- **Response (200):**
  ```json
  {
    "message": "Product deleted successfully."
  }
  ```
- **Note:** Soft delete (sets `isActive` to false)
- **Error Responses:**
  - `401`: Not authenticated
  - `403`: Not authorized
  - `404`: Product not found

---

## Orders APIs

### 1. Get All Orders (Admin Only)
- **Route:** `GET /orders`
- **Auth Required:** Yes (JWT) + Admin role
- **Response (200) - Array:**
  ```json
  [
    {
      "_id": "string (ObjectId)",
      "orderNumber": "string (unique, format: RA-TIMESTAMP-RANDOM)",
      "user": {
        "_id": "string (ObjectId)",
        "name": "string",
        "email": "string",
        "phone": "string",
        "address": {
          "city": "string",
          "province": "string",
          "country": "string",
          "street": "string"
        }
      },
      "orderItems": [
        {
          "product": {
            "_id": "string (ObjectId)",
            "name": "string",
            "category": "string",
            "price": "number",
            "imageUrls": ["string"],
            ...
          },
          "quantity": "number (default: 1)",
          "price": "number (snapshot at order time)"
        }
      ],
      "status": "string (PENDING|CONFIRMED|SHIPPED|DELIVERED)",
      "totalPrice": "number",
      "shippingAddress": {
        "firstName": "string",
        "lastName": "string",
        "phone": "string",
        "email": "string",
        "street": "string",
        "city": "string",
        "landmark": "string",
        "country": "string (Nepal)"
      },
      "designFileUrl": "string (Cloudinary URL, optional)",
      "orderNotes": "string (optional)",
      "paymentMethod": "string (esewa|khalti|bank|cod|cash)",
      "payment": {
        "_id": "string (ObjectId)",
        "amount": "number",
        "method": "string",
        "status": "string (PENDING|COMPLETED|FAILED)",
        "transactionId": "string (optional)",
        "createdAt": "ISO 8601 date"
      },
      "createdAt": "ISO 8601 date"
    }
  ]
  ```
- **Sorted:** By creation date (newest first)

---

### 2. Get User's Orders
- **Route:** `GET /orders/user`
- **Auth Required:** Yes (JWT)
- **Response (200) - Array:** Same structure as Get All Orders, filtered by current user

---

### 3. Get Order By ID (Admin Only)
- **Route:** `GET /orders/:id`
- **Auth Required:** Yes (JWT) + Admin role
- **URL Parameters:**
  - `id` (required): Order MongoDB ObjectId
- **Response (200):** Single order object (same structure as Get All Orders)
- **Error Responses:**
  - `404`: Order not found

---

### 4. Create Order
- **Route:** `POST /orders`
- **Auth Required:** Yes (JWT)
- **Multipart Form Data:**
  ```
  orderItems (JSON string or array, required): Array of items
    [
      {
        "product": "string (Product ObjectId)",
        "quantity": "number (default: 1)",
        "price": "number (product snapshot price)"
      }
    ]
  totalPrice (number, required): Total order price
  shippingAddress (JSON string or object, required):
    {
      "firstName": "string (required)",
      "lastName": "string (required)",
      "phone": "string (required)",
      "email": "string (required)",
      "street": "string (required)",
      "city": "string (required)",
      "landmark": "string (optional)",
      "country": "string (optional, default: Nepal)"
    }
  paymentMethod (string, optional): esewa|khalti|bank|cod|cash
  orderNotes (string, optional): Special instructions
  designFile (file, optional): Design file upload (max 50MB)
  ```
- **Response (201):**
  ```json
  {
    "_id": "string (ObjectId)",
    "orderNumber": "string",
    "user": "string (ObjectId)",
    "orderItems": [...],
    "status": "PENDING",
    "totalPrice": "number",
    "shippingAddress": {...},
    "designFileUrl": "string (uploaded URL if provided)",
    "orderNotes": "string",
    "paymentMethod": "string",
    "payment": "null or ObjectId",
    "createdAt": "ISO 8601 date"
  }
  ```
- **Error Responses:**
  - `400`: Order items missing or empty
  - `400`: Total price missing
  - `400`: Shipping address missing

---

### 5. Update Order Status
- **Route:** `PUT /orders/:id`
- **Auth Required:** Yes (JWT)
- **URL Parameters:**
  - `id` (required): Order MongoDB ObjectId
- **Request Body:**
  ```json
  {
    "status": "string (PENDING|CONFIRMED|SHIPPED|DELIVERED, required)"
  }
  ```
- **Response (200):** Updated order object
- **Authorization:**
  - Owner (user who created) or Admin can update
- **Error Responses:**
  - `403`: Access denied (not owner/admin)
  - `404`: Order not found

---

### 6. Delete Order
- **Route:** `DELETE /orders/:id`
- **Auth Required:** Yes (JWT)
- **URL Parameters:**
  - `id` (required): Order MongoDB ObjectId
- **Response (200):**
  ```json
  {
    "message": "Order deleted successfully."
  }
  ```
- **Authorization:** Owner or Admin
- **Error Responses:**
  - `403`: Access denied
  - `404`: Order not found

---

### 7. Initiate Khalti Payment
- **Route:** `POST /orders/:id/payment/khalti`
- **Auth Required:** Yes (JWT)
- **URL Parameters:**
  - `id` (required): Order MongoDB ObjectId
- **Request Body:** Empty
- **Response (200):**
  ```json
  {
    "payment_url": "string (Khalti hosted payment URL)"
  }
  ```
- **Side Effect:**
  - Creates Payment record with method "khalti" and status "PENDING"
  - Links Payment to Order
- **Error Responses:**
  - `403`: Not order owner
  - `404`: Order not found

---

### 8. Confirm Order Payment
- **Route:** `PUT /orders/:id/confirm-payment`
- **Auth Required:** Yes (JWT)
- **URL Parameters:**
  - `id` (required): Order MongoDB ObjectId
- **Request Body:**
  ```json
  {
    "status": "string (COMPLETED)"
  }
  ```
- **Response (200):** Updated order with status "CONFIRMED"
- **Side Effect:**
  - Updates Payment status to "COMPLETED"
  - Updates Order status to "CONFIRMED"
- **Authorization:** Order owner or Admin
- **Error Responses:**
  - `400`: Payment status not COMPLETED
  - `403`: Access denied
  - `404`: Order not found

---

## Users APIs

### 1. Get Current User Profile
- **Route:** `GET /users/profile`
- **Auth Required:** Yes (JWT)
- **Response (200):**
  ```json
  {
    "_id": "string (ObjectId)",
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": {
      "city": "string",
      "province": "string",
      "country": "string",
      "street": "string"
    },
    "roles": ["string"],
    "profileImageUrl": "string",
    "createdAt": "ISO 8601 date"
  }
  ```
- **Note:** Password is excluded

---

### 2. Create User (Admin Only)
- **Route:** `POST /users`
- **Auth Required:** Yes (JWT) + Admin role
- **Request Body:**
  ```json
  {
    "name": "string (required)",
    "email": "string (required, unique)",
    "password": "string (required, min 6 chars)",
    "phone": "string (required, unique)",
    "address": {
      "city": "string (optional)",
      "province": "string (optional)",
      "country": "string (optional, default: Nepal)",
      "street": "string (optional)"
    },
    "roles": ["string"] (optional, default: ["USER"])
  }
  ```
- **Response (201):** User object (without password)
- **Note:** Password is hashed via bcrypt
- **Error Responses:**
  - `401`: Not authenticated
  - `403`: Not admin
  - `400`: Email/phone already exists

---

### 3. Get All Users (Admin Only)
- **Route:** `GET /users`
- **Auth Required:** Yes (JWT) + Admin role
- **Response (200) - Array:** Array of user objects (without passwords), sorted by creation date
  ```json
  [
    {
      "_id": "string (ObjectId)",
      "name": "string",
      "email": "string",
      "phone": "string",
      "address": {...},
      "roles": ["string"],
      "profileImageUrl": "string",
      "createdAt": "ISO 8601 date"
    }
  ]
  ```

---

### 4. Get User By ID (Admin Only)
- **Route:** `GET /users/:id`
- **Auth Required:** Yes (JWT) + Admin role
- **URL Parameters:**
  - `id` (required): User MongoDB ObjectId
- **Response (200):** Single user object (without password)
- **Error Responses:**
  - `404`: User not found

---

### 5. Update User
- **Route:** `PUT /users/:id`
- **Auth Required:** Yes (JWT)
- **URL Parameters:**
  - `id` (required): User MongoDB ObjectId
- **Request Body:**
  ```json
  {
    "name": "string (optional)",
    "phone": "string (optional)",
    "address": {
      "city": "string (optional)",
      "province": "string (optional)",
      "country": "string (optional)",
      "street": "string (optional)"
    }
  }
  ```
- **Response (200):** Updated user object (without password)
- **Authorization:** User can update own profile or admin can update any
- **Error Responses:**
  - `403`: Not owner/admin
  - `404`: User not found

---

### 6. Update Profile Image
- **Route:** `PATCH /users/:id/profile-image`
- **Auth Required:** Yes (JWT)
- **URL Parameters:**
  - `id` (required): User MongoDB ObjectId
- **Multipart Form Data:**
  ```
  image (file, required): Image file (uploaded to Cloudinary)
  ```
- **Response (200):**
  ```json
  {
    "_id": "string (ObjectId)",
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": {...},
    "roles": ["string"],
    "profileImageUrl": "string (new Cloudinary URL)",
    "createdAt": "ISO 8601 date"
  }
  ```
- **Authorization:** User can update own or admin can update any
- **Error Responses:**
  - `400`: Image file missing
  - `403`: Not authorized
  - `404`: User not found

---

### 7. Delete User (Admin Only)
- **Route:** `DELETE /users/:id`
- **Auth Required:** Yes (JWT) + Admin role
- **URL Parameters:**
  - `id` (required): User MongoDB ObjectId
- **Response (200):**
  ```json
  {
    "message": "User deleted successfully."
  }
  ```
- **Error Responses:**
  - `404`: User not found

---

## Contact APIs

### 1. Create Contact Message (Public)
- **Route:** `POST /contact`
- **Auth Required:** No
- **Multipart Form Data:**
  ```
  name (string, required): Sender name
  phone (string, required): Sender phone number
  email (string, optional): Sender email
  subject (string, required): Message subject
  message (string, required): Message body
  attachment (file, optional): File attachment (max 50MB)
  ```
- **Response (201):**
  ```json
  {
    "message": "Message sent successfully.",
    "data": {
      "_id": "string (ObjectId)",
      "name": "string",
      "phone": "string",
      "email": "string",
      "subject": "string",
      "message": "string",
      "attachmentUrl": "string (Cloudinary URL, if provided)",
      "isRead": false,
      "createdAt": "ISO 8601 date"
    }
  }
  ```
- **Side Effect:** Sends email notification to radhanaart@gmail.com
- **Error Responses:**
  - `400`: Required field missing (name, phone, subject, message)

---

### 2. Get All Messages (Admin Only)
- **Route:** `GET /contact`
- **Auth Required:** Yes (JWT) + Admin role
- **Response (200) - Array:**
  ```json
  [
    {
      "_id": "string (ObjectId)",
      "name": "string",
      "phone": "string",
      "email": "string",
      "subject": "string",
      "message": "string",
      "attachmentUrl": "string (if provided)",
      "isRead": "boolean",
      "createdAt": "ISO 8601 date"
    }
  ]
  ```
- **Sorted:** By creation date (newest first)

---

### 3. Mark Message As Read (Admin Only)
- **Route:** `PATCH /contact/:id/read`
- **Auth Required:** Yes (JWT) + Admin role
- **URL Parameters:**
  - `id` (required): Contact message ObjectId
- **Response (200):**
  ```json
  {
    "_id": "string (ObjectId)",
    "name": "string",
    "phone": "string",
    "email": "string",
    "subject": "string",
    "message": "string",
    "attachmentUrl": "string",
    "isRead": true,
    "createdAt": "ISO 8601 date"
  }
  ```

---

### 4. Delete Message (Admin Only)
- **Route:** `DELETE /contact/:id`
- **Auth Required:** Yes (JWT) + Admin role
- **URL Parameters:**
  - `id` (required): Contact message ObjectId
- **Response (200):**
  ```json
  {
    "message": "Message deleted."
  }
  ```
- **Error Responses:**
  - `404`: Message not found

---

## Gallery APIs

### 1. Get Gallery
- **Route:** `GET /gallery`
- **Auth Required:** No
- **Query Parameters:**
  ```
  cat (string): Filter by category (enum: wooden, qr, keyring, award, numberplate, signboard, neon, mug, leafart, or "all")
  ```
- **Response (200) - Array:**
  ```json
  [
    {
      "_id": "string (ObjectId)",
      "title": "string",
      "description": "string",
      "cat": "string",
      "imageUrls": ["string (Cloudinary URLs)"],
      "isActive": "boolean",
      "createdBy": "string (ObjectId)",
      "createdAt": "ISO 8601 date"
    }
  ]
  ```
- **Sorted:** By creation date (newest first)

---

### 2. Create Gallery Item (Admin Only)
- **Route:** `POST /gallery`
- **Auth Required:** Yes (JWT) + Admin role
- **Multipart Form Data:**
  ```
  title (string, required): Gallery item title
  description (string, optional): Item description
  cat (string, required): Category (enum: wooden, qr, keyring, award, numberplate, signboard, neon, mug, leafart)
  images (files, required): At least one image file (max 10 files)
  ```
- **Response (201):**
  ```json
  {
    "_id": "string (ObjectId)",
    "title": "string",
    "description": "string",
    "cat": "string",
    "imageUrls": ["string (Cloudinary URLs)"],
    "isActive": true,
    "createdBy": "string (ObjectId)",
    "createdAt": "ISO 8601 date"
  }
  ```
- **Error Responses:**
  - `401`: Not authenticated
  - `403`: Not admin
  - `400`: At least one image is required

---

### 3. Update Gallery Item (Admin Only)
- **Route:** `PUT /gallery/:id`
- **Auth Required:** Yes (JWT) + Admin role
- **URL Parameters:**
  - `id` (required): Gallery item ObjectId
- **Multipart Form Data:**
  ```
  title (string, optional): Updated title
  description (string, optional): Updated description
  cat (string, optional): Updated category
  images (files, optional): New images (max 10 files, replaces old ones if provided)
  ```
- **Response (200):** Updated gallery item object
- **Error Responses:**
  - `401`: Not authenticated
  - `403`: Not admin
  - `404`: Gallery item not found

---

### 4. Delete Gallery Item (Admin Only)
- **Route:** `DELETE /gallery/:id`
- **Auth Required:** Yes (JWT) + Admin role
- **URL Parameters:**
  - `id` (required): Gallery item ObjectId
- **Response (200):**
  ```json
  {
    "message": "Gallery item deleted."
  }
  ```
- **Note:** Soft delete (sets `isActive` to false)
- **Error Responses:**
  - `404`: Gallery item not found

---

## Data Models

### User Model
```javascript
{
  _id: ObjectId,
  name: String (required, trimmed),
  email: String (required, unique, lowercase, valid email),
  password: String (required, min 6 chars, hashed),
  phone: String (required, unique),
  address: {
    city: String (default: ""),
    province: String (default: ""),
    country: String (default: "Nepal"),
    street: String (default: "")
  },
  roles: [String] (default: ["USER"], enum: ["USER", "ADMIN"]),
  profileImageUrl: String (default: ""),
  createdAt: Date (immutable, default: now)
}
```

### Product Model
```javascript
{
  _id: ObjectId,
  name: String (required, trimmed),
  category: String (required, enum: [wooden, qr, keyring, award, numberplate, signboard, neon, mug, leafart]),
  cat: String (enum: [personalized, corporate, homedecor], default: personalized),
  description: String (default: ""),
  price: Number (required, positive),
  maxPrice: Number (default: 0),
  stock: Number (default: 99, max: 100000),
  inStock: Boolean (default: true),
  imageUrls: [String] (default: []),
  badge: String (enum: ["", Popular, New, Trending, Hot, Sale, Premium, Unique], default: ""),
  stars: Number (default: 5, min: 1, max: 5),
  reviews: Number (default: 0),
  popular: Boolean (default: false),
  forWho: [String] (default: []),
  festival: [String] (default: []),
  occasion: [String] (default: []),
  createdBy: ObjectId (ref: User, required),
  isActive: Boolean (default: true),
  createdAt: Date (immutable, default: now)
}
```

### Order Model
```javascript
{
  _id: ObjectId,
  orderNumber: String (required, unique, format: RA-TIMESTAMP-RANDOM),
  user: ObjectId (ref: User, required),
  orderItems: [
    {
      product: ObjectId (ref: Product, required),
      quantity: Number (default: 1),
      price: Number (required, snapshot at order time)
    }
  ],
  status: String (default: PENDING, enum: [PENDING, CONFIRMED, SHIPPED, DELIVERED]),
  totalPrice: Number (required),
  shippingAddress: {
    firstName: String (required),
    lastName: String (required),
    phone: String (required),
    email: String (required),
    street: String (required),
    city: String (required),
    landmark: String (default: ""),
    country: String (default: "Nepal")
  },
  designFileUrl: String (default: ""),
  orderNotes: String (default: ""),
  paymentMethod: String (enum: [esewa, khalti, bank, cod, cash], default: cod),
  payment: ObjectId (ref: Payment),
  createdAt: Date (immutable, default: now)
}
```

### Payment Model
```javascript
{
  _id: ObjectId,
  amount: Number (required),
  method: String (required, enum: [cash, cod, esewa, khalti, bank]),
  status: String (default: PENDING, enum: [PENDING, COMPLETED, FAILED]),
  transactionId: String (default: ""),
  createdAt: Date (default: now)
}
```

### Contact Model
```javascript
{
  _id: ObjectId,
  name: String (required, trimmed),
  phone: String (required),
  email: String (default: "", lowercase, trimmed),
  subject: String (required),
  message: String (required),
  attachmentUrl: String (default: ""),
  isRead: Boolean (default: false),
  createdAt: Date (immutable, default: now)
}
```

### Gallery Model
```javascript
{
  _id: ObjectId,
  title: String (required, trimmed),
  description: String (default: ""),
  cat: String (required, enum: [wooden, qr, keyring, award, numberplate, signboard, neon, mug, leafart]),
  imageUrls: [String] (required, at least one),
  isActive: Boolean (default: true),
  createdBy: ObjectId (ref: User),
  createdAt: Date (immutable, default: now)
}
```

---

## Constants & Enums

### User Roles
```
USER = "USER"
ADMIN = "ADMIN"
```

### Order Statuses
```
ORDER_STATUS_PENDING = "PENDING"
ORDER_STATUS_CONFIRMED = "CONFIRMED"
ORDER_STATUS_SHIPPED = "SHIPPED"
ORDER_STATUS_DELIVERED = "DELIVERED"
```

### Payment Statuses
```
PAYMENT_STATUS_PENDING = "PENDING"
PAYMENT_STATUS_COMPLETED = "COMPLETED"
PAYMENT_STATUS_FAILED = "FAILED"
```

### Product Categories
```
Enum: [
  "wooden",
  "qr",
  "keyring",
  "award",
  "numberplate",
  "signboard",
  "neon",
  "mug",
  "leafart"
]
```

### Product Catalog Groups
```
Enum: [
  "personalized",
  "corporate",
  "homedecor"
]
```

### Product Badges
```
Enum: [
  "",
  "Popular",
  "New",
  "Trending",
  "Hot",
  "Sale",
  "Premium",
  "Unique"
]
```

### Payment Methods
```
Enum: [
  "esewa",
  "khalti",
  "bank",
  "cod",
  "cash"
]
```

---

## General Notes

### Authentication
- All protected endpoints require a valid JWT token in the `authToken` cookie
- JWT is issued on login/register and is valid for 1 day
- Middleware checks token validity before granting access

### Authorization
- Some endpoints require Admin role
- Some endpoints can be accessed by the resource owner or admin

### File Uploads
- Files are uploaded to **Cloudinary** (cloud storage)
- Upload limits: 50MB per file
- Product images: max 5 files per upload
- Gallery images: max 10 files per upload
- Design files in orders: single file upload

### Error Handling
- All errors return JSON with `message` field
- Status codes: 400 (bad request), 401 (unauthorized), 403 (forbidden), 404 (not found), 500 (server error)
- Password is never returned in responses

### Soft Deletes
- Products and gallery items use soft delete (isActive flag)
- Orders, users, and contacts use hard delete

### Query Filtering
- Products support flexible filtering via query parameters
- Gallery supports category filtering
- Orders/users/contacts return all records (consider pagination)

### Timestamps
- All dates are ISO 8601 format
- `createdAt` is immutable (set only on creation)
- Used for sorting (newest first by default)
