import { FormControl } from '@angular/forms';
import { corporateEmail } from './validators';
describe('corporateEmail', () => {
  it('accepts example.com', () =>
    expect(corporateEmail(new FormControl('a@example.com'))).toBeNull());
  it('rejects other domains', () =>
    expect(corporateEmail(new FormControl('a@gmail.com'))).toEqual({ corporateEmail: true }));
});
