import { Component } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';

interface Testimonio {
  cita: string;
  autor: string;
}

@Component({
  selector: 'app-testimonios',
  templateUrl: './testimonios.html',
  styleUrl: './testimonios.css',
  standalone: true,
  imports: [RevealDirective],
})
export class TestimoniosComponent {
  // [Provisorio] Reemplazar por opiniones reales, con nombre y negocio.
  readonly testimonios: Testimonio[] = [
    { cita: '“Texto de ejemplo de un cliente satisfecho.”', autor: 'Nombre, comercio' },
    { cita: '“Texto de ejemplo de un cliente satisfecho.”', autor: 'Nombre, comercio' },
    { cita: '“Texto de ejemplo de un cliente satisfecho.”', autor: 'Nombre, comercio' },
  ];
}
