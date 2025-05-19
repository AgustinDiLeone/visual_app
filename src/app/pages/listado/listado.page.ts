import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AlertaService } from 'src/app/services/alerta.service';
import { SpinnerComponent } from 'src/app/Componentes/spinner/spinner.component';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-listado',
  templateUrl: './listado.page.html',
  styleUrls: ['./listado.page.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    CommonModule,
    FormsModule,
  ],
})
export class ListadoPage implements OnInit {
  //Deslizar
  currentIndex: number = 0;
  touchStartY: number = 0;
  touchEndY: number = 0;

  onTouchStart(event: TouchEvent) {
    this.touchStartY = event.changedTouches[0].clientY;
  }

  onTouchEnd(event: TouchEvent) {
    this.touchEndY = event.changedTouches[0].clientY;
    this.handleSwipe();
  }

  handleSwipe() {
    const delta = this.touchStartY - this.touchEndY;
    const threshold = 50;

    if (delta > threshold) {
      // Deslizó hacia arriba
      if (this.currentIndex < this.imagenes.length - 1) {
        this.currentIndex++;
      } else {
        this.alert.mostrar('Ya estás en la última imagen.', 'info', 1500);
      }
    } else if (delta < -threshold) {
      // Deslizó hacia abajo
      if (this.currentIndex > 0) {
        this.currentIndex--;
      } else {
        this.alert.mostrar('Ya estás en la primera imagen.', 'info', 1500);
      }
    }
  }
  //fin
  tipo: 'linda' | 'fea' = 'linda'; // valor inicial por defecto
  imagenes: any[] = [];
  usuarioActual: any;
  constructor(
    private route: ActivatedRoute,
    private supabase: AuthService,
    private router: Router,
    private alert: AlertaService,
    private spinner: SpinnerService
  ) {}

  async ngOnInit() {
    this.tipo = this.route.snapshot.paramMap.get('tipo') as 'linda' | 'fea';
    const user = await this.supabase.getCurrentUser();
    const nombre = user.data.user?.email;
    this.usuarioActual = nombre;
    await this.cargarImagenes();
    console.log(`usuario: ${this.usuarioActual}`);
  }
  async cargarImagenes() {
    const { data, error } = await this.supabase.supabaseClient
      .from('imagenes')
      .select('*')
      .eq('tipo', this.tipo)
      .order('fecha', { ascending: false });

    if (error) {
      console.error('Error al cargar imágenes:', error.message);
    } else {
      this.imagenes = data;
      console.log(this.imagenes);
    }
  }
  salir() {
    this.router.navigate([`/menu/${this.tipo}`]);
  }
  tapTimeout: any = null;
  lastTapTime = 0;

  handleDoubleTap(imagen: any) {
    const now = new Date().getTime();
    const DOUBLE_TAP_DELAY = 300;

    if (this.lastTapTime && now - this.lastTapTime < DOUBLE_TAP_DELAY) {
      clearTimeout(this.tapTimeout);
      this.likear(imagen);
    } else {
      this.tapTimeout = setTimeout(() => {
        // toque simple: no hacemos nada
      }, DOUBLE_TAP_DELAY);
    }

    this.lastTapTime = now;
  }
  likear(imagen: any) {
    if (!imagen.likes) {
      imagen.likes = [];
    }

    if (!imagen.likes.includes(this.usuarioActual)) {
      imagen.likes.push(this.usuarioActual);
      console.log(`Imagen ${imagen.nombre} likeada por ${this.usuarioActual}`);

      // Aquí podés actualizar en Supabase:
      this.actualizarLikesEnSupabase(imagen.id, this.usuarioActual);
    } else {
      console.log(`${this.usuarioActual} ya dio like a esta imagen`);
      this.alert.mostrar(
        `${this.usuarioActual} ya dio like a esta imagen`,
        'error'
      );
    }
  }
  async actualizarLikesEnSupabase(idImagen: number, usuario: string) {
    // 1. Traer el campo likes de la imagen
    const { data, error: getError } = await this.supabase.supabaseClient
      .from('imagenes')
      .select('likes')
      .eq('id', idImagen)
      .single();

    if (getError) {
      console.error('Error al obtener los likes:', getError.message);
      return;
    }

    // 2. Asegurarse de que likes sea un array
    let likes = data.likes || [];

    // 3. Agregar el usuario al final del array likes
    likes.push(usuario);

    // 4. Actualizar la columna
    const { error: updateError } = await this.supabase.supabaseClient
      .from('imagenes')
      .update({ likes }) // likes será un array → se guarda como JSONB
      .eq('id', idImagen);

    if (updateError) {
      console.error('Error al actualizar likes:', updateError.message);
    } else {
      console.log('Like agregado correctamente');
    }
  }
}
