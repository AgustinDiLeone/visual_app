import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment'; // Asegúrate de tener las variables en tu environment

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private supabase;
  private bucketName = 'imagenes';

  constructor() {
    // Inicializa el cliente de Supabase con las credenciales de tu proyecto
    this.supabase = createClient(
      environment.SUPABASE_URL,
      environment.SUPABASE_KEY
    );
  }

  async subirImagen(
    file: File,
    tipo: 'linda' | 'fea',
    usuarioId: string
  ): Promise<void> {
    const filePath = `${usuarioId}/${Date.now()}_${file.name}`;

    const { error: uploadError } = await this.supabase.storage
      .from(this.bucketName)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = this.supabase.storage
      .from(this.bucketName)
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;

    const { error: insertError } = await this.supabase
      .from('imagenes')
      .insert([{ url: publicUrl, tipo, usuario_id: usuarioId }]);

    if (insertError) throw insertError;
  }

  async obtenerImagenes(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('imagenes')
      .select('*')
      .order('fecha', { ascending: false });

    if (error) throw error;

    return data;
  }
  // Método modificado en photo.service.ts
  async obtenerFotos(tipo: 'linda' | 'fea'): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('fotos')
      .select('id, url, tipo, fecha_subida, likes_lindas, likes_feas')
      .eq('tipo', tipo)
      .order('fecha_subida', { ascending: false });

    if (error) {
      console.error('Error al obtener fotos', error);
      return [];
    }
    return data;
  }

  async darLike(
    imagenId: string,
    usuarioId: string,
    tipo: 'linda' | 'fea'
  ): Promise<void> {
    const { error } = await this.supabase
      .from('likes')
      .insert([{ imagen_id: imagenId, usuario_id: usuarioId, tipo }]);

    if (error && !error.message.includes('duplicate key')) throw error;
  }

  async obtenerLikes(
    imagenId: string
  ): Promise<{ linda: number; fea: number }> {
    const { data, error } = await this.supabase
      .from('likes')
      .select('tipo')
      .eq('imagen_id', imagenId);

    if (error) throw error;

    const likesLinda = data.filter((like: any) => like.tipo === 'linda').length;
    const likesFea = data.filter((like: any) => like.tipo === 'fea').length;

    return { linda: likesLinda, fea: likesFea };
  }
}
