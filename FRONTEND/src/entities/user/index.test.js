import { formatFullName, hasPermission, hasRole, ROLES, PERMISSIONS } from './index.js';

describe('User Entity Utilities', () => {
  describe('formatFullName', () => {
    it('should format full name with firstName and lastName', () => {
      const user = { firstName: 'John', lastName: 'Doe' };
      expect(formatFullName(user)).toBe('John Doe');
    });

    it('should handle missing lastName', () => {
      const user = { firstName: 'John' };
      expect(formatFullName(user)).toBe('John');
    });

    it('should handle missing user or values', () => {
      expect(formatFullName(null)).toBe('');
      expect(formatFullName({})).toBe('');
    });
  });

  describe('hasPermission', () => {
    it('should return true if user role has the required permission', () => {
      const user = { role: ROLES.SUPER_ADMIN };
      expect(hasPermission(user, PERMISSIONS.MANAGE_SYSTEM)).toBe(true);
    });

    it('should return false if user role does not have the required permission', () => {
      const user = { role: ROLES.USER };
      expect(hasPermission(user, PERMISSIONS.MANAGE_SYSTEM)).toBe(false);
    });

    it('should handle null or invalid user', () => {
      expect(hasPermission(null, PERMISSIONS.MANAGE_SYSTEM)).toBe(false);
      expect(hasPermission({ role: 'unknown' }, PERMISSIONS.MANAGE_SYSTEM)).toBe(false);
    });
  });

  describe('hasRole', () => {
    it('should return true if user has the allowed role', () => {
      const user = { role: ROLES.ADMIN };
      expect(hasRole(user, ROLES.ADMIN)).toBe(true);
      expect(hasRole(user, [ROLES.ADMIN, ROLES.SUPER_ADMIN])).toBe(true);
    });

    it('should return false if user does not have the allowed role', () => {
      const user = { role: ROLES.USER };
      expect(hasRole(user, ROLES.ADMIN)).toBe(false);
    });
  });
});
