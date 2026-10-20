import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrl: './header.css',
  standalone: true,
})
export class HeaderComponent {
  menuAbierto = signal(false);
  compacto = signal(false);

  constructor() {
    window.addEventListener('scroll', () => this.alHacerScroll(), { passive: true });
  }

  alternarMenu(): void {
    this.menuAbierto.update((v) => !v);
  }

  cerrarMenu(): void {
    this.menuAbierto.set(false);
  }

  private alHacerScroll(): void {
    this.compacto.set(window.scrollY > 40);
  }
}
