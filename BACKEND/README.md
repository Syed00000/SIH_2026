# ⚙️ JoharSetu — Backend

> **Smart India Hackathon (SIH 2026) Official Repository**  
> Enterprise RESTful API Service powering Citizen Ingestion, AI Triage, 4-Tier Department Governance, University R&D & Industry CSR Collaboration.

📖 **For comprehensive technical architecture, database schemas, security models, department flows, and sequence diagrams, see [ARCHITECTURE_README.md](./ARCHITECTURE_README.md).**

---

## ⚡ Quick Start

### 1. Environment Configuration
Ensure `.env` contains:
```env
PORT=3000
URL=mongodb+srv://...
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_app_password
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Backend runs at: `http://localhost:3000`

### 4. Run Integration Tests
```bash
npm test
```

---

## 🛡️ Multi-Tier Department Governance
JoharSetu models a complete 4-tier administration:
1. **State Ministries** (`State Ministry`)
2. **District Departments** (`District Department`)
3. **Block / Tehsil Offices** (`Block / Tehsil Office`)
4. **Gram Panchayats / Wards** (`Gram Panchayat`, `Ward Commissioner`)

All departments feature automated `deptId` generation, bcrypt password hashing, and synchronized authentication supporting both DeptID and Email login.
