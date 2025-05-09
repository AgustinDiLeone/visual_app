import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlertaService {
  private mostrar$ = new BehaviorSubject<boolean>(false);
  private mensaje$ = new BehaviorSubject<string>('');
  private tipo$ = new BehaviorSubject<'error' | 'success' | 'info'>('info');

  get visible() {
    return this.mostrar$.asObservable();
  }
  get mensaje() {
    return this.mensaje$.asObservable();
  }
  get tipo() {
    return this.tipo$.asObservable();
  }

  mostrar(
    mensaje: string,
    tipo: 'error' | 'success' | 'info' = 'info',
    segundos: number = 2000
  ) {
    this.mensaje$.next(mensaje);
    this.tipo$.next(tipo);
    this.mostrar$.next(true);
    setTimeout(() => this.ocultar(), segundos); // 3 segundos visible
  }

  ocultar() {
    this.mostrar$.next(false);
  }
}
