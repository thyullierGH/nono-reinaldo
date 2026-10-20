import { Component } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';

interface Paso {
  titulo: string;
  texto: string;
}

@Component({
  selector: 'app-proceso',
  templateUrl: './proceso.html',
  styleUrl: './proceso.css',
  standalone: true,
  imports: [RevealDirective],
})
export class ProcesoComponent {
  readonly pasos: Paso[] = [
    { titulo: 'Nos contás qué necesitás', texto: 'Por WhatsApp o con el formulario de abajo.' },
    { titulo: 'Recibís tu presupuesto', texto: 'Claro y sin letra chica, en menos de 24 horas.' },
    { titulo: 'Producimos y entregamos', texto: 'Te avisamos en cada etapa del pedido.' },
  ];
}
