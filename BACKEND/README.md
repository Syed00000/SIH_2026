# JoharSetu Backend

JoharSetu modular monolith backend framework hai. System Express, Mongoose, Nodemailer SMTP, aur Bcrypt par structured hai.

---

## 1. Environment & Setup Guide

### Environment Configuration (`.env`)
```env
PORT=3000
URL=mongodb+srv://officialsamadhan043_db_user:mtzjk9Brhkg6AWPc@samadhan043.uzxwt7j.mongodb.net/
JWT_ACCESS_SECRET=d8a4362bca393c834a36f56477d9494ad6abce6279f187a552bfdb17cf5ad8d8
JWT_REFRESH_SECRET=b6540bce32a39281a8fceaa7390df8ceb6238bfa7162bcbe6278ea1f4864a78c
CORS_ORIGINS=http://localhost:5173
EMAIL_USER=officialsamadhan043@gmail.com
EMAIL_PASS=golq ocsq tcqk pcxg
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

### Installation & Commands
1. Dependencies Install Karein:
```bash
npm install
```

2. Development Server Run Karein:
```bash
npm run dev
```

3. Integration Test Suite Run Karein:
```bash
npm test
```

---

## 2. Database Architecture (Single User Model)

Backend me profile separation ke liye alag se CitizenProfile, UniversityProfile ya IndustryProfile collections nahi banaye gaye hain. Sabhi problem senders ka data single collection `users` ke under store hota hai.

### User Schema Definition (`src/modules/users/infrastructure/model.js`)

- `fullName`: String (Required, 2-100 characters)
- `mobileNumber`: String (Required, Unique, 10-digit Indian Mobile Regex `/^[6-9]\d{9}$/`)
- `email`: String (Required, Unique, Lowercase)
- `passwordHash`: String (Required, `select: false`)
- `role`: String (Enum: `CITIZEN`, `UNIVERSITY`, `INDUSTRY`, Default: `CITIZEN`)
- `profile`: Object (Embedded sub-document according to role)
  - Citizen fields: `preferredLanguage`, `location` (`district`, `blockOrULB`, `panchayatOrWard`)
  - University fields: `institutionName`, `aisheCode`, `registrationNumber`, `institutionType`, `nodalOfficerDesignation`, `academicFocusDomains`
  - Industry fields: `organizationName`, `entityType`, `cin`, `gstin`, `ngoDarpanId`, `primaryContactDesignation`, `supportSectors`
- `emailVerification`: `{ verified: Boolean, verifiedAt: Date }`
- `emailVerificationCode`: String (6-digit numeric OTP)
- `emailVerificationExpires`: Date (5 minutes TTL)
- `passwordResetOTP`: String (6-digit numeric OTP)
- `passwordResetExpires`: Date (15 minutes TTL)
- `accountStatus`: String (Enum: `PENDING_VERIFICATION`, `ACTIVE`, `SUSPENDED`, `BLOCKED`, Default: `PENDING_VERIFICATION`)
- `lastLoginAt`: Date
- `timestamps`: `createdAt`, `updatedAt`

---

## 3. API Endpoints Contract (`/api/v1/auth`)

### 1. Register User
- **Endpoint**: `POST /api/v1/auth/register`
- **Request Body**:
  ```json
  {
    "fullName": "Rahul Kumar",
    "mobileNumber": "9876543210",
    "email": "rahul@gmail.com",
    "password": "Password123!",
    "confirmPassword": "Password123!",
    "role": "CITIZEN",
    "profile": {
      "preferredLanguage": "HINDI",
      "location": {
        "district": "Ranchi",
        "blockOrULB": "Kanke"
      }
    }
  }
  ```
- **Validation**: Passwords match check, duplicate email/mobile check, password hashing using bcrypt, 6-digit OTP generation (5 min expiry), user creation with `accountStatus: 'PENDING_VERIFICATION'`, SMTP email dispatch via background queue.
- **Success Response (201)**:
  ```json
  {
    "success": true,
    "message": "Registration successful. Please verify your email.",
    "data": {
      "userId": "64e000000000000000000100",
      "email": "rahul@gmail.com",
      "role": "CITIZEN",
      "emailVerificationRequired": true
    }
  }
  ```

### 2. Verify Email OTP
- **Endpoint**: `POST /api/v1/auth/verify-email`
- **Request Body**:
  ```json
  {
    "email": "rahul@gmail.com",
    "otp": "482931"
  }
  ```
- **Process**: Validates 6-digit OTP code against expiry, sets `emailVerification.verified = true`, `emailVerification.verifiedAt = now`, `accountStatus = 'ACTIVE'`, clears OTP code.
- **Success Response (200)**:
  ```json
  {
    "success": true,
    "message": "Email verified successfully. You can now login.",
    "data": {
      "emailVerified": true,
      "accountStatus": "ACTIVE"
    }
  }
  ```

### 3. Resend Verification OTP
- **Endpoint**: `POST /api/v1/auth/resend-verification-otp`
- **Request Body**: `{ "email": "rahul@gmail.com" }`
- **Process**: Only allowed for accounts in `PENDING_VERIFICATION` status. Generates new 6-digit OTP and dispatches via Nodemailer SMTP.

### 4. User Login
- **Endpoint**: `POST /api/v1/auth/login`
- **Request Body**:
  ```json
  {
    "email": "rahul@gmail.com",
    "password": "Password123!"
  }
  ```
- **Process**: Rejects if `emailVerification.verified !== true` (returns `EMAIL_NOT_VERIFIED`) or account is suspended/blocked. Validates password hash, updates `lastLoginAt`, issues JWT access token, and sets refresh token cookie.
- **Success Response (200)**:
  ```json
  {
    "success": true,
    "message": "Login successful.",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1Ni...",
      "user": {
        "id": "64e000000000000000000100",
        "fullName": "Rahul Kumar",
        "email": "rahul@gmail.com",
        "mobileNumber": "9876543210",
        "role": "CITIZEN"
      }
    }
  }
  ```

### 5. Get Authenticated User Profile
- **Endpoint**: `GET /api/v1/auth/me`
- **Headers**: `Authorization: Bearer <accessToken>`
- **Success Response (200)**: Returns user object with role and embedded profile data.

### 6. Forgot Password
- **Endpoint**: `POST /api/v1/auth/forgot-password`
- **Request Body**: `{ "email": "rahul@gmail.com" }`
- **Process**: Generates 6-digit reset OTP (15 min TTL) and sends via SMTP.

### 7. Reset Password
- **Endpoint**: `POST /api/v1/auth/reset-password`
- **Request Body**: `{ "email": "rahul@gmail.com", "otp": "123456", "newPassword": "NewPassword123!" }`

---

## 4. Live SMTP Email Integration (`src/infrastructure/email/smtpMailer.js`)

Email delivery Nodemailer library se connected hai:

- **Transporter Service**: Gmail SMTP (`smtp.gmail.com:587`)
- **Sender Account**: `officialsamadhan043@gmail.com`
- **App Password**: `golq ocsq tcqk pcxg`
- **Background Worker**: `src/infrastructure/queue/workers/email.worker.js` background queue se disconnected/non-blocking mode me OTP emails user ke inbox me deliver karta hai.

---

## 5. Zero-Downtime Resilience & In-Memory Fallback

Database operations me resilience guarantee karne ke liye:
- `MongoUserRepository` aur `MongoTokenRepository` Mongoose connection check karte hain (`readyState === 1`).
- Network drop ya Atlas database timeout hone par in-memory store automatically active ho jata hai, jisse Express server 3000 port par zero downtime ke sath bina hang hue responsive rehta hai.
