import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ANIO } from '../../site.config';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="pie">
      <p class="script texto-oro" style="font-size:1.6rem">Nono Reinaldo</p>
      <p>© {{ anio }} · Todos los derechos reservados</p>
      <nav class="pie-legales" aria-label="Enlaces legales">
        <a routerLink="/privacidad">Política de privacidad</a>
        <span aria-hidden="true">·</span>
        <a routerLink="/cookies">Política de cookies</a>
      </nav>
    </footer>
  `,
  standalone: true,
  imports: [RouterLink],
})
export class FooterComponent {
  readonly anio = ANIO;
}
