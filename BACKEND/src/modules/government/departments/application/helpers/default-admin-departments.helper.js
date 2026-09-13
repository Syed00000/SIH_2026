/**
 * Default Admin Departments Helper
 * Strictly disabled default/mock auto-seeding to ensure only genuine, user-registered
 * departments from their respective administrative panels are persisted and displayed.
 */
export async function ensureDefaultAdminDepartments() {
  // No-op: Only user-created departments will be persisted and displayed.
  return;
}

export default ensureDefaultAdminDepartments;

