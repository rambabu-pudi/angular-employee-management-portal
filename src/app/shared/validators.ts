import { AbstractControl, ValidationErrors } from '@angular/forms';
export function corporateEmail(c: AbstractControl): ValidationErrors | null {
  const v = String(c.value || '');
  return v && !v.endsWith('@example.com') ? { corporateEmail: true } : null;
}
