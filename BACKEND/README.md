# SIH 2026 Monolithic Backend

Yeh SIH 2026 project ka production-ready modular monolithic backend hai. Isko ES Modules, Express, Mongoose, aur Pino use karke banaya gaya hai. Isme authentication, role checks, local memory rate limiting, aur ek async background email queue features setup hain.

## Port 3000 Clean Up (EADDRINUSE Solution)
Agar port 3000 kisi background node process ki wajah se blocked hai, toh Windows PowerShell mein ye command run karke usko force kill karein:
```powershell
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
```

## Setup aur Run Kaise Karein

1. Dependencies install karein:
```bash
npm install
```

2. `.env` file ko root par configure karein:
```env
PORT=3000
MONGO_URI=mongodb+srv://...
JWT_ACCESS_SECRET=your_32_character_access_secret
JWT_REFRESH_SECRET=your_32_character_refresh_secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
CORS_ORIGINS=*
LOG_LEVEL=info
```

3. Development server run karein (watch mode ke saath):
```bash
npm run dev
```

4. Tests run karein:
```bash
npm run test
```

## Scalability aur Architecture Choices

Humne is monolithic system ko highly scalable aur database-agnostic banane ke liye ye core patterns use kiye hain:

1. **Stateless Authentication (JWT & HttpOnly Cookies):**
   * **Kyu:** Hum local memory mein session states save nahi kar rahe hain. JWT tokens application state check handle karte hain aur refresh token secure cookie mein process hota hai. Isse nodes completely stateless ho jate hain aur iske multiple servers instances horizontal scaling (behind load balancers) bina sync problem ke support karte hain.

2. **Clean Architecture Isolation:**
   * **Kyu:** Core business rule code logic (`service.js`) database engine queries implementation (`repository.js`) se decoupled hai. Agar future mein database change karna ho (jaise Mongoose/MongoDB se PostgreSQL/SQL/Sequelize or Prisma), toh controllers, validation, aur services file code 100% same rahega, bas infrastructure repository layer ko badalna hoga.

3. **Asynchronous Background Processing Queue:**
   * **Kyu:** CPU and I/O intensive tasks (jaise email dispatch functions, password hash encryption compute hashes) ko event loop block karne ke bajay background asynchronous runner queue ([queue.js](file:///e:/SIH_2026/BACKEND/src/infrastructure/queue/queue.js)) me process kiya jata hai. Isse response latency sub-millisecond level tak drops hoti hai.

4. **Database Connection Pooling:**
   * **Kyu:** [client.js](file:///e:/SIH_2026/BACKEND/src/infrastructure/database/mongo/client.js) mein max-pool limits set kiye gaye hain connection leaks aur port resource exhaustion rokne ke liye, jisse cloud systems database scalability support karte hain.

5. **In-Memory Rate Limiting:**
   * **Kyu:** Brute force authentication page request spamming handle karne ke liye local ip parameters check configuration rate limit triggers control kiya gaya hai server performance save karne ke liye.

## Folder Structure

Yeh backend modular monolith pattern follow karta hai. Saare modules independently `src/modules/` directory ke andar self-contained hain:
* `src/modules/auth/` - Token management, register, login, refresh, logout, aur password reset operations.
* `src/modules/users/` - User database schemas, repository queries (abhi ke liye isme routes/controllers nahi hain, sirf auth ke integration ke liye required db operations hain).
* `src/infrastructure/` - Mongoose database client singleton aur async background job queue.
* `src/shared/` - Error validation middleware, structured logging handlers, cookies, authenticate checking aur rate limiting parameters.

## Authentication System (Frontend Developers ke liye guide)

Hum double-token authentication flow use kar rahe hain:
1. **Access Token (JWT):** Yeh short-lived (15 minutes expiry) token hota hai jo login/refresh response body mein wapas milta hai. Frontend ko ise memory (state) mein save karna chahiye aur har API request ke `Authorization` header mein `Bearer <token>` format mein send karna chahiye.
2. **Refresh Token:** Yeh long-lived (7 days expiry) token hota hai jo automatically browser ke secure `HttpOnly` and `SameSite=Strict` cookie mein save ho jata hai (jiska naam `refreshToken` hai). Frontend ko isko read/write karne ki zaroorat nahi hai, browser ise automatic send kar deta hai.
3. **Reused Token Protection:** Agar koi purana ya invalid refresh token double hit hota hai, toh security reason ke liye us user ke saare active sessions DB se immediately delete ho jayenge.

## API Endpoints

Saare endpoints `/api/v1` base route ke under chalte hain.

### 1. Register User
Naya user account create karta hai aur verification email ko queue ke through background me trigger karta hai.

* **URL:** `/api/v1/auth/register`
* **Method:** `POST`
* **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```
* **Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "64ebd3fae...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "fullName": "John Doe",
    "role": "customer",
    "isEmailVerified": false,
    "createdAt": "2026-08-23T03:45:00.000Z",
    "updatedAt": "2026-08-23T03:45:00.000Z"
  }
}
```

### 2. Login
Email/password authenticate karta hai, body mein access token bhejta hai aur browser par HttpOnly cookie set karta hai.

* **URL:** `/api/v1/auth/login`
* **Method:** `POST`
* **Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
* **Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64ebd3fae...",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "role": "customer",
      "isEmailVerified": false,
      "createdAt": "2026-08-23T03:45:00.000Z",
      "updatedAt": "2026-08-23T03:45:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR..."
  }
}
```

### 3. Refresh Token
Old token ko rotate karke naya access token generate karta hai. Browser cookies ke sath automatic handle karta hai, ya fir raw body param se send karein.

* **URL:** `/api/v1/auth/refresh`
* **Method:** `POST`
* **Request Body (Optional):**
```json
{
  "refreshToken": "optional_token_string"
}
```
* **Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR..."
  }
}
```

### 4. Logout
Refresh token ko database se delete/revoke karta hai aur browser cookie clear karta hai.

* **URL:** `/api/v1/auth/logout`
* **Method:** `POST`
* **Request Body (Optional):**
```json
{
  "refreshToken": "optional_token_string"
}
```
* **Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

### 5. Forgot Password
Password reset request receive karta hai, secure hash DB mein save karta hai aur mail background me queue kar deta hai.

* **URL:** `/api/v1/auth/forgot-password`
* **Method:** `POST`
* **Request Body:**
```json
{
  "email": "user@example.com"
}
```
* **Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "If the email exists, a password reset link has been sent"
  }
}
```
