/*INSERT*/
INSERT INTO users (id, name, role)
VALUES (
  '4c915513-50d5-48f3-80f9-eec1b013a0ff',
  'Sergio Garay',
  'usuario'
);


INSERT INTO providers (id, name, category, rating, location, user_id)
VALUES (
  gen_random_uuid(),
  'Sonido Total',
  'Audio y luces',
  5,
  'Tegucigalpa',
  '011a5d07-dd95-4560-99db-1c702d5b50b6'
);


-- Insertar un evento
INSERT INTO events (id, title, description, date, location, user_id)
VALUES (
  gen_random_uuid(),
  'Conferencia de Tecnología',
  'Un evento sobre innovación y desarrollo tecnológico.',
  '2025-09-15',
  'Auditorio Principal',
  'bdb7df0e-cfef-4d2d-a296-40f05423e734'
);


INSERT INTO categories (name, description) VALUES
  ('Bodas', 'Eventos de matrimonio, recepciones y celebraciones de boda'),
  ('Conferencias', 'Eventos corporativos, charlas y seminarios'),
  ('Fiestas Infantiles', 'Eventos para niños, como cumpleaños y celebraciones escolares');

  
INSERT INTO bookings (id, user_id, provider_id, event_id, status)
VALUES (
  gen_random_uuid(),
  'bdb7df0e-cfef-4d2d-a296-40f05423e734',
  '08e71632-bf24-4990-a644-af9c7e2927f6',
  '0457229a-3a2e-4cc7-8cd7-d48d8b079253',
  'pendiente'
);

INSERT INTO posts (id, user_id, content, type)
VALUES (
  gen_random_uuid(),
  'bdb7df0e-cfef-4d2d-a296-40f05423e734', -- ID del usuario que publica (Sergio u otro)
  '¡Reserva confirmada con Sonido Total para el evento de bodas!',
  'anuncio'
);


INSERT INTO salones (id, nombre, ubicacion, capacidad, equipamiento, responsable, descripcion, sesiones)
VALUES (
  gen_random_uuid(),
  'Salón Azul',
  'Edificio B',
  50,
  ARRAY['Proyector', 'Aire acondicionado'],
  'Carlos López',
  'Ideal para talleres y conferencias pequeñas',
  '[{"hora": "10:00", "tema": "Ciberseguridad"}]'::jsonb
);

INSERT INTO reservas (id, usuario_id, salon_id, fecha, hora, estado)
VALUES (
  gen_random_uuid(),
  'bdb7df0e-cfef-4d2d-a296-40f05423e734', -- usuario válido
  '8f817b1e-cf96-4822-9577-ff33a3af6f17', -- salón válido
  '2025-10-01',
  '14:00',
  'pendiente'
);



/*SELECT*/
SELECT id, email, created_at FROM auth.users;

SELECT * FROM users;
SELECT * FROM providers;