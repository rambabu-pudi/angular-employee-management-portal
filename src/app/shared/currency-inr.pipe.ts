import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'inr' })
export class InrPipe implements PipeTransform {
  transform(v: number) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(v);
  }
}
