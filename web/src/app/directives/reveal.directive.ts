import { Directive, ElementRef, Input, OnDestroy, OnInit } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Revela el elemento con una animación GSAP + ScrollTrigger al entrar en pantalla.
 * Uso: <div appReveal> o <div [appReveal]="1"> (1 = índice para escalonar delay).
 */
@Directive({ selector: '[appReveal]', standalone: true })
export class RevealDirective implements OnInit, OnDestroy {
  /** Índice de escalonamiento: 0, 1, 2... (el delay es índice * 0.12 s) */
  @Input() appReveal = 0;

  private readonly el: HTMLElement;
  private ctx?: gsap.Context;

  // La inyección va en el constructor: en Angular 22, inject() dentro de
  // ngOnInit lanza NG0203 y aborta el ciclo de detección de toda la vista.
  constructor(host: ElementRef<HTMLElement>) {
    this.el = host.nativeElement;
  }

  ngOnInit(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const delay = (Number(this.appReveal) || 0) * 0.12;

    this.ctx = gsap.context(() => {
      gsap.from(this.el, {
        y: 36,
        autoAlpha: 0,
        duration: 0.9,
        delay,
        ease: 'power3.out',
        scrollTrigger: { trigger: this.el, start: 'top 88%', once: true },
      });
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
