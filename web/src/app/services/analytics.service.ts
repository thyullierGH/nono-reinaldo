import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { GA_MEASUREMENT_ID } from '../site.config';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Google Analytics 4 (GA4): solo se carga si GA_MEASUREMENT_ID está configurado
 * en site.config.ts. Mide páginas vistas con IP anonimizada, sin publicidad.
 * En SPA hay que avisarle los cambios de ruta a mano (page_view en NavigationEnd).
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly doc = inject(DOCUMENT);
  private readonly router = inject(Router);

  init(): void {
    if (!GA_MEASUREMENT_ID) {
      return; // Sin ID no se carga nada: el sitio queda sin analítica
    }
    const w = this.doc.defaultView as Window | null;
    if (!w) return;

    w.dataLayer = w.dataLayer ?? [];
    w.gtag = function gtag(...args: unknown[]): void {
      w.dataLayer!.push(args);
    };
    w.gtag('js', new Date());
    w.gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });

    const script = this.doc.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    this.doc.head.appendChild(script);

    // Cada navegación del router se registra como una vista de página
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        w.gtag?.('event', 'page_view', {
          page_path: ev.urlAfterRedirects,
          page_location: w.location.href,
          page_title: this.doc.title,
        });
      }
    });
  }
}
