'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const links = [
  { href: '/dashboard', label: 'Inicio' },
  { href: '/dashboard/mapa', label: 'Mapa' },
  { href: '/dashboard/feed', label: 'Feed' },
  { href: '/dashboard/eventos', label: 'Mis Eventos' },
  { href: '/dashboard/crear-evento', label: 'Crear Evento' },
  { href: '/dashboard/soporte', label: 'Soporte' },
];

export default function DashboardNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (pathname === '/login') return null;

  return (
    <>
      <nav className="bg-gray-100 p-4 flex justify-between items-center border-b">
        <div className="flex gap-4">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded font-medium ${
                  isActive
                    ? 'text-black gradient-bg-animated'
                    : 'text-gray-700 hover:text-white hover:gradient-bg-animated hover:bg-gradient-to-r hover:from-orange-400 hover:via-orange-500 hover:to-orange-600'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        )}
      </nav>

      <style jsx>{`
        .gradient-bg-animated {
          background: linear-gradient(
            90deg,
            #f97316,
            #fb923c,
            #f97316,
            #fb923c
          );
          background-size: 200% 100%;
          animation: slideBg 3s linear infinite;
        }

        @keyframes slideBg {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 200% 0%;
          }
        }
      `}</style>
    </>
  );
}
