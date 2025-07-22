'use client';
import dynamic from 'next/dynamic';

const MapaInteractivo = dynamic(() => import('@/components/MapaInteractivo'), {
  ssr: false,
});

export default function MapaPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Mapa Interactivo</h1>
      <MapaInteractivo />
    </div>
  );
}
