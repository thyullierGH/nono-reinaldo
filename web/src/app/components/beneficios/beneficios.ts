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
      texto: 'Controlamos todo el proceso, así que la calidad es pareja en cada pedido.',
    },
    {
      icono: 'bi-truck',
      titulo: 'Entregas confiables',
      texto: 'Cumplimos los plazos que prometemos. Vos planificás tranquilo.',
    },
    {
      icono: 'bi-chat-heart',
      titulo: 'Atención directa',
      texto: 'Hablás con personas, no con un contestador. Respondemos rápido.',
    },
  ];
}
