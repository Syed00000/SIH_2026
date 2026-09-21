# Module 02: Infrastructure Layer

> **Module Path:** `src/infrastructure/`  
> **Type:** Low-Level Technical Drivers & Communications Layer  
> **Key Technologies:** Axios, Native Fetch, WebSockets (`socket.io-client`), JWT Token Storage, AI Client Boundaries

---

## 1. Module Ka Purpose (Kyu aur Kya Kaam Hai)

Ye module application ka technical backbone hai. Iska kaam business domain logic ko low-level technical concerns (jaise HTTP calls, silent token refresh queues, WebSocket connections, network timeouts, aur third-party AI APIs) se decouple karna hai. Agar kal ko backend authentication protocol ya socket URL change hota hai, to sirf ye layer update hoti hai, kisi feature component ko modify nahi karna padta.

---

## 2. Directory Structure & Files

```
src/infrastructure/
├── ai/
│   └── client.js          # Independent AI client abstraction (classify, duplicate detection, etc.)
├── api/
│   ├── client.js          # Core HTTP client with JWT Silent Rotation & Concurrency Queue
│   ├── errors.js          # Unified ApiError class & status code normalizer
│   └── tokenStorage.js    # Secure in-memory token state manager
├── config.js              # Environment validated parameters (API Base URL, Timeouts)
└── socket/
    └── socketClient.js    # Central Socket.IO WebSocket client & event hub
```

---

## 3. Sub-Modules & Deep-Dive Functionality

### 3.1 `api/client.js` (HTTP Client & Silent Token Rotation Queue)
- **Technology:** Native `fetch`, JSON parser, URLSearchParams.
- **Silent Token Rotation Queue Mechanism:**
  - **In-Memory Storage:** Short-lived access token ko browser memory me rakha jata hai (LocalStorage/SessionStorage me token nahi rakha jata taaki XSS attack se bacha ja sake).
  - **401 Interception:** Jab koi protected API call expire hone par HTTP 401 Unauthorized return karti hai, ye client call ko immediate fail nahi karta.
  - **Locking & Queueing:**
    - `isRefreshing` flag ko true mark kiya jata hai.
    - Saath hi chalne wali baaki parallel API calls reject hone ke bajay ek `refreshSubscribers` array me wait karti hain.
  - **Silent Refresh Call:** Background me `/api/v1/auth/refresh` endpoint call hota hai HttpOnly cookie ya refresh token pass karke.
  - **Queue Resolution:** Naya Access Token aate hi, `refreshSubscribers` ke saare pending promises resolve ho jate hain aur original API calls automatically repeat ho jati hain bina user ko pata chale ya screen blink hue.
  - **Session Expiry:** Agar refresh token bhi expire ya cancel ho chuka ho, to `onUnauthorizedCallback` trigger hota hai jo memory state reset karke user ko login screen redirect karta hai.
- **Transient Network Retry:** Network latency ya server restart hone par 3 baar exponential backoff retry (`networkRetryCount`) execute hota hai.
- **HTTP Methods Expose:** `apiClient.get()`, `post()`, `upload()` (FormData support), `put()`, `patch()`, `delete()`.

### 3.2 `api/tokenStorage.js` (Secure In-Memory Token Manager)
- **Functionality:**
  - Access Token ko JavaScript variable closure me safely store karta hai (`accessToken = token`).
  - Functions: `getAccessToken()`, `setAccessToken(token)`, `getRefreshToken()`, `setRefreshToken(token)`, `clearTokens()`.
  - Application band hone par tokens automatically memory se dump ho jate hain, zero persistent security footprints.

### 3.3 `api/errors.js` (Unified Error Normalization)
- **Functionality:**
  - Custom `ApiError` class jo runtime network exceptions, timeout issues, validation error arrays, aur server 500 faults ko user-friendly readable message me convert karti hai.
  - Status code mapping:
    - 400: Bad Request / Form Validation Error
    - 401: Invalid Credentials / Session Timeout
    - 403: Forbidden / Insufficient Permissions
    - 404: Resource Not Found
    - 429: Rate Limit Exceeded (Too many attempts)
    - 500+: Internal Server Error

### 3.4 `socket/socketClient.js` (Real-Time WebSocket Engine)
- **Technology:** `socket.io-client` (`^4.8.3`).
- **Functionality:**
  - Singleton Socket instance (`getSocket()`).
  - Automatic reconnection with 20 retry attempts, 500ms initial delay, and dual transports (`['websocket', 'polling']`).
  - **Key Event Dispatchers:**
    - `registerUserSocket(user)`: User id, user role, aur university code emit karta hai taaki server socket mapping save kar sake.
    - `joinChallengeRoom(challengeId, user)`: Challenge-specific private discussion room me user ko connect karta hai.
    - `leaveChallengeRoom(challengeId)`: Modal band hone par room leave karta hai taaki memory leaks na hon.
    - `sendSocketMessage(payload, callback)`: Live message dispatch karta hai.
    - `emitTyping` & `emitStopTyping`: Real-time user typing indicators broadcast karta hai.
    - `deleteSocketMessage(data, callback)`: Live chat deletion propagate karta hai.

### 3.5 `ai/client.js` (AI Abstraction Boundary)
- **Functionality:**
  - Application components ko OpenAI ya third-party SDKs se isolate rakhta hai.
  - Exposes standardized AI state constants (`AI_STATUS.IDLE`, `PROCESSING`, `COMPLETED`, `UNAVAILABLE`).
  - Methods:
    - `classify(payload)`: Challenge statements ko auto-tag karta hai.
    - `detectDuplicates(payload)`: Pehle se submitted similar grievances detect karta hai.
    - `getRecommendations(payload)`: Best university lab matching suggest karta hai.
    - `summarize(payload)`: Long citizen testimonies ko executive brief me summarize karta hai.

### 3.6 `config.js` (Environment Configuration)
- **Functionality:**
  - `import.meta.env.VITE_API_BASE_URL` se backend URL (`http://127.0.0.1:3000/api/v1/`) bind karta hai.
  - Fallback defaults aur timeouts (10000ms) configure karta hai.
