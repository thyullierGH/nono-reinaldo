import { Component } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';

interface Beneficio {
  icono: string;
  titulo: string;
  texto: string;
}

@Component({
  selector: 'app-beneficios',
  templateUrl: './beneficios.html',
  styleUrl: './beneficios.css',
  standalone: true,
  imports: [RevealDirective],
})
export class BeneficiosComponent {
  readonly beneficios: Beneficio[] = [
    {
      icono: 'bi-building',
      titulo: 'Fabricación propia',
      texto: 'Del tambo a la fabrica, y de la fabrica a tu negocio.',
    },
    {
      icono: 'bi-patch-check-fill',
      titulo: 'Calidad asegurda',
      texto: 'Elaboramos a base de leche fluida. Asegurando el mejor producto para tu negocio',
    },
    {
      icono: 'bi-chat-heart',
      titulo: 'Atención directa',
      texto: 'Hablás con personas, no con un contestador. Respondemos rápido.',
    },
  ];
}
