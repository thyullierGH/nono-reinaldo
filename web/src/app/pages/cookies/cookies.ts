import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Política de cookies: el sitio no usa cookies ni rastreo; se informa con transparencia. */
@Component({
  selector: 'app-cookies',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="legal">
      <div class="contenedor">
        <p class="legal-volver script"><a routerLink="/">← Volver al inicio</a></p>
        <h2>Política de cookies</h2>
        <p class="sub">
          La respuesta corta: <strong>este sitio no te sigue</strong>. No usa cookies
          de rastreo ni herramientas de analítica o publicidad. Acá te contamos el
          detalle.
        </p>

        <article>
          <h3>1. ¿Qué es una cookie?</h3>
          <p>
            Una cookie es un archivo de texto muy pequeño que un sitio guarda en tu
            navegador para recordar cosas: tu idioma, si iniciaste sesión, o datos de
            tu navegación para publicidad. Sirven para eso: «recordar».
          </p>

          <h3>2. ¿Cómo usa este sitio las cookies?</h3>
          <p>
            <strong>No usa ninguna.</strong> No hay cookies propias, no hay Google
            Analytics ni otra herramienta de medición, no hay píxeles de Meta ni de
            otras redes, ni herramientas de publicidad. Tu visita a este sitio no deja
            rastro de seguimiento de nuestra parte.
          </p>

          <h3>3. ¿Y el almacenamiento local?</h3>
          <p>
            Tampoco usamos almacenamiento local del navegador (localStorage) para
            guardar preferencias o identificarte. La web funciona sin guardar nada en
            tu equipo.
          </p>

          <h3>4. Enlaces a servicios de terceros</h3>
          <p>
            Cuando hacés clic en nuestros enlaces de
            <strong>WhatsApp</strong>, <strong>Instagram</strong> o el
            <strong>mapa</strong>, salís del sitio hacia las páginas de esas empresas
            (Meta Platforms y Google). Ahí sí aplican sus propias políticas de cookies
            y privacidad, que no controlamos.
          </p>

          <h3>5. Tipografía cargada desde Google</h3>
          <p>
            La web muestra la tipografía Poppins desde los servidores de
            <strong>Google Fonts</strong>. Eso genera una petición técnica a Google
            (que recibe tu dirección IP como parte de la conexión), pero no instala
            cookies de seguimiento desde nuestro lado.
          </p>

          <h3>6. ¿Cómo gestionar las cookies en tu navegador?</h3>
          <p>
            Aunque nuestro sitio no las use, otros sitios que visitás sí pueden usarlas.
            Desde la configuración de tu navegador (Chrome, Safari, Firefox o Edge:
            <em>Configuración → Privacidad y seguridad → Cookies y otros datos de
            sitios</em>) podés ver, bloquear y borrar cookies cuando quieras.
          </p>

          <h3>7. Analítica de visitas (Google Analytics)</h3>
          <p>
            El sitio está preparado para medir visitas con
            <strong>Google Analytics 4</strong> de forma <strong>opcional</strong>:
            mientras no se configure un identificador de medición, no se carga
            ninguna herramienta de analítica. Cuando esté activa, se usa con
            <strong>IP anonimizada</strong> y sin funciones publicitarias (sin
            remarketing ni publicidad personalizada de Google). Podés optar por no
            medirte desde la configuración de cookies de tu navegador o con el
            <a href="https://tools.google.com/page/optout" target="_blank" rel="noopener">complemento de desactivación de Google</a>.
          </p>

          <h3>8. Cambios en esta política</h3>
          <p>
            Si algún día incorporamos una herramienta que use cookies (por ejemplo,
            analítica), actualizaremos esta página y avisaremos antes de que se usen.
            Cualquier duda la recibimos por el
            <a routerLink="/" fragment="contacto">formulario de contacto</a> o por
            WhatsApp.
          </p>
        </article>

        <div class="legal-cierre">
          <p class="legal-fecha">Última actualización: 20 de octubre de 2026.</p>
          <a class="btn btn-oro" routerLink="/privacidad">Ver política de privacidad →</a>
        </div>
      </div>
    </section>
  `,
})
export class CookiesComponent {}
