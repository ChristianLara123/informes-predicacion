'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useRouter } from 'next/navigation';

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/login'); // Redirige si no está logueado
      } else {
        setLoading(false); // Permite ver la página
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return <p style={{ textAlign: 'center' }}>Cargando...</p>;

  return <>{children}</>;
}
