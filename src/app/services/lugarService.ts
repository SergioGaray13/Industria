'use server'

import { supabase } from '@/lib/supabase'

export async function obtenerLugaresDisponibles() {
  const { data, error } = await supabase
    .from('lugares')
    .select('id, nombre')
    .order('nombre', { ascending: true })

  if (error) throw error
  return data
}

export async function obtenerSalonesPorLugar(lugarId: string) {
  const { data, error } = await supabase
    .from('salones')
    .select('id, nombre')
    .eq('lugar_id', lugarId)
    .order('nombre', { ascending: true })

  if (error) throw error
  return data
}

// Nueva función para obtener lugares con salones anidados
export async function obtenerLugaresConSalones() {
  const { data, error } = await supabase
    .from('lugares')
    .select(`
      id,
      nombre,
      descripcion,
      salones (
        id,
        nombre,
        ubicacion,
        capacidad,
        descripcion,
        url_imagen,
        equipamiento
      )
    `)
    .order('nombre', { ascending: true })

  if (error) throw error
  return data
}
