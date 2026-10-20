import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import {
  ASUNTO_FORM,
  INSTAGRAM_URL,
  MAPA_URL,
  WHATSAPP_URL,
  WEB3FORMS_KEY,
} from '../../site.config';

interface RespuestaWeb3Forms {
  success: boolean;
  message?: string;
}

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.html',
  styleUrl: './contacto.css',
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class ContactoComponent {
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);

  /** Estado del envío y mensaje de aviso (signals: funcionan sin zonas) */
  readonly enviando = signal(false);
  readonly aviso = signal<{ texto: string; tipo: 'ok' | 'error' } | null>(null);

  /** Links de contacto (editables en site.config.ts) */
  readonly mapaUrl = MAPA_URL;
  readonly waUrl = WHATSAPP_URL;
  readonly instagramUrl = INSTAGRAM_URL;

  readonly formulario = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    telefono: [''],
    email: ['', Validators.email],
    empresa: [''],
    consulta: [''],
  });

  async enviar(): Promise<void> {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.aviso.set(null);
    const valores = this.formulario.getRawValue();

    try {
      const resp = await firstValueFrom(
        this.http.post<RespuestaWeb3Forms>('https://api.web3forms.com/submit', {
          ...valores,
          access_key: WEB3FORMS_KEY,
          subject: ASUNTO_FORM,
          from_name: 'Web Nono Reinaldo',
        }),
      );
      if (!resp.success) throw new Error(resp.message);
      this.formulario.reset();
      this.aviso.set({
        texto: '¡Gracias! Recibimos tu consulta y te contactamos pronto.',
        tipo: 'ok',
      });
    } catch {
      // Respaldo: si falla el mail, abrimos WhatsApp con el mensaje listo
      const mensaje = `Hola, soy ${valores.nombre}. ${valores.consulta || 'Quiero pedir un presupuesto.'}`;
      window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(mensaje)}`, '_blank');
      this.aviso.set({
        texto: 'No pudimos enviar el mail, te llevamos a WhatsApp.',
        tipo: 'error',
      });
    } finally {
      this.enviando.set(false);
    }
  }
}
