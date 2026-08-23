# System Architecture & Development Handbook - University ERP Frontend

University ERP project ke frontend architecture, folder organization, coding standards, security parameters, aur future scale guidelines ke baare me sab details is document me hain.

---

## 1. System Design aur Architecture Decision (Kyu aur Kaise)

Humne is frontend me Feature-First + Domain/Entity hybrid architecture select kiya hai. 

### Why Hybrid Architecture?
Monolithic global components folder wale traditional layout me circular dependencies aur file placement path tracing build issues ban jate hain jab ERP badhta hai. Hybrid architecture business domain capabilities ko self-contained features me divide karta hai:
- Feature domain use-case ko self-contained banata hai (jaise register aur login screen logic features/auth me encapsulated hai).
- Reusable UI primitives ko pure business logic se door rakhta hai (jaise input, button controls shared UI me hain).
- Technical boundaries (API client, environment vars configuration) ko system logic se isolate karta hai (infrastructure folders).

Is design se scale badhne par developers ek doosre ke files se interact kare bina isolated folders me code compile kar sakte hain.

---

## 2. Technical Stack and Configurations

### Styling & CSS Architecture (Pure Tailwind CSS)
Humne design requirements ko fully clean rakhne ke liye pure utility tailwind css approach use kiya hai:
- `src/index.css` me koi custom normal CSS, manual CSS overrides, inline styling ya complex class bindings nahi hain. Ye sirf `@import "tailwindcss";` use karke direct utility base classes compile karta hai.
- Dark mode ko code aur UI controls se completely remove kar diya hai taaki light scheme clean aur robust rahe.
- Spacing aur margins standard classes (m-*, p-*, gap-*) ke default Tailwind parameters mapping follow karte hain.

### State & Routing (TanStack Query + TanStack Router)
- **TanStack Router**: File-system-based compiler logic use karne ke badle code-based routing configuration (`app/router.jsx`) use kiya hai. Isse simple JavaScript JSX environment me dynamic routing controls bina dependencies compile error ke render ho jate hain.
- **TanStack Query**: Har feature component query keys define karega (jaise `['auth', 'user']`). Ise client global state managers (jaise Redux ya Zustand) me sync or duplicate nahi kiya jayega, jo re-render overhead aur bugs badhata hai.

---

## 3. High-Security API Integration (Token Rotation Queue)

Application me identity verification aur API calls ko highly secure banane ke liye ye standard integration setup kiya hai:

### 1. Short-Lived Access Token (In-Memory)
Access token (JWT) register/login responses ke body data me wapas milta hai. Ise frontend local storage ya document cookies me save nahi karta (XSS attacks se security save rakhne ke liye). Ise temporary memory cache state me maintain kiya jata hai.

### 2. Long-Lived Refresh Token (HttpOnly Cookie)
Refresh token secure, HttpOnly, SameSite=Strict cookie me browser level par direct register ho jata hai. Frontend code is cookie ko javascript se read or write nahi kar sakta, jo authentication hijack limits ko fully check block karta hai.

### 3. Axios Interceptor with Concurrent Queue Retry Logic
Agar humara Access Token expire ho jata hai aur API status 401 return karti hai, toh frontend use automatically refresh aur repeat karta hai:
- `/api/v1/auth/refresh` API request execute hoti hai.
- Agar refresh hone ke dauran multiple parallel requests 401 fail hoti hain, toh interceptor unhe immediate reject or cancel karne ke bajay ek `failedQueue` array me store kar leta hai.
- Jaise hi new access token rotate ho kar clean pass ho jata hai, interceptor queue me pending saari request calls ko new bearer header ke sath update karke resolve repeat execute kar deta hai.
- Agar refresh token session cookie expire ho chuki ho ya database session cancel ho gaya ho, toh user memory state clean kar ke callback routing execution user ko direct login route redirect trigger kar degi.

---

## 4. Input Validation & Form System

Validation setup **React Hook Form** + **Zod** schema parser support integration par set kiya hai:
- Saare validation rules schemas features files (`features/auth/schemas.js`) me declared hain. 
- Form fields validation rules match schema boundaries resolve logic check karte hain. Password validation rules ko backend requirements se sync kiya hai (minimum 8 characters constraints check).
- Error messages directly UI fields ke bottom par ARIA description label bindings integration ke sath render hote hain.

---

## 5. AI Capabilites Abstraction Boundary

AI implementations provider independent interface me wrap hain:
- Component elements OpenAI, Gemini, ya third-party platforms dependencies ko direct call or imports nahi karenge.
- Frontend, API logic parameters ko `src/infrastructure/ai/client.js` me declare custom functions (`classify`, `detectDuplicates`, `getRecommendations`) ke boundaries me restrict rakhta hai.
- Har AI analysis event states standard parameters logic (`AI_STATUS.PROCESSING`, `AI_STATUS.UNAVAILABLE`) handle karegi taaki process delay loading indicators cleanly render ho ske.

---

## 6. Development Rules for Future Scalability

1. **Imports Direction Direction Rules**:
   Strict hierarchy follow karein: `app` -> `features` -> `entities` -> `shared` -> `infrastructure`. Shared files features logic ko import nahi kar sakti. Circular reference warnings logic errors manual verify blocks block kar dengi.
2. **File Size Bounds**:
   Kisi bhi JSX ya JS file ka code **150-200 lines** limit cross nahi karega. Agar complexity badhti hai, hooks, sub-components, schema files separate files optimize karein.
3. **Feature Public API (index.js)**:
   Naya features banate time use index.js public API create karein, taaki doosre features us feature ke inner code structure (api files, component paths) par dependent na ho.

---

## 7. Future Scopes (Aage Kya Karna Hai)

1. **Problems Workflow Feature Module**:
   Problems pipeline (states: draft, review, assigned, resolve) feature add hone par schema hooks validate changes perform validation actions structure karega.
2. **Tabular Data Tables with TanStack Table**:
   ERP dynamic listings tables parameters (`@tanstack/react-table`) logic shared table wrapper me build karke servers filters manage honge.
3. **Role-Based Widgets Guard checks**:
   Entity helpers hasPermission wrappers use checks trigger karke route parameter paths protect structure check guards optimize honge.
