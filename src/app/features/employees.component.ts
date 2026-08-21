import { Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { EmployeeService } from '../core/employee.service';
import { Employee } from '../models';
import { InrPipe } from '../shared/currency-inr.pipe';
import { HighlightDirective } from '../shared/highlight.directive';
import { corporateEmail } from '../shared/validators';
@Component({
  standalone: true,
  imports: [ReactiveFormsModule, InrPipe, HighlightDirective],
  template: `<h1>Employees</h1>
    <div class="toolbar">
      <input
        [value]="query()"
        (input)="query.set($any($event.target).value)"
        placeholder="Search..."
      /><button (click)="newEmployee()">Add Employee</button>
    </div>
    <section class="card">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Role</th>
            <th>Salary</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          @for (e of filtered(); track e.id) {
            <tr appHighlight>
              <td>{{ e.name }}</td>
              <td>{{ e.department }}</td>
              <td>{{ e.role }}</td>
              <td>{{ e.salary | inr }}</td>
              <td>{{ e.active ? 'Active' : 'Inactive' }}</td>
              <td>
                <button (click)="edit(e)">Edit</button>
                <button (click)="remove(e.id)">Delete</button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </section>
    @if (editing()) {
      <section class="card">
        <h2>{{ editing()!.id ? 'Edit' : 'Add' }} Employee</h2>
        <form [formGroup]="form" (ngSubmit)="save()">
          <input formControlName="name" placeholder="Name" /><input
            formControlName="email"
            placeholder="Email"
          /><input formControlName="department" placeholder="Department" />
          <input formControlName="role" placeholder="Role" /><input
            formControlName="salary"
            type="number"
            placeholder="Salary"
          />
          <label><input formControlName="active" type="checkbox" /> Active</label
          ><button type="submit" [disabled]="form.invalid">Save</button
          ><button type="button" (click)="editing.set(null)">Cancel</button>
        </form>
      </section>
    }`,
})
export class EmployeesComponent {
  private fb = inject(FormBuilder);
  private s = inject(EmployeeService);
  employees = this.s.employees;
  query = signal('');
  editing = signal<Employee | null>(null);
  form = this.fb.nonNullable.group({
    id: [0],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email, corporateEmail]],
    department: ['', Validators.required],
    role: ['', Validators.required],
    salary: [0, [Validators.required, Validators.min(1)]],
    active: [true],
    joinedOn: [new Date().toISOString().slice(0, 10)],
  });
  filtered = computed(() => {
    const q = this.query().toLowerCase();
    return this.employees().filter((e) =>
      `${e.name} ${e.email} ${e.department} ${e.role}`.toLowerCase().includes(q)
    );
  });
  newEmployee() {
    const e = {
      id: 0,
      name: '',
      email: '',
      department: '',
      role: '',
      salary: 0,
      active: true,
      joinedOn: new Date().toISOString().slice(0, 10),
    };
    this.editing.set(e);
    this.form.reset(e);
  }
  edit(e: Employee) {
    this.editing.set(e);
    this.form.reset(e);
  }
  save() {
    if (this.form.valid) {
      this.s.save(this.form.getRawValue());
      this.editing.set(null);
    }
  }
  remove(id: number) {
    if (confirm('Delete employee?')) this.s.delete(id);
  }
}
