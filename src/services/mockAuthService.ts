import type { User, UserRole, Permission } from '../types';
import { studentUser, facultyUser, hodUser, demoAccounts } from '../data/mockData';

const AUTH_STORAGE_KEY = 'campusiq_authenticated_user';

export const mockAuthService = {
  async login(email: string, _password?: string): Promise<{ user: User; token: string }> {
    const cleanEmail = email.toLowerCase().trim();

    let matchedUser: User = studentUser;

    if (demoAccounts[cleanEmail]) {
      matchedUser = demoAccounts[cleanEmail].user;
    } else if (cleanEmail.includes('faculty') || cleanEmail.includes('ananya')) {
      matchedUser = facultyUser;
    } else if (cleanEmail.includes('hod') || cleanEmail.includes('rajesh')) {
      matchedUser = hodUser;
    } else if (cleanEmail.includes('student') || cleanEmail.includes('trisha')) {
      matchedUser = studentUser;
    } else {
      // Default to student if unknown email
      matchedUser = studentUser;
    }

    const token = `mock-jwt-token-${matchedUser.role}-${Date.now()}`;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(matchedUser));

    return { user: matchedUser, token };
  },

  logout(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  getStoredUser(): User | null {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as User;
      }
    } catch (e) {
      console.warn('Error reading stored auth user:', e);
    }
    // Default logged-in user for prototype demo
    return studentUser;
  },

  switchDemoRole(role: UserRole): User {
    let targetUser = studentUser;
    if (role === 'faculty') targetUser = facultyUser;
    if (role === 'hod') targetUser = hodUser;
    if (role === 'student') targetUser = studentUser;

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(targetUser));
    return targetUser;
  },

  hasRole(user: User | null, role: UserRole): boolean {
    if (!user) return false;
    return user.role === role;
  },

  hasPermission(user: User | null, permission: Permission): boolean {
    if (!user) return false;
    return user.permissions.includes(permission);
  },

  hasAnyRole(user: User | null, roles: UserRole[]): boolean {
    if (!user) return false;
    return roles.includes(user.role);
  }
};
