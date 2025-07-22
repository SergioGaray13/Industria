'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { agregarSalon } from '@/services/salonService';

export default function NuevoSalon() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isModal = searchParams.get('modal') === 'true';

  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [capacidad, setCapacidad] = useState<number | ''>('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const cerrarModal = () => {
    router.push('/dashboard/salones');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await agregarSalon({
        nombre,
        ubicacion,
        capacidad: capacidad ? Number(capacidad) : undefined,
        descripcion,
      });
      router.push('/dashboard/salones');
    } catch (err: any) {
      setError(err.message || 'Error al agregar salón');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
          onClick={cerrarModal}
        />
      )}

      <div
        className={`${
          isModal
            ? 'fixed inset-0 z-50 flex items-center justify-center p-4'
            : 'p-6'
        }`}
        onClick={isModal ? cerrarModal : undefined}
      >
        <form
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg relative"
        >
          <h1 className="text-2xl mb-4 font-bold text-gray-800">
            Agregar nuevo salón
          </h1>

          <input
            type="text"
            placeholder="Nombre del salón *"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="border border-gray-300 p-2 w-full mb-3 rounded"
          />
          <input
            type="text"
            placeholder="Ubicación"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            className="border border-gray-300 p-2 w-full mb-3 rounded"
          />
          <input
            type="number"
            placeholder="Capacidad"
            value={capacidad}
            onChange={(e) =>
              setCapacidad(e.target.value === '' ? '' : Number(e.target.value))
            }
            className="border border-gray-300 p-2 w-full mb-3 rounded"
          />
          <textarea
            placeholder="Descripción"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="border border-gray-300 p-2 w-full mb-4 rounded"
            rows={4}
          />

          {error && <p className="text-red-600 mb-3">{error}</p>}

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={cerrarModal}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Agregar Salón'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
