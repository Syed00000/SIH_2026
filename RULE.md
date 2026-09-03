# Project Development Guidelines

## Purpose

This document defines the development rules for the project. The goal is to keep the existing architecture stable while ensuring that the application uses real, properly connected data, reusable functions, maintainable code, and a clean project structure.

---

## 1. Real Data Only — No Seed, Mock, or Dummy Data

The application must **not use seed data, mock data, fake data, dummy data, placeholder records, or hardcoded business records**.

### Requirements

- All runtime/business data must come from the actual database or approved real data sources.
- Frontend screens must consume data through the application's real API/backend flow.
- Do not create fake records merely to populate dashboards, tables, cards, charts, lists, or detail pages.
- Do not use hardcoded challenge, user, project, grant, milestone, impact, or other business records.
- Remove development-only data generators and unnecessary seed scripts when they are not required.
- Empty database states must be handled gracefully with proper empty states instead of fabricated records.
- Loading, error, and no-data states must be implemented where appropriate.

### Important distinction

Configuration values and schema constraints are **not** considered mock data.

Examples that may remain hardcoded when they are genuinely application configuration:

- Enum values
- Validation rules
- UI labels
- Fixed permissions/roles
- Workflow constants
- Default configuration
- Collection names
- Static technical configuration

However, actual business records must never be hardcoded.

---

## 2. Database-Driven Data Flow

Data must flow through the proper application layers:

```text
Database
   ↓
Schema / Model
   ↓
Repository / Data Access Layer
   ↓
Service / Business Logic
   ↓
Controller / API
   ↓
Frontend
   ↓
UI Components
```

### Rules

- Do not bypass the backend/database with hardcoded frontend data.
- Do not duplicate the same database record in multiple files.
- Use IDs/references to connect related records where appropriate.
- Maintain proper relationships between entities.
- API responses should represent actual database state.
- Create, read, update, and delete operations must use the real data layer.
- Changes made through the application should be reflected in the database and subsequently retrieved from the database.
- Related modules should obtain their data through established interfaces rather than copying data manually.

### Example

Instead of:

```js
const projects = [
  { name: "Example Project", status: "Approved" }
];
```

use the real application data flow:

```text
MongoDB → Project Model → Project Service → Project API → Frontend
```

---

## 3. Function Reusability

Similar logic must **not be repeated across multiple files**.

If the same operation is required in multiple places, create one reusable function/module and reuse it.

### Requirements

- Follow the **DRY (Don't Repeat Yourself)** principle.
- Extract repeated business logic into reusable services/utilities.
- Extract repeated validation into reusable validators.
- Extract repeated database operations into reusable repository/data-access functions where appropriate.
- Extract repeated frontend logic into reusable hooks, utilities, or components where appropriate.
- Avoid copying and slightly modifying the same function in different files.
- A reusable function should have a clear responsibility and predictable inputs/outputs.

### Example

Avoid:

```js
// file A
function formatStatus(status) {
  // same logic
}

// file B
function formatStatus(status) {
  // same logic
}
```

Prefer:

```js
// utils/status.js
export function formatStatus(status) {
  // single implementation
}
```

Then reuse it:

```js
import { formatStatus } from "../utils/status.js";
```

and:

```js
formatStatus(status);
```

### Reusability principle

```text
Create once
    ↓
Export
    ↓
Import wherever required
    ↓
Reuse
```

Do not create abstractions unnecessarily. A function should be extracted when the logic is genuinely reusable or when doing so clearly improves maintainability.

---

## 4. Maximum 200 Lines Per File

Every source-code file should contain **no more than 200 lines of code**.

### Requirements

- Maximum target: **200 lines per source file**.
- Do not solve a large-file problem by blindly splitting code into meaningless files.
- Split files according to responsibility.
- Keep modules cohesive and logically organized.
- If a file approaches 200 lines, review whether its responsibilities can be separated cleanly.
- Avoid excessive fragmentation that makes the project harder to understand.

### Good separation

```text
controller
   ↓
service
   ↓
repository
   ↓
model/schema
```

Each layer should have a focused responsibility.

---

## 5. Preserve the Existing Project Structure

The existing folder structure, files, schemas, modules, and architecture must be changed **as little as possible**.

### Rules

- Do not unnecessarily rename existing folders.
- Do not unnecessarily rename existing files.
- Do not move modules without a clear technical reason.
- Do not replace working architecture just for stylistic reasons.
- Do not introduce a new framework or architectural pattern unnecessarily.
- Preserve existing imports and module boundaries whenever possible.
- Preserve existing database schemas unless a change is required for correctness or the requested functionality.
- Any required structural change should be minimal and backward-compatible where possible.

### Principle

> **Improve the implementation without disturbing the established architecture.**

---

## 6. Proper Connection Between Files and Modules

All modules must communicate through clear and maintainable interfaces.

```text
Frontend
   ↓
API
   ↓
Controller
   ↓
Service
   ↓
Repository / Data Access
   ↓
Database
```

Related modules should share data through:

- Function parameters
- Return values
- API contracts
- Database references
- Shared schemas/types
- Reusable utilities
- Established service interfaces

Avoid:

- Copy-pasting data between files
- Duplicating database records
- Hidden global state
- Hardcoded dependencies
- Direct database access from unrelated layers

---

## 7. Code Quality

All code should be:

- Reusable
- Readable
- Maintainable
- Modular
- Consistent
- Efficient
- Easy to debug
- Easy for another developer to understand

### Human-readable code

Prefer:

```js
const challenge = await getChallengeById(challengeId);
```

over overly compressed or unclear code.

Use:

- Meaningful variable names
- Small focused functions
- Clear module responsibilities
- Consistent naming conventions
- Simple control flow
- Appropriate comments only where they add value

Avoid:

- Giant functions
- Deeply nested logic
- Repeated code
- Unnecessary abstractions
- Unclear variable names
- Dead code
- Unused imports
- Commented-out old implementations
- Over-engineering

---

## 8. Optimization

Optimization should improve the system without reducing readability or breaking the existing architecture.

### Prefer

- Reusable functions
- Efficient database queries
- Proper indexes where required
- Pagination for large datasets
- Filtering at the database/API level
- Avoiding unnecessary API calls
- Avoiding duplicate requests
- Reusing common frontend components
- Fetching only required data where practical

### Avoid premature optimization

Do not introduce complex caching, abstraction, or architectural changes unless there is a real requirement for them.

The priority is:

```text
Correctness
   ↓
Maintainability
   ↓
Reusability
   ↓
Performance
```

---

## 9. Error, Loading, and Empty States

Because the application uses real database data, the system must correctly handle:

- Loading state
- Successful response
- Empty database result
- Validation errors
- Authentication/authorization errors
- API errors
- Database errors
- Network failures

Never replace an empty/error response with fake data simply to make the UI look populated.

Example:

```text
Database has no projects
        ↓
API returns empty result
        ↓
Frontend displays:
"No projects found"
```

Not:

```text
Database has no projects
        ↓
Frontend inserts fake projects
```

---

## 10. Existing Schemas and Workflow

Existing schemas and workflows should remain stable unless a change is necessary.

For example, schema-level values such as:

```js
enum: ["Low", "Medium", "High", "Critical"]
```

are configuration/workflow constraints and are not considered mock records.

Similarly, default workflow definitions may remain when they are part of the application's intended behavior. They should not be treated as actual database records unless they are persisted as records.

Actual challenge/project/user/grant/impact records must come from the real database.

---

## 11. No Automatic Git Push

**Automatic Git push must NOT be performed.**

### Rules

- Do not automatically run `git push`.
- Do not automatically push commits to remote repositories.
- Do not modify remote branches automatically.
- Local code changes may be prepared and reviewed.
- Git operations should stop before pushing to a remote repository unless the user explicitly requests a push.

```text
Code Changes
     ↓
Local Review
     ↓
Local Commit (if requested)
     ↓
STOP
     ↓
No automatic git push
```

---

## 12. Definition of Done

A change is considered complete only when:

- [ ] No seed data is used.
- [ ] No mock data is used.
- [ ] No dummy business data is used.
- [ ] No unnecessary hardcoded business records exist.
- [ ] Runtime data comes from the proper database/API flow.
- [ ] Similar functions are consolidated and reused.
- [ ] No unnecessary duplicate logic exists.
- [ ] No source file exceeds 200 lines.
- [ ] Existing folder/file structure is preserved as much as reasonably possible.
- [ ] Existing schemas and modules are not unnecessarily disturbed.
- [ ] Data relationships between modules are properly maintained.
- [ ] Code is readable and maintainable.
- [ ] Loading, error, and empty states are handled.
- [ ] No unnecessary architectural changes are introduced.
- [ ] No automatic `git push` is performed.

---

## Core Principles

The project should follow these principles throughout development:

```text
REAL DATA
   +
DATABASE-DRIVEN FLOW
   +
FUNCTION REUSABILITY
   +
MAX 200 LOC / FILE
   +
MINIMAL ARCHITECTURAL CHANGES
   +
PROPER MODULE CONNECTIONS
   +
READABLE & OPTIMAL CODE
   +
NO AUTOMATIC GIT PUSH
```

> **Build once, reuse everywhere.  
> Store real data in the database.  
> Keep modules small and focused.  
> Preserve the existing architecture.  
> Never use fake data to hide missing backend functionality.**
