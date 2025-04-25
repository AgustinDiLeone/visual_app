import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
} from '@ionic/angular/standalone';
import { UtilService } from 'src/app/services/util';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-feas',
  templateUrl: './feas.component.html',
  styleUrls: ['./feas.component.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonContent,
    CommonModule,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
  ],
})
export class FeasComponent implements OnInit {
  constructor() {}
  private serv = inject(UtilService);
  photo: string | undefined;

  async ngOnInit() {}
  atras() {
    this.serv.routerLink('/home');
  }
  async sacarFoto() {
    const foto = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
    });
  }
}
