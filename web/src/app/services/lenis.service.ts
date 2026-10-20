import { Injectable, OnDestroy } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll suave con Lenis, sincronizado con GSAP ScrollTrigger.
 * Respeta "prefers-reduced-motion": en ese caso usa el scroll nativo.
 */
@Injectable({ providedIn: 'root' })
export class LenisService implements OnDestroy {
  private lenis: Lenis | null = null;

  get activo(): boolean {
    return this.lenis !== null;
  }

  init(): void {
    if (this.lenis) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.lenis = new Lenis({ lerp: 0.11, smoothWheel: true });

    // Lenis avisa a ScrollTrigger en cada frame de scroll
    this.lenis.on('scroll', ScrollTrigger.update);

    // Bucle de animación compartido con GSAP (un solo rAF para todo)
    gsap.ticker.add(this.raf);
    gsap.ticker.lagSmoothing(0);

    // Anclas internas (#seccion) -> scroll suave con offset por el header
    document.addEventListener('click', this.onClick);
  }

  scrollTo(hash: string): void {
    const el = document.querySelector(hash);
    if (!el) return;
    if (this.lenis) {
      this.lenis.scrollTo(el as HTMLElement, { offset: -96, duration: 1.3 });
    } else {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  private raf = (time: number): void => {
    this.lenis?.raf(time * 1000);
  };

  private onClick = (e: MouseEvent): void => {
    const anchor = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!anchor) return;
    const hash = anchor.getAttribute('href');
    if (!hash || hash === '#') return;
    const destino = document.querySelector(hash);
    if (!destino) return;
    e.preventDefault();
    this.scrollTo(hash);
  };

  ngOnDestroy(): void {
    document.removeEventListener('click', this.onClick);
    if (this.lenis) {
      gsap.ticker.remove(this.raf);
      this.lenis.destroy();
      this.lenis = null;
    }
  }
}
