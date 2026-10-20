import { Component } from '@angular/core';
import { BeneficiosComponent } from '../../components/beneficios/beneficios';
import { ContactoComponent } from '../../components/contacto/contacto';
import { FaqComponent } from '../../components/faq/faq';
import { HistoriaComponent } from '../../components/historia/historia';
import { HeroComponent } from '../../components/hero/hero';
import { ProductosComponent } from '../../components/productos/productos';
import { ProcesoComponent } from '../../components/proceso/proceso';
import { TestimoniosComponent } from '../../components/testimonios/testimonios';

/** Página de inicio: todas las secciones del one-pager. */
@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    HeroComponent,
    HistoriaComponent,
    BeneficiosComponent,
    ProductosComponent,
    ProcesoComponent,
    TestimoniosComponent,
    FaqComponent,
    ContactoComponent,
  ],
  template: `
    <app-hero />
    <app-historia />
    <app-beneficios />
    <app-productos />
    <app-proceso />
    <app-testimonios />
    <app-faq />
    <app-contacto />
  `,
})
export class InicioComponent {}
