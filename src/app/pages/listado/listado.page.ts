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
  IonIcon,
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

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
    IonIcon,
  ],
})
export class ListadoPage implements OnInit {
  tipo: 'linda' | 'fea' = 'linda'; // valor inicial por defecto
  imagenes: any[] = [];
  usuarioActual: any;
  constructor(
    private route: ActivatedRoute,
    private supabase: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.tipo = this.route.snapshot.paramMap.get('tipo') as 'linda' | 'fea';
    const user = await this.supabase.getCurrentUser();
    const nombre = user.data.user?.email;
    this.usuarioActual = nombre;
    this.cargarImagenes();
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
