import { Component, computed, inject } from '@angular/core';
import { EmployeeService } from '../core/employee.service';
import { InrPipe } from '../shared/currency-inr.pipe';
@Component({
  standalone: true,
  imports: [InrPipe],
  template: `<h1>Dashboard</h1>
    <div class="grid">
      <article class="card">
        <h3>Employees</h3>
        <strong>{{ count() }}</strong>
      </article>
      <article class="card">
        <h3>Active</h3>
        <strong>{{ active() }}</strong>
      </article>
      <article class="card">
        <h3>Payroll</h3>
        <strong>{{ payroll() | inr }}</strong>
      </article>
      <article class="card">
        <h3>Departments</h3>
        <strong>{{ departments() }}</strong>
      </article>
    </div>
    <section class="card">
      <h2>Employees</h2>
      @for (e of employees(); track e.id) {
        <div class="row">
          <span>{{ e.name }}</span
          ><span>{{ e.department }}</span
          ><span>{{ e.role }}</span>
        </div>
      }
    </section>`,
})
export class DashboardComponent {
  private s = inject(EmployeeService);
  employees = this.s.employees;
  count = computed(() => this.employees().length);
  active = computed(() => this.employees().filter((e) => e.active).length);
  payroll = computed(() => this.employees().reduce((x, e) => x + e.salary, 0));
  departments = computed(() => new Set(this.employees().map((e) => e.department)).size);
}
