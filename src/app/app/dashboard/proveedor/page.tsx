'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

type Provider = {
  id: string;
  name: string;
  category: string | null;
  rating: number | null;
  location: string | null;
};

export default function ProveedoresPage() {
  const router = useRouter();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchProviders = async () => {
    const { data, error } = await supabase
      .from('providers')
      .select('id, name, category, rating, location');

    if (!error) {
      setProviders(data || []);
    }
  };

  useEffect(() => {
    const checkSessionAndLoad = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      await fetchProviders();
      setLoading(false);
    };

    checkSessionAndLoad();
  }, [router]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('providers').delete().eq('id', id);
    if (!error) await fetchProviders();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const newProvider: Omit<Provider, 'id'> = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      rating: Number(formData.get('rating')),
      location: formData.get('location') as string,
    };

    if (editingProvider) {
      // Update
      await supabase
        .from('providers')
        .update(newProvider)
        .eq('id', editingProvider.id);
    } else {
      // Create
      await supabase.from('providers').insert([
        {
          ...newProvider,
          id: uuidv4(),
        },
      ]);
    }

    setShowForm(false);
    setEditingProvider(null);
    await fetchProviders();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-lime-50 flex items-center justify-center text-lime-600">
        Cargando proveedores...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-100 to-lime-200 p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-lime-700">Proveedores</h1>
        <button
          className="bg-lime-600 text-white px-4 py-2 rounded hover:bg-lime-700 text-sm"
          onClick={() => {
            setEditingProvider(null);
            setShowForm(true);
          }}
        >
          + Agregar
        </button>
      </div>

      {providers.length === 0 ? (
        <p className="text-lime-600">No hay proveedores registrados.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="bg-white rounded-lg shadow p-4 border border-lime-200"
            >
              <h2 className="text-lg font-semibold text-lime-800">{provider.name}</h2>
              {provider.category && (
                <p className="text-sm text-gray-600 mt-1">Categoría: {provider.category}</p>
              )}
              {provider.rating != null && (
                <p className="text-sm text-gray-600">Calificación: {provider.rating}</p>
              )}
              {provider.location && (
                <p className="text-sm text-gray-600">Ubicación: {provider.location}</p>
              )}
              <div className="mt-4 flex gap-2">
                <button
                  className="text-sm text-white bg-blue-500 px-3 py-1 rounded"
                  onClick={() => {
                    setEditingProvider(provider);
                    setShowForm(true);
                  }}
                >
                  Editar
                </button>
                <button
                  className="text-sm text-white bg-red-500 px-3 py-1 rounded"
                  onClick={() => handleDelete(provider.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow-md w-full max-w-md"
          >
            <h2 className="text-lg font-bold text-lime-700 mb-4">
              {editingProvider ? 'Editar proveedor' : 'Nuevo proveedor'}
            </h2>
            <input
              type="text"
              name="name"
              defaultValue={editingProvider?.name || ''}
              placeholder="Nombre"
              required
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="text"
              name="category"
              defaultValue={editingProvider?.category || ''}
              placeholder="Categoría"
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="number"
              name="rating"
              defaultValue={editingProvider?.rating?.toString() || ''}
              placeholder="Calificación"
              step="0.1"
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="text"
              name="location"
              defaultValue={editingProvider?.location || ''}
              placeholder="Ubicación"
              className="w-full mb-3 p-2 border rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingProvider(null);
                }}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-lime-600 text-white px-4 py-2 rounded"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
