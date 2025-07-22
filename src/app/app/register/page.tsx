'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('usuario');
  const router = useRouter();

  const handleRegister = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    const user = data.user;
    if (user) {
      await supabase.from('users').insert([
        {
          id: user.id,
          name,
          role,
        },
      ]);
      router.push('/login');
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Crear cuenta</h1>
      <input
        type="text"
        placeholder="Nombre completo"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border mb-2"
      />
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border mb-2"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border mb-2"
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full p-2 border mb-4"
      >
        <option value="usuario">Usuario</option>
        <option value="proveedor">Proveedor</option>
        <option value="admin">Administrador</option>
      </select>
      <button onClick={handleRegister} className="bg-green-600 text-white px-4 py-2 rounded w-full">
        Registrarse
      </button>
    </div>
  );
}
