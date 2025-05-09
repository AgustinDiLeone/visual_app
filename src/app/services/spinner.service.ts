import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpinnerService {
  private activo = false;

  mostrar(tiempo: number = 1500) {
    this.activo = true;
    setTimeout(() => this.ocultar(), tiempo); // Oculta en 3 segundos
  }
  mostrarSinTiempo() {
    this.activo = true;
  }

  ocultar() {
    this.activo = false;
  }

  isActivo() {
    return this.activo;
  }
}
