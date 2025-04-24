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

@Component({
  selector: 'app-lindas',
  templateUrl: './lindas.component.html',
  styleUrls: ['./lindas.component.scss'],
  imports: [
    IonButtons,
    CommonModule,
    IonButton,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
  ],
  standalone: true,
})
export class LindasComponent implements OnInit {
  constructor() {}
  private serv = inject(UtilService);

  ngOnInit() {}
  atras() {
    this.serv.routerLink('/home');
  }
}
