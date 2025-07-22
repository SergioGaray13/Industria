import { supabase } from '@/lib/supabase';

export async function obtenerSalonesDisponibles() {
  const { data, error } = await supabase
    .from('salones')
    .select('id, nombre, ubicacion, capacidad, descripcion, equipamiento');

  if (error) {
    console.error('Error al obtener salones:', error);
    throw error;
  }

  return data;
}

// Nueva función para agregar un salón
export async function agregarSalon(salon: {
  nombre: string;
  ubicacion?: string;
  capacidad?: number;
  descripcion?: string;
  url_imagen?: string;
}) {
  const { data, error } = await supabase
    .from('salones')
    .insert([salon]);

  if (error) {
    console.error('Error al agregar salón:', error);
    throw error;
  }

  return data;
}
