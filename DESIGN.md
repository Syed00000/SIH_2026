# JoharSetu UI Design System

> **Reference:** Citizen Portal and Industry Portal screens provided for
> this project.\
> **Rule:** All future dashboards/panels must follow this same visual
> language unless a screen-specific requirement demands otherwise.

## 1. Overall Style

-   Professional **Government Digital Portal** look: clean, trustworthy,
    minimal and accessible.
-   **White page background** by default.
-   No unnecessary gradients, decorative backgrounds, neon colors or
    oversized visual elements.
-   Keep UI information-focused and easy to scan.

## 2. Color System

-   **Primary:** Deep Government Green for active navigation, primary
    actions and key highlights.
-   **Text:** Dark navy/black for headings; muted blue-gray for
    secondary text.
-   **Surface:** White.
-   **Border:** Very light gray/blue-gray.
-   **Status colors:** Use only when they communicate meaning (success,
    warning, error, info).
-   Color must communicate meaning, not decoration.

## 3. Global Layout

-   Fixed top government header.
-   Left sidebar navigation with clear icons + labels.
-   Main content starts after the sidebar and uses the available width.
-   Consistent footer with Government/Department, copyright and legal
    links.
-   Maintain generous whitespace and consistent alignment.

## 4. Header

-   Left: Government of Jharkhand + Department name/logo.
-   Center: JoharSetu portal name + portal type.
-   Right: notifications + user/profile.
-   Keep header white, compact and professional.

## 5. Sidebar

-   White background with subtle divider.
-   Simple line-style icons.
-   Active item uses a **green filled highlight** with white text.
-   Inactive items use dark text and muted icons.
-   Keep navigation concise; avoid unnecessary nested items.

## 6. Page Header / Sections

Use a clean white bordered card: - Page title - One short supporting
sentence only when useful - Primary action on the right

Do not add filler text or decorative descriptions.

## 7. Cards / Dividers

-   White cards.
-   Thin subtle border.
-   Small/medium consistent corner radius.
-   Very light shadow only where necessary.
-   Clear internal spacing.
-   Avoid colorful card backgrounds.

## 8. Tables / Listings

-   Use clean bordered table/list containers.
-   Clear column headings.
-   Strong readable primary data.
-   Muted secondary metadata.
-   Status shown with compact badges.
-   Actions aligned consistently at the far right.
-   Use search, filters and tabs only when they are useful.

## 9. Typography

-   Prioritize readability.
-   Clear hierarchy: **Page Title \> Section Title \> Label \> Body \>
    Supporting Text**
-   Avoid excessive font weights, uppercase text and long paragraphs.
-   UI text must be short, direct and functional.

## 10. Buttons & Actions

-   Primary action: Government Green.
-   Secondary action: white/light neutral with border.
-   Destructive action: red only when genuinely destructive.
-   Buttons must have clear action labels: `Submit`, `Save`, `Review`,
    `View`, `Approve`, etc.
-   Never add buttons that do not perform a real function.

## 11. Detail / Workflow Panels

-   Complex detail/workflow views open as **full-page panels**, not
    centered modals.
-   Keep the same header/sidebar.
-   Use breadcrumb/back navigation.
-   Show title, ID, status, summary and structured sections.
-   Use stepper/timeline for multi-stage workflows.
-   Keep important actions in a consistent sticky action area.
-   Simple confirmations may remain modals.

## 12. Consistency Rule

Every new dashboard, page, table, form, detail panel and workflow must
reuse the same: - spacing - typography - colors - borders - radius -
buttons - badges - navigation - card structure

**Do not invent a new visual style for individual dashboards.**

## 13. Content Rule

-   Show only information required for the user's task.
-   Remove filler, repeated text and unnecessary labels.
-   Keep terminology consistent across Citizen, HEI/University, Faculty,
    Industry/CSR and Government/Admin portals.

### Fundamental Rule

**White background + Government Green accents + dark readable text +
subtle borders + clear sections + minimal decoration + consistent
layout.**

The product should always feel like **one unified Government of
Jharkhand digital platform**, even across different user portals.

## 14. Functionality Preservation — NON-NEGOTIABLE
- **Never disturb, remove or change any existing functionality.**
- UI/design refactoring must NOT break or alter existing:
  - API calls
  - backend logic
  - database behavior
  - routes/navigation
  - state management
  - forms and validation
  - permissions/roles
  - buttons/actions
  - workflows/status transitions
  - search, filters and pagination
  - file/PDF upload, view and download
  - existing data and integrations
- Reuse existing components and logic wherever possible.
- Change **only the visual presentation/layout** unless a UI interaction must be adapted to the new layout.
- Before modifying a screen, understand its current behavior and preserve that behavior exactly after the UI refactor.
- Do not introduce placeholder functionality or fake data to replace working functionality.

**Fundamental implementation rule:**  
**Improve the UI without changing what the product does.**
