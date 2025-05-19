'use client';

import { useState } from 'react';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/ver-informes');
    } catch (err) {
      setError('Correo o contraseña incorrectos.');
      console.error(err);
    }
  };

  return (
    <div style={{
      maxWidth: 400, margin: '40px auto', padding: 30,
      border: '1px solid #ccc', borderRadius: 10, backgroundColor: '#f4f4f4'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Iniciar Sesión</h2>

      <form onSubmit={handleLogin}>
        <label>Correo:</label><br />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: 8, marginBottom: 15, borderRadius: 5 }}
        />

        <label>Contraseña:</label><br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: 8, marginBottom: 15, borderRadius: 5 }}
        />

        <button type="submit" style={{
          width: '100%', padding: 10, backgroundColor: '#004080',
          color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer'
        }}>
          Entrar
        </button>

        {error && <p style={{ color: 'red', textAlign: 'center', marginTop: 15 }}>{error}</p>}
      </form>
    </div>
  );
}
