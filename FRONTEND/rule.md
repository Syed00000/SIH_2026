# Frontend Development Rules & Guidelines (SIH 2026)

## 🛠️ Stack Architecture
- **Framework**: React 18 + Vite (ES Modules)
- **Styling**: Tailwind CSS + Custom CSS Variables & Glassmorphism Design System
- **State & Data Fetching**: TanStack Query (React Query v5)
- **API Communication**: GraphQL Client (`graphql-request`) & REST Endpoints
- **Iconography**: Lucide React (`lucide-react`)

## 📐 Component & Directory Conventions
1. **Folder Layout**:
   - `src/components/`: Modular presentation components (Navbar, Hero, Features, Dashboard, Footer).
   - `src/lib/`: Global instances (`queryClient.js`, `graphqlClient.js`).
   - `src/hooks/`: Custom reusable React hooks.
   - `src/services/`: GraphQL queries, mutations, and API handlers.
2. **State Management**:
   - Use React state (`useState`, `useContext`) for local UI interaction state.
   - Use TanStack Query (`useQuery`, `useMutation`) for async server state, caching, and error handling.
3. **Styling Guidelines**:
   - Utilize Tailwind CSS utilities alongside core CSS variables.
   - Support dark/light mode switching seamlessly using `data-theme`.
   - Ensure responsive grid and flexbox layouts across mobile, tablet, and desktop views.

## ⚡ Performance & Quality Rules
- **Maximum File Length**: No file should exceed **150 lines of code (LOC)**. If a component grows past 150 lines, split it into smaller, modular sub-components or custom hooks.
- **Human-Readable Code**: All code must be clean, formatted, and easy for human developers to read, with meaningful variable and function names.
- Maintain clean, type-friendly component interfaces.
- Avoid duplicate network requests by enforcing `staleTime` policies in TanStack Query.
- Ensure all interactive buttons and inputs have accessible focus states and loading feedback.
