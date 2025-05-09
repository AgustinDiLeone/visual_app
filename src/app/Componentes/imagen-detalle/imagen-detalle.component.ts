import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonButtons,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-imagen-detalle',
  templateUrl: './imagen-detalle.component.html',
  styleUrls: ['./imagen-detalle.component.scss'],
  standalone: true,
  imports: [IonButtons, IonButton, IonTitle, IonToolbar, IonHeader, IonContent],
})
export class ImagenDetalleComponent implements OnInit {
  imageUrl: string = '';
  imageName: string = '';
  tipo: 'linda' | 'fea' = 'linda';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.imageUrl = params['url'];
      this.imageName = params['nombre'];
      this.tipo = params['tipo'];
    });
  }
  volver() {
    // Regresa a la página anterior
    this.router.navigate([`/graficos/${this.tipo}`]); // O cambia la ruta según la navegación anterior
  }
}
