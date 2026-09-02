# Development & Data Integrity Guidelines

## 1. Purpose

This project must use **real, properly connected application data** throughout the system. The implementation must not rely on seed data, mock data, dummy data, fake records, or hardcoded business records.

The goal is to keep the existing project architecture stable while making the codebase:

- Data-driven
- Reusable
- Modular
- Optimized
- Human-readable
- Maintainable
- Properly connected across modules and database layers

---

## 2. No Seed, Mock, or Dummy Data

### Mandatory Rule

All runtime/business data must come from the actual application's data sources, primarily the database and connected APIs/services where applicable.

Do **not** introduce:

- Seed records
- Mock records
- Dummy records
- Fake users
- Fake challenges
- Fake projects
- Fake grants
- Fake milestones
- Fake impact metrics
- Hardcoded dashboard statistics
- Hardcoded business records
- Placeholder records presented as real data

### Important Distinction

Configuration and schema definitions are allowed to be hardcoded when they are part of the application's design.

Examples that may remain code-defined:

- Validation rules
- Schema structure
- Controlled workflow states
- Enum values
- Default configuration
- Constants that are not business records

However, actual business data must be retrieved from the database or the appropriate live source.

### Example

Avoid:

```js
const projects = [
  { name: "Example Project", status: "Approved" }
];
```

Prefer:

```js
const projects = await Project.find(query);
```

The UI must display the returned application data rather than fabricated records.

---

## 3. Database-Driven Data Flow

All modules should follow a clear data flow:

```text
Database / External Source
        ↓
Schema / Model
        ↓
Repository / Data Access
        ↓
Service / Business Logic
        ↓
Controller / API
        ↓
Frontend / UI
```

Data should not be manually duplicated between files.

When the same entity is required by multiple modules, retrieve it from the appropriate shared data layer instead of creating another copy.

### Data Connectivity Requirements

- Keep entity relationships intact.
- Use existing schemas and references wherever possible.
- Avoid duplicating the same data in multiple unrelated files.
- Use IDs/references for related entities where the existing architecture supports them.
- Keep API responses consistent with the existing frontend expectations.
- Ensure frontend values originate from backend/API responses.
- Ensure backend values originate from database records or legitimate external sources.
- Handle loading, empty, and error states instead of inserting fallback fake records.

---

## 4. Function Reusability

Similar logic must **not** be implemented repeatedly in different files.

### Mandatory Rule

If the same operation or logic is needed in multiple places:

1. Identify the common behavior.
2. Extract it into a reusable function/module.
3. Import and reuse that function wherever required.

### Avoid

```js
function formatDateA(date) {
  // same logic
}

function formatDateB(date) {
  // same logic again
}
```

### Prefer

```js
export function formatDate(date) {
  // common logic
}
```

Then reuse it:

```js
import { formatDate } from "../utils/date.js";
```

### Reusable Logic Candidates

Common reusable functions should be considered for:

- Data formatting
- Date formatting
- Validation
- API requests
- Pagination
- Filtering
- Searching
- Status handling
- Error handling
- Authorization checks
- File handling
- Response formatting
- Database query helpers
- Common UI behavior

Do not create abstractions merely for the sake of abstraction. Extract logic when it is genuinely shared or clearly reusable.

---

## 5. Maximum 200 Lines Per File

Every source file must contain **200 lines of code or fewer**.

### Rule

```text
Maximum: 200 LOC per file
```

If a file exceeds 200 lines:

- Split it by responsibility.
- Move reusable logic into utility modules.
- Separate data-access logic from business logic.
- Separate validation from controllers/services.
- Separate UI components when appropriate.
- Keep each file focused on one clear responsibility.

### Important

Do not split files randomly just to satisfy the line limit. The resulting structure must remain logical, readable, and consistent with the existing architecture.

---

## 6. Preserve Existing Project Structure

The existing folder structure, schemas, modules, APIs, and architecture must **not be unnecessarily disturbed**.

### Mandatory Rule

Before changing a file or module:

- Understand its current responsibility.
- Check its imports and dependencies.
- Check which other files consume it.
- Preserve existing interfaces unless a change is required.
- Avoid unnecessary renaming or moving of files.
- Avoid unnecessary schema changes.
- Avoid breaking existing API contracts.

The objective is to improve implementation quality **without destabilizing the existing project**.

### Do Not

- Rebuild the project architecture unnecessarily.
- Rename folders without a strong reason.
- Replace existing schemas without need.
- Duplicate modules.
- Create parallel implementations of the same feature.
- Remove working functionality just to refactor code.

---

## 7. Schema and Module Stability

Existing schemas should remain the source of truth for their respective data structures.

When changes are required:

- Make the smallest necessary change.
- Preserve existing field names where possible.
- Preserve existing relationships.
- Preserve validation rules unless requirements explicitly change.
- Avoid breaking existing database queries.
- Keep schema-specific logic close to its appropriate module.

Workflow configuration may remain code-defined when it is intentionally controlled by the application. Business records must remain database-driven.

---

## 8. No Hardcoded Business Data in UI

Frontend components must not contain fabricated business values such as:

```js
const totalProjects = 124;
const approvedProjects = 72;
const activeGrants = 18;
```

Instead, values must come from the backend:

```js
const { totalProjects, approvedProjects, activeGrants } = data;
```

The backend must calculate or retrieve those values from actual database records.

Similarly, tables, charts, cards, maps, project lists, challenge lists, and metrics must use live application data.

---

## 9. No Fake Fallback Data

Do not use fake fallback records when the API/database is empty or unavailable.

Avoid:

```js
const projects = response.data || fakeProjects;
```

Prefer:

```js
const projects = response.data || [];
```

Then display an appropriate empty state:

```text
No projects found.
```

For API/database failures, display a proper error state rather than silently replacing real data with fabricated data.

---

## 10. Code Quality Standards

Code should be:

### Reusable
Common functionality should be implemented once and reused.

### Optimal
Avoid unnecessary loops, duplicate database queries, repeated transformations, and redundant API calls.

### Human-readable
Use:

- Clear variable names
- Small focused functions
- Consistent formatting
- Logical file organization
- Meaningful comments only where needed

### Maintainable
A developer should be able to understand the responsibility of a file quickly.

### Consistent
Follow the project's existing naming conventions, patterns, framework conventions, and module structure.

---

## 11. Database Query Optimization

Where applicable:

- Query only required fields.
- Avoid unnecessary repeated database calls.
- Reuse common query/data-access helpers.
- Use existing indexes appropriately.
- Use pagination for large collections.
- Avoid fetching the same entity multiple times when the data can be shared.
- Preserve existing relationships and references.

Optimization must not sacrifice correctness or readability.

---

## 12. Cross-Module Data Contract

Data passed between modules should have a clear and predictable contract.

Example:

```text
Challenge
   ↓
Solution Proposal
   ↓
Evaluation
   ↓
Project
   ↓
Milestones
   ↓
Evidence
   ↓
Verification
   ↓
Impact
   ↓
Deployment
```

Each stage should consume data from the appropriate previous stage or database relationship rather than maintaining unrelated duplicate copies.

---

## 13. Verification Checklist

Before considering a feature complete, verify:

### Data
- [ ] No seed data
- [ ] No mock data
- [ ] No dummy data
- [ ] No fake business records
- [ ] No hardcoded dashboard statistics
- [ ] Runtime data comes from the database/API
- [ ] Empty states work correctly
- [ ] Error states do not show fabricated data

### Reusability
- [ ] Similar functions are not duplicated
- [ ] Shared logic is extracted into reusable modules
- [ ] Common API/data-access logic is reused
- [ ] Common formatting/validation logic is reused

### File Size
- [ ] Every source file is ≤ 200 LOC
- [ ] Large files are split by responsibility
- [ ] Splitting does not create unnecessary complexity

### Architecture
- [ ] Existing folder structure is preserved
- [ ] Existing schemas are preserved unless change is necessary
- [ ] Existing APIs/contracts are preserved where possible
- [ ] No unnecessary module restructuring
- [ ] Imports and dependencies remain valid

### Code Quality
- [ ] Code is readable
- [ ] Code is consistent
- [ ] Code is optimized
- [ ] Code is maintainable
- [ ] No unnecessary duplication
- [ ] No unnecessary abstraction

---

## 14. Core Principle

> **One source of truth, real data only, reusable logic, small focused files, and minimum architectural disturbance.**

The implementation should improve the existing system without replacing its structure unnecessarily.

Any refactoring should answer three questions:

1. **Is the data real and database-driven?**
2. **Can existing logic be reused instead of duplicated?**
3. **Can this be achieved without disturbing the existing architecture?**

If the answer to all three is yes, the change is aligned with this project's development standards.
