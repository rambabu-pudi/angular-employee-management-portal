import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly user = signal<User | null>(this.read());
  readonly isLoggedIn = computed(() => this.user() !== null);

  login(email: string, password: string): boolean {
    const role =
      email === 'admin@example.com' && password === 'admin123'
        ? 'ADMIN'
        : email === 'manager@example.com' && password === 'manager123'
          ? 'MANAGER'
          : null;
    if (!role) return false;
    const user: User = { email, role };
    localStorage.setItem('demo-user', JSON.stringify(user));
    this.user.set(user);
    return true;
  }
  logout() {
    localStorage.removeItem('demo-user');
    this.user.set(null);
  }
  hasRole(role: string) {
    return this.user()?.role === role || this.user()?.role === 'ADMIN';
  }
  private read() {
    try {
      return JSON.parse(localStorage.getItem('demo-user') || 'null') as User | null;
    } catch {
      return null;
    }
  }
}
