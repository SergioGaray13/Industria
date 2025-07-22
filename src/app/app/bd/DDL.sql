-- Tabla de usuarios
create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text check (role in ('usuario', 'proveedor')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Tabla de eventos
create table events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  date date not null,
  location text,
  user_id uuid references users(id) on delete cascade,
  contact_phone text,
  contact_email text,
  category_id uuid references categories(id) on delete set null
);


-- Tabla de categorias de eventos
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text
);

-- Tabla de proveedores
create table if not exists providers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  rating numeric,
  location text,
  user_id uuid references users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Tabla de patrocinadores
create table if not exists sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text, -- URL de imagen o logo
  website text,
  description text,
  user_id uuid references users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Tabla de usuarios
create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text check (role in ('usuario', 'proveedor')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Tabla de eventos
-- Asegúrate de tener habilitada la extensión para UUID
create extension if not exists "pgcrypto";

-- Tabla actualizada de eventos
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  date date not null,
  location text, -- ubicación textual (puedes mantenerla)
  user_id uuid references users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  -- Nuevos campos sugeridos
  catering text,
  location_id uuid references locations(id) on delete set null, -- lugar seleccionado
  audiovisual text,
  event_type text,
  attendees_estimated integer,
  notes text
);


-- Tabla de proveedores
create table if not exists providers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  rating numeric,
  location text,
  user_id uuid references users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Tabla de reservas
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  provider_id uuid references providers(id) on delete cascade,
  event_id uuid references events(id) on delete cascade,
  status text check (status in ('pendiente', 'confirmado', 'cancelado')) default 'pendiente',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  content text,
  type text check (type in ('anuncio', 'publicacion', 'encuesta')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table users
  drop constraint if exists users_role_check;

alter table users
  add constraint users_role_check
  check (role in ('usuario', 'proveedor', 'admin'));

-- Tabla de lugares
CREATE TABLE IF NOT EXISTS lugares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    direccion TEXT,
    descripcion TEXT,
    ciudad TEXT,
    municipio TEXT,
    departamento TEXT,
    pais TEXT,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS salones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  ubicacion TEXT,
  capacidad INTEGER,
  equipamiento TEXT[], -- array de texto para listar proyectores, micrófonos, etc.
  responsable TEXT,
  descripcion TEXT,
  sesiones JSONB, -- sesiones como [{hora: "10:00", tema: "Ciberseguridad"}, ...]
  url_imagen TEXT, -- campo opcional para mostrar imágenes en el frontend
  lugar_id UUID REFERENCES lugares(id) ON DELETE CASCADE, -- vínculo con tabla lugares
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE reservas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid REFERENCES auth.users(id),
  salon_id uuid REFERENCES salones(id),
  fecha date NOT NULL,
  hora time NOT NULL,
  estado text DEFAULT 'pendiente',
  created_at timestamp DEFAULT now()
);

CREATE TABLE soporte (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla FAQ con embeddings vectoriales (pgvector)
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE faq (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pregunta text NOT NULL,
  respuesta text NOT NULL,
  embedding vector(1536) NOT NULL -- tamaño embedding de OpenAI text-embedding-ada-002
);

-- Agregar columnas de fecha
ALTER TABLE faq
ADD COLUMN created_at timestamptz DEFAULT now(),
ADD COLUMN updated_at timestamptz;

-- Tabla logs de conversaciones
CREATE TABLE chatbot_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mensaje_usuario text NOT NULL,
  respuesta_bot text NOT NULL,
  creado_en timestamptz DEFAULT now()
);

create or replace function match_faq(
  query_embedding vector(1536),
  similarity_threshold float,
  match_limit int
)
returns table (
  id uuid,
  pregunta text,
  respuesta text,
  embedding vector(1536)
)
language sql stable as $$
  select id, pregunta, respuesta, embedding
  from faq
  where embedding <=> query_embedding < (1 - similarity_threshold)
  order by embedding <=> query_embedding
  limit match_limit;
$$;