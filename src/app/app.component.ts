import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `<header>
      <a routerLink="/dashboard" class="brand">Angular Enterprise</a>
      @if (auth.isLoggedIn()) {
        <nav>
          <a routerLink="/dashboard">Dashboard</a><a routerLink="/employees">Employees</a>
          @if (auth.hasRole('ADMIN')) {
            <a routerLink="/admin">Admin</a>
          }
          <button (click)="auth.logout()">Logout</button>
        </nav>
      }
    </header>
    <main><router-outlet /></main>`,
})
export class AppComponent {
  readonly auth = inject(AuthService);
}
