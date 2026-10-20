import { Component } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';

@Component({
  selector: 'app-historia',
  templateUrl: './historia.html',
  styleUrl: './historia.css',
  standalone: true,
  imports: [RevealDirective],
})
export class HistoriaComponent {}
