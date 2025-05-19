'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

type Informe = {
  id: string;
  nombre: string;
  mes: string;
  esPrecursor: boolean;
  horas: number;
  cursos: number;
  comentarios: string;
};

export default function VerInformes() {
  const [informes, setInformes] = useState<Informe[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [mesFiltrado, setMesFiltrado] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [informeEditado, setInformeEditado] = useState<Partial<Informe>>({});
  const [error, setError] = useState('');

  // 5. Uso de onSnapshot para datos en tiempo real (opción 5)
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'informes'),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Informe, 'id'>),
        }));
        setInformes(data);
      },
      (error) => {
        console.error('Error al obtener informes en tiempo real:', error);
        setError('Error al cargar los informes.');
      }
    );
    return () => unsubscribe();
  }, []);

  // 2. Manejo de errores para eliminar
  const eliminarInforme = async (id: string) => {
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este informe?');
    if (!confirmacion) return;

    try {
      await deleteDoc(doc(db, 'informes', id));
      // No es necesario actualizar setInformes aquí porque onSnapshot actualiza en tiempo real
    } catch (err) {
      alert('Error al eliminar el informe');
      console.error(err);
    }
  };

  // 2. Manejo de errores para guardar edición
  const guardarEdicion = async () => {
    if (!editandoId || !informeEditado) return;

    try {
      await updateDoc(doc(db, 'informes', editandoId), {
        ...informeEditado,
      });

      // No es necesario actualizar setInformes porque onSnapshot actualiza
      setEditandoId(null);
      setInformeEditado({});
    } catch (err) {
      alert('Error al guardar la edición');
      console.error(err);
    }
  };

  // 3. Asegurar valores iniciales en edición para evitar undefined
  const iniciarEdicion = (informe: Informe) => {
    setEditandoId(informe.id);
    setInformeEditado({
      nombre: informe.nombre || '',
      mes: informe.mes || '',
      esPrecursor: informe.esPrecursor || false,
      horas: informe.horas || 0,
      cursos: informe.cursos || 0,
      comentarios: informe.comentarios || '',
    });
  };

  const informesFiltrados = informes.filter((informe) => {
    const coincideNombre = informe.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideMes = mesFiltrado ? informe.mes === mesFiltrado : true;
    return coincideNombre && coincideMes;
  });

  // 4. Protección por autenticación: para esto puedes usar un hook o componente de Auth
  // Aquí un ejemplo básico con un estado de usuario simulado. Lo puedes reemplazar por tu auth real.
  // Si quieres, dime y te preparo el hook con Firebase Auth.

  // Si no está autenticado, muestra mensaje simple o redirige (aquí solo un mensaje)
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(true); // Cambia a false para probar no autenticado

  if (!usuarioAutenticado) {
    return (
      <div className="p-6 max-w-7xl mx-auto text-center">
        <h2 className="text-xl font-semibold mb-4">Acceso no autorizado</h2>
        <p>Debes iniciar sesión para ver los informes.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white text-gray-800 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">Informes Registrados</h1>

      {error && (
        <p className="mb-4 text-red-600 font-semibold text-center">{error}</p>
      )}

      <div className="flex flex-col md:flex-row md:items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm"
          value={mesFiltrado}
          onChange={(e) => setMesFiltrado(e.target.value)}
        >
          <option value="">Todos los meses</option>
          {[
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
          ].map((mes) => (
            <option key={mes} value={mes}>{mes}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Mes</th>
              <th className="px-6 py-3">¿Precursor?</th>
              <th className="px-6 py-3">Horas</th>
              <th className="px-6 py-3">Cursos</th>
              <th className="px-6 py-3">Comentarios</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {informesFiltrados.map((informe) => (
              <tr key={informe.id} className="hover:bg-gray-50 border-t border-gray-100">
                {editandoId === informe.id ? (
                  <>
                    <td className="px-6 py-2">
                      <input
                        type="text"
                        value={informeEditado.nombre || ''}
                        onChange={(e) => setInformeEditado({ ...informeEditado, nombre: e.target.value })}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="px-6 py-2">
                      <select
                        value={informeEditado.mes || ''}
                        onChange={(e) => setInformeEditado({ ...informeEditado, mes: e.target.value })}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                      >
                        <option value="">Selecciona un mes</option>
                        {[
                          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
                        ].map((mes) => (
                          <option key={mes} value={mes}>{mes}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={informeEditado.esPrecursor || false}
                        onChange={(e) => setInformeEditado({ ...informeEditado, esPrecursor: e.target.checked })}
                      />
                    </td>
                    <td className="px-6 py-2">
                      <input
                        type="number"
                        value={informeEditado.horas || 0}
                        onChange={(e) => setInformeEditado({ ...informeEditado, horas: Number(e.target.value) })}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        min={0}
                      />
                    </td>
                    <td className="px-6 py-2">
                      <input
                        type="number"
                        value={informeEditado.cursos || 0}
                        onChange={(e) => setInformeEditado({ ...informeEditado, cursos: Number(e.target.value) })}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                        min={0}
                      />
                    </td>
                    <td className="px-6 py-2">
                      <input
                        type="text"
                        value={informeEditado.comentarios || ''}
                        onChange={(e) => setInformeEditado({ ...informeEditado, comentarios: e.target.value })}
                        className="border border-gray-300 rounded px-2 py-1 w-full"
                      />
                    </td>
                    <td className="px-6 py-2 space-x-2">
                      <button onClick={guardarEdicion} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Guardar</button>
                      <button onClick={() => setEditandoId(null)} className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600">Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-3">{informe.nombre}</td>
                    <td className="px-6 py-3">{informe.mes}</td>
                    <td className="px-6 py-3">{informe.esPrecursor ? 'Sí' : 'No'}</td>
                    <td className="px-6 py-3">{informe.horas}</td>
                    <td className="px-6 py-3">{informe.cursos}</td>
                    <td className="px-6 py-3">{informe.comentarios}</td>
                    <td className="px-6 py-3 space-x-2">
                      <button onClick={() => iniciarEdicion(informe)} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Editar</button>
                      <button onClick={() => eliminarInforme(informe.id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Eliminar</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {informesFiltrados.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center px-6 py-4 text-gray-500">
                  No hay informes registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}



