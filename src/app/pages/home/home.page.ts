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
  async ngOnInit() {}
  private serv = inject(UtilService);
  private client = inject(AuthService);

  navegar(eleccion: string) {
    if (eleccion == 'feas') {
      this.serv.routerLink('/feas');
    }
    if (eleccion == 'lindas') {
      this.serv.routerLink('/lindas');
    }
  }

  cerrarSesion() {
    this.client.singOut();
    this.serv.routerLink('/login');
  }
}
