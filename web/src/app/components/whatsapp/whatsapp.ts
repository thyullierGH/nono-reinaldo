import { Component, ElementRef, OnDestroy, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { WHATSAPP_URL } from '../../site.config';

@Component({
  selector: 'app-whatsapp',
  template: `
    <a class="btn btn-oro flotante" [href]="waUrl" target="_blank" rel="noopener" aria-label="WhatsApp">
      <i class="bi bi-whatsapp"></i>
    </a>
  `,
  standalone: true,
})
export class WhatsappComponent implements OnDestroy {
  readonly waUrl = WHATSAPP_URL;

  private readonly doc = inject(DOCUMENT);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly router = inject(Router);
  private obs?: IntersectionObserver;
  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    // Se aparta (clase .oculto) cuando #contacto está a la vista, para no tapar
    // el formulario. Se busca con reintentos: el elemento aparece en el primer render.
    this.observar();
    // Al navegar (p. ej. volver desde /privacidad) #contacto se recrea: se re-busca.
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.observar();
      }
    });
  }

  private observar(): void {
    clearTimeout(this.timer);
    this.obs?.disconnect();
    this.programarBusqueda(0);
  }

  private programarBusqueda(intentos: number): void {
    this.timer = setTimeout(() => {
      const contacto = this.doc.getElementById('contacto');
      if (contacto && typeof IntersectionObserver !== 'undefined') {
        this.obs = new IntersectionObserver(
          ([entrada]) => {
            // ElementRef apunta al host (<app-whatsapp>); el botón es su hijo <a>
            const flotante =
              this.el.nativeElement?.querySelector?.<HTMLElement>('.flotante') ??
              this.doc.querySelector<HTMLElement>('.flotante');
            flotante?.classList.toggle('oculto', entrada.isIntersecting);
          },
          { threshold: 0 },
        );
        this.obs.observe(contacto);
        return;
      }
      if (intentos < 50) {
        this.programarBusqueda(intentos + 1);
      }
    }, 100);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
    this.obs?.disconnect();
  }
}
