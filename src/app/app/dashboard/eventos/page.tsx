'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function EventosPage() {
  const [eventos, setEventos] = useState<any[]>([]);

  useEffect(() => {
    const fetchEventos = async () => {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;
      if (!userId) return;

      const { data } = await supabase
        .from('bookings')
        .select('id, status, events(title, date, location)')
        .eq('user_id', userId);

      setEventos(data || []);
    };

    fetchEventos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-200 p-4">
      <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-orange-700">Mis Reservas</h1>
        {eventos.map((reserva) => (
          <div key={reserva.id} className="border p-4 rounded mb-2">
            <p><strong>{reserva.events.title}</strong></p>
            <p>{reserva.events.date} - {reserva.events.location}</p>
            <p className="text-sm text-gray-500">Estado: {reserva.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
