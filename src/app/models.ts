export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  salary: number;
  active: boolean;
  joinedOn: string;
}
export interface User {
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'USER';
}
