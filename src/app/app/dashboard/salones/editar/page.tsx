'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface EditarSalonProps {
  salonId: string;
  onCierre: () => void;
  onActualizado: () => void;
}

export default function EditarSalon({ salonId, onCierre, onActualizado }: EditarSalonProps) {
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [capacidad, setCapacidad] = useState<number | ''>('');
  const [equipamiento, setEquipamiento] = useState('');
  const [responsable, setResponsable] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos del salón al montar
  useEffect(() => {
    async function cargarSalon() {
      const { data, error } = await supabase
        .from('salones')
        .select('*')
        .eq('id', salonId)
        .single();
      if (error) {
        setError('Error al cargar salón: ' + error.message);
      } else if (data) {
        setNombre(data.nombre);
        setUbicacion(data.ubicacion);
        setCapacidad(data.capacidad);
        setEquipamiento(data.equipamiento?.join(', ') || '');
        setResponsable(data.responsable);
        setDescripcion(data.descripcion);
      }
    }
    cargarSalon();
  }, [salonId]);

  const handleEditar = async () => {
    if (!nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('salones')
        .update({
          nombre,
          ubicacion,
          capacidad: capacidad ? Number(capacidad) : 0,
          equipamiento: equipamiento
            ? equipamiento.split(',').map((e) => e.trim())
            : [],
          responsable,
          descripcion,
        })
        .eq('id', salonId);

      if (error) throw error;
      onActualizado();
      onCierre();
    } catch (err: any) {
      setError('Error al editar salón: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4 overflow-auto max-h-[90vh]">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg animate-fade-in">
        <h2 className="text-xl font-bold text-yellow-600 mb-4">Editar salón</h2>

        <label className="block mb-2 text-sm text-gray-700">Nombre*:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          required
          placeholder="Ejemplo: Salón Diamante"
        />

        <label className="block mb-2 text-sm text-gray-700">Ubicación:</label>
        <input
          type="text"
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          placeholder="Ejemplo: Av. Principal #123, Tegucigalpa"
        />

        <label className="block mb-2 text-sm text-gray-700">Capacidad:</label>
        <input
          type="number"
          value={capacidad}
          onChange={(e) =>
            setCapacidad(e.target.value === '' ? '' : Number(e.target.value))
          }
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          placeholder="Ejemplo: 150"
          min={0}
        />

        <label className="block mb-2 text-sm text-gray-700">
          Equipamiento (separado por comas):
        </label>
        <input
          type="text"
          value={equipamiento}
          onChange={(e) => setEquipamiento(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          placeholder="Ejemplo: sonido, iluminación, aire acondicionado"
        />

        <label className="block mb-2 text-sm text-gray-700">Responsable:</label>
        <input
          type="text"
          value={responsable}
          onChange={(e) => setResponsable(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          placeholder="Ejemplo: Juan Pérez"
        />

        <label className="block mb-2 text-sm text-gray-700">Descripción:</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          rows={4}
          placeholder="Ejemplo: Salón amplio con vista panorámica y terraza."
        />

        {error && <p className="text-sm text-center mb-2 text-red-600">{error}</p>}

        <div className="flex justify-between">
          <button
            onClick={onCierre}
            disabled={loading}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleEditar}
            disabled={loading}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
          >
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}
