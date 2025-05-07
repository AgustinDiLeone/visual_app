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
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { v4 as uuidv4 } from 'uuid';
import { UtilService } from 'src/app/services/util';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButton,
  ],
})
export class MenuPage implements OnInit {
  tipo: 'linda' | 'fea' = 'linda'; // valor inicial por defecto

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private serv: UtilService
  ) {}

  ngOnInit() {
    this.tipo = this.route.snapshot.paramMap.get('tipo') as 'linda' | 'fea';
  }
  atras() {
    this.serv.routerLink('/home');
  }

  async irASacarFoto() {
    try {
      // 1. Tomar la foto
      const image = await Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });

      // 2. Obtener el usuario actual
      const { data: userData, error } =
        await this.authService.supabaseClient.auth.getUser();
      if (error || !userData.user) {
        throw new Error('Usuario no autenticado');
      }

      const nombreUsuario = userData.user.email;
      const fileName = `${uuidv4()}.jpeg`;

      // 3. Convertir la imagen base64 a un formato de archivo
      let base64Image = image.base64String;

      // Eliminar el prefijo "data:image/jpeg;base64," si está presente
      if (base64Image!.startsWith('data:image/jpeg;base64,')) {
        base64Image = base64Image!.replace('data:image/jpeg;base64,', '');
      }

      const byteCharacters = atob(base64Image!); // Decodificar base64
      const byteArrays = [];

      // Convertir base64 a un array de bytes
      for (let offset = 0; offset < byteCharacters.length; offset++) {
        const byteArray = byteCharacters.charCodeAt(offset);
        byteArrays.push(byteArray);
      }

      const blob = new Blob([new Uint8Array(byteArrays)], {
        type: 'image/jpeg',
      });

      // 3. Subir la imagen al storage
      const { error: uploadError } =
        await this.authService.supabaseClient.storage
          .from('imagenes')
          .upload(`${this.tipo}/${fileName}`, blob!, {
            contentType: 'image/jpeg',
          });

      if (uploadError) throw uploadError;

      // 4. Obtener la URL pública
      const { data: urlData } = this.authService.supabaseClient.storage
        .from('imagenes')
        .getPublicUrl(`${this.tipo}/${fileName}`);

      const publicUrl = urlData.publicUrl;

      // 5. Guardar en la base de datos
      const { error: insertError } = await this.authService.supabaseClient
        .from('imagenes')
        .insert({
          url: publicUrl,
          nombre: nombreUsuario,
          fecha: new Date(),
          tipo: this.tipo,
          likes: [],
        });

      if (insertError) throw insertError;

      alert('¡Foto subida correctamente!');
    } catch (err) {
      console.error('Error al subir la foto', err);
      alert('Error al subir la foto');
    }
  }

  irAListado() {
    this.router.navigate(['/listado-fotos', this.tipo]);
  }

  irAGraficos() {
    this.router.navigate(['/graficos', this.tipo]);
  }
}
