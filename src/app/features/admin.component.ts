import { Component, inject } from '@angular/core';
import { AuthService } from '../core/auth.service';
@Component({
  standalone: true,
  template: `<section class="card">
    <h1>Administration</h1>
    <p>Role-based route protection is active.</p>
    <p>
      Current role: <strong>{{ auth.user()?.role }}</strong>
    </p>
  </section>`,
})
export class AdminComponent {
  auth = inject(AuthService);
}
