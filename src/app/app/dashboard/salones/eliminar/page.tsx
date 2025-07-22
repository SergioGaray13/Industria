'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface EliminarSalonProps {
  salonId: string;
  onCierre: () => void;
  onEliminado: () => void;
}

export default function EliminarSalon({ salonId, onCierre, onEliminado }: EliminarSalonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEliminar = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.from('salones').delete().eq('id', salonId);
      if (error) throw error;
      onEliminado();
      onCierre();
    } catch (err: any) {
      setError('Error al eliminar salón: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg animate-fade-in">
        <h2 className="text-xl font-bold text-red-600 mb-4">Confirmar eliminación</h2>
        <p className="mb-4">¿Estás seguro de que quieres eliminar este salón? Esta acción no se puede deshacer.</p>
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="flex justify-between">
          <button
            onClick={onCierre}
            disabled={loading}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleEliminar}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}
