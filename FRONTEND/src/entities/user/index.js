export const ROLES = {
  USER: 'user',
  STAFF: 'staff',
  UNIVERSITY_ADMIN: 'university_admin',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
};

export const PERMISSIONS = {
  REVIEW_PROBLEMS: 'review_problems',
  ROUTE_PROBLEMS: 'route_problems',
  RESOLVE_PROBLEMS: 'resolve_problems',
  MANAGE_SYSTEM: 'manage_system',
  MANAGE_UNIVERSITY: 'manage_university',
};

const ROLE_PERMISSIONS = {
  [ROLES.USER]: [],
  [ROLES.STAFF]: [PERMISSIONS.RESOLVE_PROBLEMS],
  [ROLES.UNIVERSITY_ADMIN]: [PERMISSIONS.ROUTE_PROBLEMS, PERMISSIONS.RESOLVE_PROBLEMS],
  [ROLES.ADMIN]: [PERMISSIONS.REVIEW_PROBLEMS, PERMISSIONS.ROUTE_PROBLEMS, PERMISSIONS.RESOLVE_PROBLEMS],
  [ROLES.SUPER_ADMIN]: [
    PERMISSIONS.REVIEW_PROBLEMS,
    PERMISSIONS.ROUTE_PROBLEMS,
    PERMISSIONS.RESOLVE_PROBLEMS,
    PERMISSIONS.MANAGE_SYSTEM,
    PERMISSIONS.MANAGE_UNIVERSITY,
  ],
};

export function formatFullName(user) {
  if (!user) return '';
  return `${user.firstName || ''} ${user.lastName || ''}`.trim();
}

export function hasPermission(user, permission) {
  if (!user || !user.role) return false;
  const permissions = ROLE_PERMISSIONS[user.role] || [];
  return permissions.includes(permission);
}

export function hasRole(user, allowedRoles) {
  if (!user || !user.role) return false;
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return rolesArray.includes(user.role);
}
