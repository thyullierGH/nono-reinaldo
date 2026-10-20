import { Component } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';

interface Pregunta {
  pregunta: string;
  respuesta: string;
}

@Component({
  selector: 'app-faq',
  templateUrl: './faq.html',
  styleUrl: './faq.css',
  standalone: true,
  imports: [RevealDirective],
})
export class FaqComponent {
  readonly preguntas: Pregunta[] = [
    { pregunta: '¿Hacen ventas por mayor?', respuesta: '[Respuesta provisoria]' },
    { pregunta: '¿A qué zonas entregan?', respuesta: '[Respuesta provisoria]' },
    { pregunta: '¿Cuánto tarda un pedido?', respuesta: '[Respuesta provisoria]' },
  ];
}
