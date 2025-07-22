'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function CrearEventoPage() {
  const router = useRouter();

  // Campos principales
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // Nuevos campos
  const [eventType, setEventType] = useState('');
  const [catering, setCatering] = useState('');
  const [audiovisual, setAudiovisual] = useState('');
  const [attendeesEstimated, setAttendeesEstimated] = useState('');
  const [notes, setNotes] = useState('');

  // Lugar y salones relacionados
  const [places, setPlaces] = useState<any[]>([]);
  const [placeId, setPlaceId] = useState('');
  const [locations, setLocations] = useState<any[]>([]);
  const [locationId, setLocationId] = useState('');

  useEffect(() => {
    // Obtener usuario
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data?.user?.id || null);
    });

    // Cargar categorías y lugares
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select('id, name');
      if (!error) setCategories(data || []);
    };

    const fetchPlaces = async () => {
      const { data, error } = await supabase.from('lugares').select('id, nombre');
      if (!error) setPlaces(data || []);
    };

    fetchCategories();
    fetchPlaces();
  }, []);

  // Cargar salones al seleccionar un lugar
  useEffect(() => {
    const fetchLocations = async () => {
      if (!placeId) return setLocations([]);

      const { data, error } = await supabase
        .from('salones')
        .select('id, nombre')
        .eq('lugar_id', placeId);

      if (!error) setLocations(data || []);
    };

    fetchLocations();
  }, [placeId]);

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
  const isValidPhone = (phone: string) => /^[0-9\s()+-]{7,}$/.test(phone);

  const handleSubmit = async () => {
    if (!userId) return alert('Debes iniciar sesión');

    // Validaciones
    if (!title || !date || !location || !contactPhone || !contactEmail || !categoryId) {
      return alert('Por favor completa todos los campos obligatorios');
    }

    if (!isValidEmail(contactEmail)) {
      return alert('Correo electrónico no válido');
    }

    if (!isValidPhone(contactPhone)) {
      return alert('Teléfono no válido');
    }

    const today = new Date();
    const selectedDate = new Date(date);
    if (selectedDate < today) {
      return alert('La fecha del evento debe ser futura');
    }

    const { error } = await supabase.from('events').insert([
      {
        title,
        description,
        date,
        location,
        user_id: userId,
        contact_phone: contactPhone,
        contact_email: contactEmail,
        category_id: categoryId || null,
        event_type: eventType,
        catering,
        audiovisual,
        attendees_estimated: Number(attendeesEstimated),
        notes,
        location_id: locationId || null,
      },
    ]);

    if (error) {
      console.error(error);
      alert('Error al crear el evento');
    } else {
      alert('✅ Evento creado con éxito');
      router.push('/dashboard/eventos');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-200 p-4">
      <div className="p-6 max-w-xl mx-auto bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-orange-700">Crear nuevo evento</h1>

        <input
          type="text"
          placeholder="Título *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border mb-2"
        />

        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border mb-2"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border mb-2"
        />

        <input
          type="text"
          placeholder="Ubicación * (texto libre)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border mb-2"
        />

        <input
          type="tel"
          placeholder="Teléfono de contacto *"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          className="w-full p-2 border mb-2"
        />

        <input
          type="email"
          placeholder="Correo electrónico *"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          className="w-full p-2 border mb-2"
        />

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full p-2 border mb-2"
        >
          <option value="">Selecciona una categoría *</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Tipo de evento (ej. velorio, boda...)"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className="w-full p-2 border mb-2"
        />

        <select
          value={placeId}
          onChange={(e) => {
            setPlaceId(e.target.value);
            setLocationId(''); // limpiar salón si cambia lugar
          }}
          className="w-full p-2 border mb-2"
        >
          <option value="">Selecciona un lugar</option>
          {places.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>

        <select
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          className="w-full p-2 border mb-2"
          disabled={!placeId}
        >
          <option value="">Selecciona un salón</option>
          {locations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.nombre}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Catering (opcional)"
          value={catering}
          onChange={(e) => setCatering(e.target.value)}
          className="w-full p-2 border mb-2"
        />

        <input
          type="text"
          placeholder="Audiovisuales necesarios"
          value={audiovisual}
          onChange={(e) => setAudiovisual(e.target.value)}
          className="w-full p-2 border mb-2"
        />

        <input
          type="number"
          placeholder="Número estimado de asistentes"
          value={attendeesEstimated}
          onChange={(e) => setAttendeesEstimated(e.target.value)}
          className="w-full p-2 border mb-2"
        />

        <textarea
          placeholder="Notas o requerimientos especiales"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-2 border mb-4"
        />

        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Crear Evento
        </button>
      </div>
    </div>
  );
}
