'use client'

import { useEffect, useState } from 'react'
import { obtenerLugaresConSalones } from '@/services/lugarService'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import ChatBot from '@/components/ChatBot'

interface Salon {
  id: string
  nombre: string
  ubicacion: string
  capacidad: number
  descripcion?: string
  url_imagen?: string
  equipamiento?: string[]
}

interface Lugar {
  id: string
  nombre: string
  direccion?: string
  descripcion?: string
  ciudad?: string
  municipio?: string
  departamento?: string
  pais?: string
  salones: Salon[]
}

export default function LugarPage() {
  const [lugares, setLugares] = useState<Lugar[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  useEffect(() => {
    const cargarLugares = async () => {
      try {
        const data = await obtenerLugaresConSalones()
        setLugares(data)
      } catch (error) {
        console.error('Error al cargar lugares:', error)
      } finally {
        setLoading(false)
      }
    }
    cargarLugares()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
        <p className="text-orange-700 text-xl font-medium">Cargando lugares...</p>
      </div>
    )
  }

  // Filtrar lugares basado en la búsqueda
  const filteredLugares = lugares.filter((lugar) =>
    lugar.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lugar.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lugar.ciudad?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lugar.salones.some(salon => 
      salon.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-200 p-4">
      {/* Encabezado */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="mr-4 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
        >
          <Image src="/back-arrow.png" alt="Volver" width={24} height={24} className="w-6 h-6" />
        </button>
        <div className="text-2xl font-bold text-orange-600">Lugares y Salones</div>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6">
        <div className="flex items-center bg-white rounded-full shadow px-4 py-2">
          <input
            type="text"
            placeholder="Buscar lugares o salones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow outline-none text-sm text-orange-700"
          />
          <Image src="/buscar.png" alt="Buscar" width={20} height={20} />
        </div>
      </div>

      {/* Contenido principal */}
      <div className="space-y-8">
        {filteredLugares.length > 0 ? (
          filteredLugares.map((lugar) => (
            <div key={lugar.id} className="bg-white rounded-2xl shadow-lg p-6">
              {/* Información del lugar */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-orange-600 mb-3">{lugar.nombre}</h2>
                
                {/* Dirección y ubicación */}
                {(lugar.direccion || lugar.ciudad) && (
                  <div className="flex items-center mb-2">
                    <div className="w-5 h-5 mr-2">
                      📍
                    </div>
                    <div className="text-sm text-gray-600">
                      {lugar.direccion && <span>{lugar.direccion}</span>}
                      {lugar.ciudad && (
                        <span className="ml-2">
                          {lugar.ciudad}
                          {lugar.municipio && lugar.municipio !== lugar.ciudad && `, ${lugar.municipio}`}
                          {lugar.departamento && `, ${lugar.departamento}`}
                          {lugar.pais && `, ${lugar.pais}`}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Descripción del lugar */}
                {lugar.descripcion && (
                  <p className="text-gray-700 bg-orange-50 p-4 rounded-lg border-l-4 border-orange-300">
                    {lugar.descripcion}
                  </p>
                )}
              </div>

              {/* Salones del lugar */}
              {lugar.salones.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold text-orange-600 mb-4">
                    Salones disponibles ({lugar.salones.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {lugar.salones.map((salon) => (
                      <div
                        key={salon.id}
                        className="bg-gradient-to-br from-orange-50 to-white border border-orange-200 rounded-xl p-4 hover:shadow-md transition-all duration-300 hover:scale-105"
                      >
                        {/* Imagen del salón */}
                        {salon.url_imagen && (
                          <div className="mb-3 overflow-hidden rounded-lg">
                            <Image
                              src={salon.url_imagen}
                              alt={salon.nombre}
                              width={300}
                              height={200}
                              className="w-full h-32 object-cover hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        )}

                        {/* Información del salón */}
                        <div>
                          <h4 className="font-semibold text-orange-700 mb-1 text-lg">
                            {salon.nombre}
                          </h4>
                          
                          <div className="text-sm text-gray-600 mb-2">
                            <div className="flex items-center mb-1">
                              <span className="mr-1">📍</span>
                              {salon.ubicacion}
                            </div>
                            <div className="flex items-center">
                              <span className="mr-1">👥</span>
                              Capacidad: {salon.capacidad} personas
                            </div>
                          </div>

                          {/* Descripción del salón */}
                          {salon.descripcion && (
                            <p className="text-sm text-gray-700 mb-2 bg-white p-2 rounded-md border">
                              {salon.descripcion}
                            </p>
                          )}

                          {/* Equipamiento */}
                          {salon.equipamiento && salon.equipamiento.length > 0 && (
                            <div className="text-xs">
                              <div className="flex items-center mb-1">
                                <span className="mr-1">🔧</span>
                                <span className="font-medium text-orange-600">Equipamiento:</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {salon.equipamiento.map((equipo, index) => (
                                  <span
                                    key={index}
                                    className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs border"
                                  >
                                    {equipo}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-2">🏢</div>
                  <p className="text-gray-500">No hay salones disponibles en este lugar</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-orange-300 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-orange-600 mb-2">
              No se encontraron resultados
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? `No hay lugares o salones que coincidan con "${searchTerm}"`
                : "No hay lugares disponibles en este momento"
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        )}
      </div>

      {/* ChatBot flotante */}
      <ChatBot />
    </div>
  )
}