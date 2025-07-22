'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Footer from '@/components/Footer'; // <-- Importación del Footer

const ChatBot = dynamic(() => import('@/components/ChatBot'), {
  ssr: false,
  loading: () => <div className="text-sm text-orange-500">Cargando Chat...</div>,
});

const categories = [
  { label: 'Salones', icon: '/salones.webp', href: '/dashboard/salones', priority: true },
  { label: 'Patrocinadores', icon: '/Sponsors.webp', href: '/dashboard/sponsors' },
  { label: 'Proveedores', icon: '/provider.webp', href: '/dashboard/proveedor' },
  { label: 'FAQ', icon: '/FAQ.webp', href: '/dashboard/faq' },
  { label: 'Lugar', icon: '/places.webp', href: '/dashboard/lugar' },
  { label: 'Favoritos', icon: '/Favoritos.webp', href: '/dashboard/favoritos' },
  { label: 'Mis Reservas', icon: '/Reservations.webp', href: '/dashboard/reservas' },
  { label: 'Categorías', icon: '/categorias.webp', href: '/dashboard/categorias' },
  { label: 'ChatBot', icon: '/Chatbot.webp', href: '/dashboard/chatbot' },
];

export default function Dashboard() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserRole = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push('/login');
        return;
      }

      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();

      setUserRole(userData?.role || null);
    };

    fetchUserRole();
  }, [router]);

  if (!userRole) {
    return (
      <div className="min-h-screen bg-orange-100 flex items-center justify-center text-orange-700">
        Cargando...
      </div>
    );
  }

  const filteredCategories = categories.filter((cat) =>
    cat.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-orange-100 to-orange-200 p-4">
      <div>
        {/* Encabezado */}
        <div className="text-2xl font-bold text-orange-600 mb-4">Eventualy</div>

        {/* Barra de búsqueda */}
        <div className="mb-6">
          <div className="flex items-center bg-white rounded-full shadow px-4 py-2">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow outline-none text-sm text-orange-700"
            />
            <div className="w-5 h-5 relative">
              <Image
                src="/buscar.webp"
                alt="Buscar"
                fill
                className="object-contain"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Categorías filtradas */}
        <div className="grid grid-cols-3 gap-4">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((cat) => (
              <div
                key={cat.label}
                onClick={() => router.push(cat.href)}
                className="flex flex-col items-center cursor-pointer"
              >
                <div className="w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center border border-orange-300 overflow-hidden relative">
                  <Image
                    src={cat.icon}
                    alt={cat.label}
                    fill
                    className="object-cover"
                    priority={cat.priority || false}
                    loading={cat.priority ? 'eager' : 'lazy'}
                  />
                </div>
                <span className="mt-2 text-sm text-orange-700 font-medium text-center">
                  {cat.label}
                </span>
              </div>
            ))
          ) : (
            <p className="text-orange-500 col-span-3 text-center">
              No se encontraron resultados.
            </p>
          )}
        </div>
      </div>

      {/* ChatBot flotante */}
      <ChatBot />

      {/* Footer al final de la pantalla */}
      <Footer />
    </div>
  );
}
