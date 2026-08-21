import { Injectable, signal, computed } from '@angular/core';
import { Employee } from '../models';

const seed: Employee[] = [
  {
    id: 1,
    name: 'Rambabu Pudi',
    email: 'rpudi@example.com',
    department: 'Engineering',
    role: 'Staff Engineer',
    salary: 1800000,
    active: true,
    joinedOn: '2023-02-15',
  },
  {
    id: 2,
    name: 'Priya Reddy',
    email: 'priya@example.com',
    department: 'Product',
    role: 'Product Manager',
    salary: 1600000,
    active: true,
    joinedOn: '2022-08-10',
  },
  {
    id: 3,
    name: 'Vikram Singh',
    email: 'vikram@example.com',
    department: 'Engineering',
    role: 'Senior Engineer',
    salary: 1450000,
    active: true,
    joinedOn: '2024-01-12',
  },
  {
    id: 4,
    name: 'Neha Patel',
    email: 'neha@example.com',
    department: 'HR',
    role: 'HR Manager',
    salary: 1200000,
    active: false,
    joinedOn: '2021-06-20',
  },
];

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private state = signal<Employee[]>(this.load());
  readonly employees = computed(() => this.state());
  list() {
    return this.state();
  }
  get(id: number) {
    return this.state().find((e) => e.id === id);
  }
  save(e: Employee) {
    this.state.update((all) =>
      e.id ? all.map((x) => (x.id === e.id ? e : x)) : [...all, { ...e, id: Date.now() }]
    );
    this.persist();
  }
  delete(id: number) {
    this.state.update((all) => all.filter((e) => e.id !== id));
    this.persist();
  }
  private load() {
    try {
      return JSON.parse(localStorage.getItem('employees') || 'null') || seed;
    } catch {
      return seed;
    }
  }
  private persist() {
    localStorage.setItem('employees', JSON.stringify(this.state()));
  }
}
