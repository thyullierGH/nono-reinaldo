import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer';
import { HeaderComponent } from './components/header/header';
import { WhatsappComponent } from './components/whatsapp/whatsapp';
import { AnalyticsService } from './services/analytics.service';
import { LenisService } from './services/lenis.service';

/** Shell de la aplicación: header, pie y flotante rodean a las páginas (rutas). */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, FooterComponent, WhatsappComponent],
  template: `
    <app-header />
    <main>
      <router-outlet />
    </main>
    <app-footer />
    <app-whatsapp />
  `,
})
export class App {
  private readonly lenis = inject(LenisService);
  private readonly analytics = inject(AnalyticsService);

  constructor() {
    // Activa el scroll suave (Lenis) sincronizado con GSAP ScrollTrigger
    this.lenis.init();
    // Google Analytics 4: solo se carga si hay ID configurado en site.config.ts
    this.analytics.init();
  }
}
