import { Component, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { UtilService } from 'src/app/services/util';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonButtons, IonButton, IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage {
  constructor() {}

  private serv = inject(UtilService);
  private client = inject(AuthService);
  private spinner = inject(SpinnerService);

  ngOnInit(): void {}

  navegar(eleccion: string) {
    if (eleccion == 'feas') {
      (document.activeElement as HTMLElement)?.blur();
      this.spinner.mostrar();
      this.serv.routerLink('/menu/fea');
    }
    if (eleccion == 'lindas') {
      (document.activeElement as HTMLElement)?.blur();
      this.spinner.mostrar();
      this.serv.routerLink('/menu/linda');
    }
  }

  cerrarSesion() {
    this.client.singOut();
    this.serv.routerLink('/login');
  }
}
