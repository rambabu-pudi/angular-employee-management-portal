import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
@Component({
  standalone: true,
  imports: [FormsModule],
  template: `<section class="card login">
    <h1>Sign in</h1>
    <p>admin@example.com / admin123</p>
    <input [(ngModel)]="email" placeholder="Email" /><input
      [(ngModel)]="password"
      type="password"
      placeholder="Password"
    />
    @if (error) {
      <div class="error">{{ error }}</div>
    }
    <button (click)="login()">Login</button>
  </section>`,
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  email = '';
  password = '';
  error = '';
  login() {
    if (this.auth.login(this.email, this.password)) this.router.navigateByUrl('/dashboard');
    else this.error = 'Invalid credentials';
  }
}
