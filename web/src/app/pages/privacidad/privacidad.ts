import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WHATSAPP_URL } from '../../site.config';

/** Política de privacidad (Ley 25.326 de Protección de Datos Personales, Argentina). */
@Component({
  selector: 'app-privacidad',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="legal">
      <div class="contenedor">
        <p class="legal-volver script"><a routerLink="/">← Volver al inicio</a></p>
        <h2>Política de privacidad</h2>
        <p class="sub">
          Qué hacemos (y qué no hacemos) con los datos que nos dejás en este sitio.
          Sin letra chica.
        </p>

        <article>
          <h3>1. ¿Quién es responsable de tus datos?</h3>
          <p>
            El titular del sitio y de los datos personales que nos confiás es
            <strong>Nono Reinaldo</strong>, productor artesanal de dulce de leche.
            <!-- TODO: agregar acá los datos fiscales cuando estén disponibles:
                 razón social completa, CUIT y domicilio comercial -->
            Podés comunicarte con nosotros a través del
            <a routerLink="/" fragment="contacto">formulario de contacto</a> del sitio o
            por <a [href]="waUrl" target="_blank" rel="noopener">WhatsApp</a>.
          </p>

          <h3>2. ¿Qué datos recopilamos?</h3>
          <p>
            <strong>Solo los que nos dejás voluntariamente</strong>: los campos del
            formulario de contacto (nombre, teléfono, e-mail, empresa y tu consulta) o
            lo que nos escribas por WhatsApp. No recopilamos datos de navegación
            propios: el sitio no usa cookies propias ni publicidad; la medición de
            visitas con Google Analytics es opcional y se explica en la
            <a routerLink="/cookies">Política de cookies</a>.
          </p>

          <h3>3. ¿Para qué los usamos?</h3>
          <p>
            Exclusivamente para <strong>responder tu consulta y preparar el presupuesto
            que pediste</strong>. La base legal es tu consentimiento al enviar el
            formulario (Ley 25.326, art. 5 y 11). No usamos tus datos para enviar spam
            ni para publicidad propia o de terceros.
          </p>

          <h3>4. ¿Con quién los compartimos?</h3>
          <ul>
            <li>
              <strong>Web3Forms</strong>: el servicio técnico que recibe el formulario y
              nos lo reenvía por mail. Trabaja con servidores en la Unión Europea y sus
              datos no se usan con fines comerciales.
            </li>
            <li>
              <strong>WhatsApp (Meta Platforms)</strong>: únicamente si decidís
              escribirnos por ese medio; ahí aplican las condiciones de Meta.
            </li>
            <li>
              <strong>Google Analytics</strong> (solo si está activo): medición
              opcional de visitas con IP anonimizada y sin publicidad.
            </li>
            <li>
              El alojamiento del sitio sirve archivos públicos (no contiene tus datos
              de contacto).
            </li>
          </ul>
          <p>
            No vendemos, alquilamos ni cedemos tus datos a terceros con fines
            comerciales.
          </p>

          <h3>5. ¿Cuánto tiempo los conservamos?</h3>
          <p>
            Solo el tiempo necesario para atender tu consulta: el mail queda en nuestra
            casilla mientras dure la conversación comercial. Podés pedir el borrado en
            cualquier momento (derechos ARCO, abajo).
          </p>

          <h3>6. Tus derechos (ARCO)</h3>
          <p>
            Ley 25.326, art. 14: podés ejercer el <strong>acceso</strong>, la
            <strong>rectificación</strong>, la <strong>cancelación</strong> y la
            <strong>oposición</strong> sobre tus datos. Escribinos por el formulario
            (indicá «Datos personales» en tu consulta) o por WhatsApp y te respondemos.
            Si no quedás conforme con nuestra respuesta, podés reclamar ante la
            <strong>AAIP</strong> (Agencia de Acceso a la Información Pública):
            <a href="https://www.datos.gob.ar" target="_blank" rel="noopener">www.datos.gob.ar</a>.
          </p>

          <h3>7. Menores de edad</h3>
          <p>
            El sitio no está dirigido a menores de 16 años y no recopilamos
            conscientemente sus datos (Ley 26.061 de Protección Integral de los Derechos
            de las Niñas, Niños y Adolescentes).
          </p>

          <h3>8. Seguridad y actualizaciones</h3>
          <p>
            Aplicamos medidas razonables de seguridad para que tus datos no se pierdan,
            usen indebidamente o accedan personas no autorizadas. Esta política puede
            actualizarse; la fecha de la última modificación siempre figura abajo.
          </p>
          <p>
            Esta política se rige por la legislación de la República Argentina,
            en particular la Ley 25.326 de Protección de Datos Personales.
          </p>
        </article>

        <div class="legal-cierre">
          <p class="legal-fecha">Última actualización: 20 de octubre de 2026.</p>
          <a class="btn btn-oro" routerLink="/cookies">Ver política de cookies →</a>
        </div>
      </div>
    </section>
  `,
})
export class PrivacidadComponent {
  readonly waUrl = WHATSAPP_URL;
}
