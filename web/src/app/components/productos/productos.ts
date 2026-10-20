import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  signal,
} from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';

interface Producto {
  nombre: string;
  foto: string;
  respaldo: string;
}

/** Milisegundos entre cambio automático de producto. */
const INTERVALO_AUTO = 10_000;
/** Duración de la animación al desplazar (ms). */
const DURACION = 550;
/** Espera tras dejar de hacer scroll con la rueda antes de ajustar al producto más cercano. */
const ESPERA_AJUSTE = 170;
/**
 * Tolerancia (px) en los bordes del bloque central. El navegador redondea
 * scrollLeft a píxeles enteros en pantallas 1x, así que una posición justo
 * en W o 2W puede leerse ~0,3 px por debajo/encima y provocar un salto de W
 * completo que, a su vez, dispara otro ajuste… (bucle de vaivén).
 */
const TOLERANCIA_BORDE = 1;

/**
 * Carrusel infinito: la pista renderiza el set de productos 3 veces.
 * El scroll se mantiene en el bloque central y, al salir, se salta de forma
 * invisible a la posición equivalente (las copias son idénticas).
 * Avanza solo cada 10 s y pausa al arrastrar o cambiar de pestaña.
 */
@Component({
  selector: 'app-productos',
  templateUrl: './productos.html',
  styleUrl: './productos.css',
  standalone: true,
  imports: [RevealDirective],
})
export class ProductosComponent implements AfterViewInit, OnDestroy {
  @ViewChild('pista') private pista?: ElementRef<HTMLDivElement>;

  /**
   * Demo: el mismo producto repetido. Para agregar más, sumar objetos acá.
   * La foto real va en public/assets/productos/repotero.png (fondo transparente);
   * si no existe, se muestra automáticamente el respaldo (ilustración SVG).
   */
  readonly productos: Producto[] = Array.from({ length: 6 }, () => ({
    nombre: 'Dulce de leche Repostero',
    foto: 'assets/productos/repotero.png',
    respaldo: 'assets/productos/repotero.svg',
  }));

  /** Tres copias del set para lograr el efecto infinito. */
  readonly muestra: Producto[] = [
    ...this.productos,
    ...this.productos,
    ...this.productos,
  ];

  /** Producto activo (siempre 0..n-1). */
  readonly indice = signal(0);
  readonly fotoRota = signal(false);

  private arrastrando = false;
  private startX = 0;
  private inicioScroll = 0;
  private movio = false;

  private animando = false;
  private raf = 0;
  private autoId = 0;
  private autoPermitido = false;
  private ajusteId = 0;
  private ro?: ResizeObserver;

  // ---------- ciclo de vida ----------

  ngAfterViewInit(): void {
    // Arranca en el bloque central: copia a la izquierda como "colchón"
    requestAnimationFrame(() => this.normalizar());

    window.addEventListener('resize', this.alRedimensionar);
    window.addEventListener('load', this.alRedimensionar);
    document.addEventListener('visibilitychange', this.alVisibilidad);
    // Las fuentes cambian el ancho de las flechas (y el de la pista): re-posiciona al cargarlas
    document.fonts?.ready.then(() => this.alRedimensionar());
    // Auto-alineación: si algo cambia el ancho de la pista (fuentes, zoom, scrollbars), recalcsla
    const pista = this.pista?.nativeElement;
    if (pista && 'ResizeObserver' in window) {
      this.ro = new ResizeObserver(() => this.alRedimensionar());
      this.ro.observe(pista);
    }

    // Con movimiento reducido no se anima ni se avanza solo
    this.autoPermitido = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.encenderAuto();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
    clearTimeout(this.ajusteId);
    clearInterval(this.autoId);
    this.ro?.disconnect();
    window.removeEventListener('resize', this.alRedimensionar);
    window.removeEventListener('load', this.alRedimensionar);
    document.removeEventListener('visibilitychange', this.alVisibilidad);
  }

  private readonly alRedimensionar = (): void => {
    this.cancelarAnim();
    const p = this.pista?.nativeElement;
    if (!p) return;
    const paso = this.pasoDe(p);
    if (paso <= 0) return;
    // Reubica en el bloque central manteniendo el producto visible
    p.scrollTo({ left: this.n() * paso + this.indice() * paso, behavior: 'instant' });
    this.normalizar();
  };

  private readonly alVisibilidad = (): void => {
    // Al volver a la pestaña, el conteo de 10 s arranca de nuevo
    if (!document.hidden) this.encenderAuto();
  };

  // ---------- navegación (infinita: nunca hay final) ----------

  anterior(): void {
    this.encenderAuto();
    this.avanzar(-1);
  }

  siguiente(): void {
    this.encenderAuto();
    this.avanzar(1);
  }

  irA(i: number): void {
    this.encenderAuto();
    const p = this.pista?.nativeElement;
    if (!p) return;
    this.normalizar();
    const paso = this.pasoDe(p);
    if (paso <= 0) return;
    const W = this.n() * paso;
    const base = i * paso + W; // ocurrencia dentro del bloque central
    // Elegir la copia equivalente más cercana (el contenido es periódico)
    const destino = [base - W, base, base + W]
      .filter((x) => x >= 0 && x <= 3 * W)
      .reduce((a, b) => (Math.abs(b - p.scrollLeft) < Math.abs(a - p.scrollLeft) ? b : a));
    this.animarA(destino);
  }

  /** Avanza o retrocede un producto desde la posición actual. */
  private avanzar(delta: number): void {
    const p = this.pista?.nativeElement;
    if (!p) return;
    this.normalizar();
    const paso = this.pasoDe(p);
    if (paso <= 0) return;
    this.animarA(p.scrollLeft + delta * paso);
  }

  // ---------- scroll e índice ----------

  alDesplazar(): void {
    const p = this.pista?.nativeElement;
    if (!p) return;
    this.sincronizar(p);
    if (this.arrastrando || this.animando) return; // cada modo cuida sus límites
    this.normalizar(); // rueda que cruzó a una copia → salto invisible

    // Ajuste al producto más cercano cuando el usuario deja la rueda
    clearTimeout(this.ajusteId);
    this.ajusteId = window.setTimeout(() => this.ajustar(), ESPERA_AJUSTE);
  }

  private sincronizar(p: HTMLDivElement): void {
    const paso = this.pasoDe(p);
    if (paso <= 0) return;
    const k = Math.round(p.scrollLeft / paso);
    const i = ((k % this.n()) + this.n()) % this.n();
    this.indice.set(i);
  }

  /** Mantiene el scroll dentro del bloque central (salto invisible entre copias). */
  private normalizar(): void {
    const p = this.pista?.nativeElement;
    if (!p || this.animando || this.arrastrando) return;
    const paso = this.pasoDe(p);
    if (paso <= 0) return;
    const W = this.n() * paso;
    let sl = p.scrollLeft;
    // Tolerancia de borde: evita el vaivén cuando el navegador redondea
    // scrollLeft a enteros y la posición cae ~0,3 px fuera de [W, 2W)
    while (sl < W - TOLERANCIA_BORDE) sl += W;
    while (sl >= 2 * W - TOLERANCIA_BORDE) sl -= W;
    if (Math.abs(sl - p.scrollLeft) > 0.5) {
      p.scrollTo({ left: sl, behavior: 'instant' });
    }
    this.sincronizar(p);
  }

  /** Ajusta al producto más cercano (tras soltar el dedo o la rueda). */
  private ajustar(): void {
    if (this.arrastrando || this.animando) return;
    const p = this.pista?.nativeElement;
    if (!p) return;
    this.normalizar();
    const paso = this.pasoDe(p);
    if (paso <= 0) return;
    // Índice visible y su ocurrencia más cercana dentro del bloque central
    const n = this.n();
    const k = Math.min(Math.max(Math.round(p.scrollLeft / paso), n), 2 * n - 1);
    this.animarA(k * paso);
  }

  // ---------- animación con requestAnimationFrame ----------

  private animarA(destino: number): void {
    const p = this.pista?.nativeElement;
    if (!p) return;
    this.cancelarAnim();
    if (this.arrastrando) return;
    this.normalizar(); // origen dentro del bloque central

    const desde = p.scrollLeft;
    const delta = destino - desde;

    if (Math.abs(delta) < 1 || this.reducido()) {
      p.scrollTo({ left: destino, behavior: 'instant' });
      this.normalizar();
      this.sincronizar(p);
      return;
    }

    this.animando = true;
    const t0 = performance.now();
    const pasoAnim = (ahora: number): void => {
      const k = Math.min(1, (ahora - t0) / DURACION);
      const e = 1 - Math.pow(1 - k, 3); // easeOutCubic
      p.scrollTo({ left: desde + delta * e, behavior: 'instant' });
      this.sincronizar(p);
      if (k < 1) {
        this.raf = requestAnimationFrame(pasoAnim);
      } else {
        this.animando = false;
        this.normalizar(); // vuelve al bloque central si terminó en una copia
      }
    };
    this.raf = requestAnimationFrame(pasoAnim);
  }

  private cancelarAnim(): void {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.animando = false;
    clearTimeout(this.ajusteId);
  }

  private reducido(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // ---------- avance automático (cada 10 s) ----------

  private encenderAuto(): void {
    clearInterval(this.autoId);
    if (!this.autoPermitido) return;
    this.autoId = window.setInterval(() => {
      if (!document.hidden && !this.arrastrando) this.siguiente();
    }, INTERVALO_AUTO);
  }

  // ---------- utilidades de medida ----------

  private n(): number {
    return this.productos.length;
  }

  private pasoDe(p: HTMLDivElement): number {
    const slide = p.querySelector<HTMLElement>('.slide');
    if (!slide) return 0;
    const gap = parseFloat(getComputedStyle(p).columnGap || '0') || 0;
    // getBoundingClientRect().width da el ancho exacto (offsetWidth redondea a enteros
    // y ese redondeo desfasa la alineación ~1px cada 6 slides)
    return slide.getBoundingClientRect().width + gap;
  }

  // ---------- Arrastre con mouse o dedo ----------

  alBajar(e: PointerEvent): void {
    const p = this.pista?.nativeElement;
    if (!p || (e.pointerType === 'mouse' && e.button !== 0)) return;
    this.cancelarAnim();
    clearInterval(this.autoId); // pausa el avance automático mientras se arrastra
    this.normalizar(); // origen dentro del bloque central
    this.arrastrando = true;
    this.movio = false;
    this.startX = e.clientX;
    this.inicioScroll = p.scrollLeft;
    p.classList.add('arrastrando');
    try {
      p.setPointerCapture(e.pointerId);
    } catch {
      /* algunos punteros sintéticos no permiten capture */
    }
  }

  alMover(e: PointerEvent): void {
    if (!this.arrastrando) return;
    const p = this.pista?.nativeElement;
    if (!p) return;
    const dx = e.clientX - this.startX;
    if (Math.abs(dx) > 6) this.movio = true;
    const paso = this.pasoDe(p);
    if (paso <= 0) return;
    const W = this.n() * paso;
    let destino = this.inicioScroll - dx;
    // Cruza a otra copia sin cortar el arrastre: se sincroniza el origen
    while (destino < W) {
      destino += W;
      this.inicioScroll += W;
    }
    while (destino >= 2 * W) {
      destino -= W;
      this.inicioScroll -= W;
    }
    p.scrollTo({ left: destino, behavior: 'instant' });
    this.sincronizar(p);
  }

  alSoltar(e: PointerEvent): void {
    if (!this.arrastrando) return;
    this.arrastrando = false;
    const p = this.pista?.nativeElement;
    if (!p) return;
    p.classList.remove('arrastrando');
    try {
      if (p.hasPointerCapture(e.pointerId)) p.releasePointerCapture(e.pointerId);
    } catch {
      /* punteros sintéticos */
    }
    this.encenderAuto(); // retoma el ciclo de 10 s
    if (this.movio) this.ajustar(); // ajuste al producto más cercano
  }

  /** Evita que un clic normal dispare el link después de arrastrar */
  bloquearClick(e: MouseEvent): void {
    if (this.movio) {
      e.preventDefault();
      e.stopPropagation();
      this.movio = false;
    }
  }
}
