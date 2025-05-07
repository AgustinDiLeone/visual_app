import { inject, Injectable } from '@angular/core';
import {
  createClient,
  SignInWithPasswordCredentials,
  SupabaseClient,
} from '@supabase/supabase-js';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  supabaseClient: SupabaseClient;

  constructor() {
    this.supabaseClient = createClient(
      environment.SUPABASE_URL,
      environment.SUPABASE_KEY
    );
  }

  logIn(credential: SignInWithPasswordCredentials) {
    return this.supabaseClient.auth.signInWithPassword(credential);
  }
  singOut() {
    return this.supabaseClient.auth.signOut();
  }

  // ✅ Obtener usuario autenticado
  getCurrentUser() {
    return this.supabaseClient.auth.getUser();
  }

  // ✅ Subir imagen al storage
  async uploadImage(file: File, tipo: 'linda' | 'fea') {
    const user = await this.getCurrentUser();
    const nombre = user.data.user?.email || 'desconocido';
    const filePath = `${tipo}/${Date.now()}_${file.name}`;

    const { error } = await this.supabaseClient.storage
      .from('imagenes')
      .upload(filePath, file);

    if (error) throw error;

    const { data } = this.supabaseClient.storage
      .from('imagenes')
      .getPublicUrl(filePath);

    await this.saveImageMetadata({
      url: data.publicUrl,
      nombre,
      tipo,
    });

    return data.publicUrl;
  }

  // ✅ Guardar metadatos de imagen
  async saveImageMetadata({
    url,
    nombre,
    tipo,
  }: {
    url: string;
    nombre: string;
    tipo: 'linda' | 'fea';
  }) {
    const { error } = await this.supabaseClient.from('imagenes').insert([
      {
        url,
        nombre,
        tipo,
        fecha: new Date().toISOString(),
      },
    ]);

    if (error) throw error;
  }
  // ✅ Agregar un like si la persona no lo dio antes a esa imagen
  async likeImage(imagenId: number, nombre: string) {
    // Chequea si esta persona ya dio like a esta imagen
    const { data: existingLikes, error: fetchError } = await this.supabaseClient
      .from('likes')
      .select('*')
      .eq('imagen_id', imagenId)
      .eq('nombre', nombre);

    if (fetchError) throw fetchError;

    if (existingLikes && existingLikes.length > 0) {
      throw new Error('Ya diste like a esta imagen');
    }

    const { error } = await this.supabaseClient.from('likes').insert([
      {
        imagen_id: imagenId,
        nombre,
        fecha: new Date().toISOString(),
      },
    ]);

    if (error) throw error;
  }
}
