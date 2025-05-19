'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('Error capturado:', error);
  }, [error]);

  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">¡Algo salió mal!</h2>
      <p className="mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Intentar de nuevo
      </button>
    </div>
  );
}
