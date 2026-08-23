# Completed Setup Documentation - University ERP Frontend

Is document me abhi tak kiye gaye saare architectural changes, system configurations, aur server setups ka short summary diya gaya hai.

---

## 1. Project Dependencies aur Setup
- **Dependencies Installed**: Runtime packages (`axios`, `zod`, `react-hook-form`, `@hookform/resolvers`, `@tanstack/react-router`, `@tanstack/react-table`, `framer-motion`) aur dev packages (`eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`) install kiye.
- **Path Alias Config**: `vite.config.js` me `@` path alias configure kiya jo `src` directory ko point karta hai, taaki relative imports simple rahein.
- **Linter Config**: Root me `eslint.config.js` flat config file create kiya aur compile outputs (`dist/**`) aur `node_modules/**` ko ignore patterns me add kiya.

---

## 2. Directory Restructuring (Hybrid Architecture)
Humne puraane structure (jaise `src/components/` aur `src/lib/`) ko delete kar ke, requirements ke according modular domains me code divide kiya:
- `src/app/`: Application bootstrap, routing (`router.jsx`), global layout (`layout.jsx`), aur global wrappers (`providers.jsx`).
- `src/App.jsx`: Main root React component importing aur render karne wala context wrapper `AppProviders` setup kiya hai.
- `src/features/`: Isolated modules jo use-cases handle karte hain. Abhi isme sirf `features/auth/` hai jiske andar api handlers, TanStack Query hooks, validation schemas, aur login/register forms hain. Ye features outer modules se index.js ke through hi communicate karte hain.
- `src/entities/`: Domain models representation. Humne `entities/user/index.js` me user roles aur authorization check helpers (`hasRole`, `hasPermission`) place kiye hain.
- `src/shared/`: Generic components jo bilkul business logic dependent nahi hain (jaise Buttons, Inputs, Alert screens).
- `src/infrastructure/`: Central API client, API errors handlers, global environment validation, aur AI configurations client.

---

## 3. Banaye Gaye Components, Files aur Modules

Humne niche diye gaye files aur components scratch se build kiye hain:

### 1. App Composition Layer (`src/app/`)
- `providers.jsx`: Global data-fetching context providers (`QueryClientProvider`, `RouterProvider`).
- `router.jsx`: Pure logic-free code-based routing tree map connecting paths to feature page views.
- `layout.jsx`: Pure UI application wrapper frame (Header navbar, navigation active state links, aur current authenticated user identity tags).

### 2. Generic UI Primitives (`src/shared/components/ui/`)
- `button.jsx`: Premium styling button component with micro-interaction hover scalings aur processing loader options.
- `input.jsx`: Text field component carrying validation error hooks aur label tags.
- `textarea.jsx`: Multiline text area.
- `badge.jsx`: Visual labels representing roles (active status, customer) aur special pulsing effect indicator for AI tags.
- `alert.jsx`: Multi-type contextual alert notifications (success, warning, error, info).
- `card.jsx`: Standard container elements.
- `skeleton.jsx`: Pulsating layout elements used during network latency states.

### 3. Core Entities Layer (`src/entities/`)
- `user/index.js`: User representation functions (`formatFullName`) aur check conditions (`hasRole`, `hasPermission`) jo standard roles (user, staff, admin, super_admin) ke checks run karti hain.

### 4. Authentication Module Feature (`src/features/auth/`)
- `components/LoginForm.jsx`: Secure sign-in form using React Hook Form aur Zod validation resolver.
- `components/RegisterForm.jsx`: Sign-up form.
- `api.js`: Endpoints handler linking frontend calls (`auth/login`, `auth/register`, `auth/refresh`, `auth/logout`).
- `hooks.js`: TanStack Query triggers (`useLogin`, `useRegister`, `useLogout`, `useCurrentUser`).
- `schemas.js`: Zod schema rules specifying fields boundaries aur limits.
- `index.js`: Exposes only public API entry points.

### 5. Dashboard Module Feature (`src/features/dashboard/`)
- `components/DashboardContainer.jsx`: Renders the index welcome page for guest users aur the main session dashboard cards for logged-in users.
- `index.js`: Exposes only public API entry points.

### 6. Infrastructure Integration Adapters (`src/infrastructure/`)
- `api/client.js`: Axios wrapper for JWT storage, token headers authorization injection, aur silent token rotation queueing logic.
- `api/errors.js`: Custom `ApiError` class converting network timeouts or server faults.
- `ai/client.js`: Client adapters wrapping AI backend endpoints (`classify`, `detectDuplicates`, `getRecommendations`).
- `config.js`: Central environment validated values container.

---

## 4. Pure Tailwind Styling aur Simple Theme
- **Zero Custom CSS**: `src/index.css` se saare manual CSS classes aur custom overrides delete kar ke sirf `@import "tailwindcss";` rakha hai. Koi inline custom styles ya normal CSS file pure project me nahi hai.
- **No Dark Mode**: Dark mode configuration aur togglers ko features aur shared UI components se completely remove kar diya hai taaki design bilkul clean, light-themed, aur responsive rahe.

---

## 5. Security aur Connecting Frontend-Backend
- **Silent Token Rotation Queue**: API client `src/infrastructure/api/client.js` me interceptor setup kiya hai. Jab access token expire hota hai toh API server 401 response deta hai. Interceptor automatic `/auth/refresh` hit karta hai aur pending request calls ko `failedQueue` array me hold kar ke new token aane par repeat trigger karta hai.
- **CORS Config**: Backend ke `.env` file me `CORS_ORIGINS=http://localhost:5173` whitelist kiya taaki security restrictions check bypass ho sakein.
- **Base URL Slashes Alignment**: Base URL ko trailing slash ke sath sync kiya aur subroutes me leading slashes remove kiye taaki paths automatically resolve ho sakein.
- **Protected Routing Guards**: `router.jsx` me security guards apply kiye hain. Agar user logged in hai aur manually browser search query ya browser back navigation se `/login` ya `/register` par jaane ki koshish karta hai, toh use automatically `/` (dashboard) par redirect kar diya jata hai. Aur agar guest user dashboard `/` par aane ki koshish karta hai, toh use automatically `/login` par redirect kar diya jata hai.
- **DRY Refactoring (useRedirectIfAuthenticated)**: Duplicated redirection logic ko extract kar ke ek common custom hook `useRedirectIfAuthenticated` me merge kiya, jisse `LoginForm` aur `RegisterForm` ab clean hain aur code reuse optimized hai.
- **Unit Test Coverage**: Critical path logic ke liye unit test files build kiye hain:
  - `src/entities/user/index.test.js` (role and permissions logic checks).
  - `src/infrastructure/api/errors.test.js` (axios request-response error normalization checks).
- **Nodemailer Dependency Setup**: Backend SMTP email systems require `nodemailer` package, use install kar ke backend dev watch crash issue resolve kiya.
- **Icon-Free and AI-Free UI Purge**: Codebase se saare SVG loaders, Lucide icons, aur unke relative backgrounds/borders wrappers ko remove kiya. Password inputs me show/hide eye icons ko simple 'SHOW'/'HIDE' text button buttons se replace kiya. AI sparkles logo aur AI classification texts ko overview settings se strip kiya.
- **Shared UI Refactoring & Uniform Aesthetic**: Saare login, register, email verification, forgot password, aur settings pages ko refactor kiya taaki wo shared primitive UI components (`Input`, `Button`, `Card`, `Alert`, `Badge`) use karein. Isse poore project me ek unified, structured, aur minimal premium black & white theme implement ho gayi hai.
- **Collapsible & Drawer Sidebar**: `DashboardContainer.jsx` me desktop aur mobile ke liye collapsible side navigation toggle (`[≡]` / `[X]`) add kiya. Mobile par ye drop-down drawer button ka kaam karta hai aur desktop par width collapse-expand custom format handle karta hai.
- **Official Jharkhand Logo & Lucide Icons**: Sidebar header me official Government of Jharkhand emblem image (`https://www.jharkhand.gov.in/images/jhlogo55.PNG`) integrate kiya. Sidebar links me clean, professional outline Lucide icons add kiye jo collapse hone par grid me centered layout follow karte hain.
- **Global Sticky Header**: Government of Rajasthan ke mockup format me, page ke sabse top par ek global sticky header diya hai. Isme official Government of Jharkhand emblem image aur "Department of Higher and Technical Education" subtext show kiya hai.
- **Top Sidebar Logout & Independent Scroll**: Sidebar ko `h-full` height locks ke sath layout me sticky banaya hai taaki sidebar fixed rahe aur sirf right-side dashboard panels scroll hon.
- **Sidebar-Header Toggle Alignment**: Global top header ko completely clean aur fixed rakha hai (koi menu button wahan nahi hai). Menu toggle close/expand buttons (`X` aur `Menu`) ko sidebar header me shift kiya hai, aur Logout button ko mockup sheet ke according sidebar ke bottom section me restyle kiya hai.
- **Header Title Positioning**: Portal title text "JoharSetu" (bold tracking-widest format) ko global header ke top-right section me shift kar diya hai taaki sidebar display clean aur non-repetitive rahe.
- **Unified Sidebar Header Card**: Blank vertical spacing aur duplicate lines ko eliminate karne ke liye, sidebar toggle close button aur User profile details container ko ek single top header card (`bg-slate-50 border border-slate-200`) me unify kar diya hai. Collapsed state me hamburger menu icon directly center me display hota hai.
- **Registration Role Descriptions**: CITIZEN, UNIVERSITY, aur INDUSTRY roles ke descriptive text cards ko modify kiya hai taaki wo sab challenge submission roles ko explicitly state karein (local/community, educational/institutional, aur industrial/CSR challenges).

---

## 6. Live Server Details
- **Backend API**: Port `3000` par active chal raha hai aur MongoDB Atlas remote database instance se successfully connected state me hai.
- **Frontend Vite Dev Server**: Port `5173` par live chal raha hai.
- **Lint validation**: `npm run lint` compile check me zero errors aur zero warnings return kar raha hai.
- **Production Build compilation**: `npm run build` bina kisi error ke successfully build ho raha hai.
