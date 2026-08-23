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
- `src/features/`: Isolated modules jo use-cases handle karte hain. Abhi isme sirf `features/auth/` hai jiske andar api handlers, TanStack Query hooks, validation schemas, aur login/register forms hain. Ye features outer modules se index.js ke through hi communicate karte hain.
- `src/entities/`: Domain models representation. Humne `entities/user/index.js` me user roles aur authorization check helpers (`hasRole`, `hasPermission`) place kiye hain.
- `src/shared/`: Generic components jo bilkul business logic dependent nahi hain (jaise Buttons, Inputs, Alert screens).
- `src/infrastructure/`: Central API client, API errors handlers, global environment validation, aur AI configurations client.

---

## 3. Banaye Gaye Components, Files aur Modules

Humne niche diye gaye files aur components scratch se build kiye hain:

### 1. App Composition Layer (`src/app/`)
- `providers.jsx`: Global data-fetching context providers (`QueryClientProvider`, `RouterProvider`).
- `router.jsx`: Code-based router mappings jo Dashboard screen, Login form screen aur Register form screen render karti hain.
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

### 5. Infrastructure Integration Adapters (`src/infrastructure/`)
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

---

## 6. Live Server Details
- **Backend API**: Port `3000` par active chal raha hai aur MongoDB Atlas remote database instance se successfully connected state me hai.
- **Frontend Vite Dev Server**: Port `5173` par live chal raha hai.
- **Lint validation**: `npm run lint` compile check me zero errors aur zero warnings return kar raha hai.
- **Production Build compilation**: `npm run build` bina kisi error ke successfully build ho raha hai.
