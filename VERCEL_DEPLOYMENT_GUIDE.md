# 🚀 Vercel Deployment Guide — JoharSetu (Frontend & Backend)

इस गाइड में **Frontend** और **Backend** को Vercel पर 100% सही और एरर-फ्री डेप्लॉय करने की पूरी स्टेप-बाय-स्टेप प्रक्रिया समझाई गई है।

---

## 📌 Phase 1: Deploy Frontend First (Step-by-Step)

Frontend को Vercel पर डेप्लॉय करना बहुत आसान है क्योंकि हमने पहले ही:
- SPA Client-Side Routing के लिए `FRONTEND/vercel.json` (Rewrites) जोड़ दिया है (पेज रिफ्रेश करने पर 404 नहीं आएगा)।
- सभी हार्डकोडेड `localhost:3000` URLs हटाकर डायनामिक `apiClient` और `mediaUtils` में बदल दिया है।
- Production Bundle Code-Splitting ऑप्टिमाइज़ कर दी है।

### Step 1: Vercel Dashboard पर जाएं
1. [vercel.com](https://vercel.com) में लॉगिन करें।
2. **"Add New..."** पर क्लिक करके **"Project"** चुनें।
3. अपना GitHub Repository (`SIH_2026`) Import करें।

### Step 2: Configure Project Settings
- **Project Name**: `joharsetu-frontend` (या अपनी पसंद का नाम)
- **Framework Preset**: `Vite` (Vercel इसे ऑटो-डिटेक्ट कर लेगा)
- **Root Directory**: ⚠️ **बहुत ज़रूरी:** **Edit** पर क्लिक करें और `FRONTEND` सेलेक्ट करें।
- **Build and Output Settings**:
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Install Command: `npm install`

### Step 3: Environment Variables जोड़ें
Vercel के **Environment Variables** सेक्शन में निम्न वेरिएबल्स सेट करें:

| Variable Name | Value (Example) | विवरण |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `https://your-backend.vercel.app/api/v1/` | आपके Backend API का URL (यदि बैकएंड बाद में डेप्लॉय करना है तो अभी आप लोकल या अस्थायी बैकएंड URL डाल सकते हैं) |
| `VITE_BACKEND_URL` | `https://your-backend.vercel.app` | बिना ट्रेलिंग स्लैश के बैकएंड रूट (मीडिया स्ट्रीमिंग व सॉकेट्स हेतु) |
| `VITE_SOCKET_URL` | `https://your-backend.vercel.app` | Socket.IO सर्वर URL |
| `VITE_API_TIMEOUT` | `15000` | API टाइमआउट (मिलीसेकंड) |

> 💡 **टिप**: अगर आपने अभी बैकएंड डेप्लॉय नहीं किया है, तो भी आप Frontend डेप्लॉय कर सकते हैं। जब बैकएंड डेप्लॉय हो जाएगा, तब Vercel Dashboard -> Settings -> Environment Variables में जाकर `VITE_API_BASE_URL` और `VITE_BACKEND_URL` को अपडेट करके एक बार **Redeploy** कर दीजिएगा!

### Step 4: Deploy पर क्लिक करें
- **"Deploy"** बटन दबाएं।
- विदिन 1-2 मिनट में आपका Frontend लाइव हो जाएगा: `https://joharsetu-frontend.vercel.app`!

---

## 📌 Phase 2: Deploy Backend (Step-by-Step)

Backend को Vercel Serverless Functions के रूप में तैयार कर दिया गया है:
- Entry point: `BACKEND/api/index.js`
- Route rewrites: `BACKEND/vercel.json`
- Mongoose Connection Reuse & Cold Start Protection: एक्टिवेटेड
- Admin Auto-Bootstrap: एक्टिवेटेड
- Cloudinary Storage: रेडी

### Step 1: Vercel Dashboard पर नया प्रोजेक्ट जोड़ें
1. Vercel में **"Add New..."** -> **"Project"** पर जाएं।
2. उसी Repository (`SIH_2026`) को दोबारा Import करें।

### Step 2: Configure Project Settings
- **Project Name**: `joharsetu-backend`
- **Framework Preset**: `Other`
- **Root Directory**: ⚠️ **Edit** पर क्लिक करें और `BACKEND` सेलेक्ट करें।

### Step 3: Environment Variables जोड़ें
Vercel के **Environment Variables** सेक्शन में निम्न वेरिएबल्स डालें (अपने असली क्रेडेंशियल्स के साथ):

```env
NODE_ENV=production
PORT=3000
URL=mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/joharsetu?retryWrites=true&w=majority
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/joharsetu?retryWrites=true&w=majority
JWT_ACCESS_SECRET=your_super_secret_jwt_access_key_min_32_characters_long
JWT_REFRESH_SECRET=your_super_secret_jwt_refresh_key_min_32_characters_long
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=30d
CORS_ORIGINS=*
STORAGE_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name
GOVT_ADMIN_EMAIL=admin@jharkhand.gov.in
GOVT_ADMIN_PASSWORD=Admin@12345
DEFAULT_NODAL_PASSWORD=Nodal@12345
```

### Step 4: Deploy पर क्लिक करें
- **"Deploy"** बटन दबाएं।
- Vercel पर आपका Backend API लाइव हो जाएगा: `https://joharsetu-backend.vercel.app/`
- टेस्ट करने के लिए ब्राउज़र में खोलें: `https://joharsetu-backend.vercel.app/health`

---

## ⚡ Real-Time Socket.IO Note for Production
- Vercel Serverless Functions HTTP रिक्वेस्ट्स पर काम करती हैं और कुछ सेकंड बाद स्लीप मोड में चली जाती हैं।
- अगर आपको रियल-टाइम Socket.IO (लाइव चैट / इंस्टेंट टोस्ट अपडेट्स) 24/7 चाहिए, तो Backend को **Render / Railway / Fly.io** जैसी परसिस्टेंट नोड होस्टिंग पर भी चला सकते हैं, या Vercel पर बैकएंड चलाकर सॉकेट के लिए Pusher/Ably का इस्तेमाल कर सकते हैं।
- फिर भी, यदि आप बैकएंड को Vercel पर ही डेप्लॉय करते हैं, तो JoharSetu का पूरा REST API, Auth, MongoDB CRUD, PDF Reports, Media Streaming, Admin & Nodal Portals बिना किसी रुकावट के मक्खन की तरह चलेंगे।
