import { TestBed } from '@angular/core/testing';
import { EmployeeService } from './employee.service';
describe('EmployeeService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });
  it('creates and deletes employees', () => {
    const s = TestBed.inject(EmployeeService);
    const n = s.list().length;
    s.save({
      id: 0,
      name: 'Test',
      email: 'test@example.com',
      department: 'QA',
      role: 'Tester',
      salary: 100,
      active: true,
      joinedOn: '2026-01-01',
    });
    expect(s.list().length).toBe(n + 1);
    const id = s.list().at(-1)!.id;
    s.delete(id);
    expect(s.list().length).toBe(n);
  });
});
