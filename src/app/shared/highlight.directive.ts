import { Directive, ElementRef, HostListener, inject } from '@angular/core';
@Directive({ selector: '[appHighlight]' })
export class HighlightDirective {
  private el = inject(ElementRef<HTMLElement>);
  @HostListener('mouseenter') enter() {
    this.el.nativeElement.style.outline = '2px solid currentColor';
  }
  @HostListener('mouseleave') leave() {
    this.el.nativeElement.style.outline = '';
  }
}
