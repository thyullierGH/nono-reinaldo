import { Component, ElementRef, OnDestroy, afterNextRender, inject } from '@angular/core';
import gsap from 'gsap';

/**
 * Hero con:
 *  - Entrada animada con GSAP (timeline)
 *  - Tilt del logo siguiendo el cursor
 */
@Component({
  selector: 'app-hero',
  templateUrl: './hero.html',
  styleUrl: './hero.css',
  standalone: true,
})
export class HeroComponent implements OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly seccion = this.host.querySelector<HTMLElement>('.hero');

  private ctx?: gsap.Context;

  constructor() {
    afterNextRender(() => {
      this.animarEntrada();
      this.initTilt();
    });
  }

  private get reduceMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /** Entrada del hero con GSAP (respeta movimiento reducido) */
  private animarEntrada(): void {
    if (this.reduceMotion) return;
    this.ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.hero-titulo', { y: 40, autoAlpha: 0, duration: 0.95 })
        .from('.bajada', { y: 30, autoAlpha: 0, duration: 0.8 }, '-=.6')
        .from('.botones .btn', { y: 26, autoAlpha: 0, duration: 0.7, stagger: 0.12 }, '-=.5')
        .from('.confianza li', { y: 20, autoAlpha: 0, duration: 0.6, stagger: 0.12 }, '-=.45')
        .from('.logo-wrap', { scale: 0.72, rotate: -6, autoAlpha: 0, filter: 'blur(12px)', duration: 1.3 }, 0);
    }, this.host);
  }

  /** Tilt del logo siguiendo al mouse */
  private initTilt(): void {
    const seccion = this.seccion;
    const logoWrap = seccion?.querySelector<HTMLElement>('.logo-wrap');
    if (!seccion || !logoWrap) return;

    seccion.addEventListener('mousemove', (e) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      logoWrap.style.setProperty('--ry', `${x * 14}deg`);
      logoWrap.style.setProperty('--rx', `${-y * 14}deg`);
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
