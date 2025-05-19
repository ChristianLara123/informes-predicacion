'use client';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Importar funciones para Firestore
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase/config';  // Importación ajustada

const publicadores = [
  { id: 1, nombre: 'Juan Pérez', precursor: false },
  { id: 2, nombre: 'Ana Torres', precursor: true },
  { id: 3, nombre: 'Carlos Díaz', precursor: false },
];

export default function RegistroPredicacion() {
  const [busqueda, setBusqueda] = useState('');
  const [registros, setRegistros] = useState({});
  const [guardando, setGuardando] = useState(false);

  const filtrarPublicadores = publicadores.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const manejarCambio = (id, campo, valor) => {
    setRegistros((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [campo]: valor,
      },
    }));
  };

  const exportarExcel = () => {
    const datos = publicadores.map((p) => {
      const r = registros[p.id] || {};
      return {
        Nombre: p.nombre,
        Predicó: r.predico ? 'Sí' : 'No',
        Horas: p.precursor ? r.horas || 0 : '',
        'Cursos Bíblicos': r.cursos || 0,
        Comentarios: r.comentarios || '',
      };
    });

    const hoja = XLSX.utils.json_to_sheet(datos);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, 'Informe');
    const archivo = XLSX.write(libro, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([archivo], { type: 'application/octet-stream' });
    saveAs(blob, 'informe-predicacion.xlsx');
  };

  // Función para guardar en Firebase
  const guardarEnFirebase = async () => {
    setGuardando(true);
    try {
      const coleccion = collection(db, 'informes');
      for (const p of publicadores) {
        const r = registros[p.id] || {};
        await addDoc(coleccion, {
          nombre: p.nombre,
          predico: r.predico || false,
          horas: p.precursor ? Number(r.horas) || 0 : null,
          cursos: Number(r.cursos) || 0,
          comentarios: r.comentarios || '',
          fecha: new Date().toISOString(),
        });
      }
      alert('Datos guardados correctamente en la base de datos.');
    } catch (error) {
      alert('Error al guardar datos: ' + error.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold' }}>Registro de Predicación</h1>
      <input
        placeholder='Buscar publicador...'
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{ padding: 8, marginTop: 12, marginBottom: 20, width: '100%' }}
      />
      {filtrarPublicadores.map((p) => (
        <div key={p.id} style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <h2>{p.nombre}</h2>
          <label>
            <input
              type='checkbox'
              checked={registros[p.id]?.predico || false}
              onChange={(e) => manejarCambio(p.id, 'predico', e.target.checked)}
            />{' '}
            Predicó
          </label>
          {p.precursor && (
            <input
              type='number'
              placeholder='Horas'
              value={registros[p.id]?.horas || ''}
              onChange={(e) => manejarCambio(p.id, 'horas', e.target.value)}
              style={{ display: 'block', marginTop: 8, padding: 6, width: '100%' }}
            />
          )}
          <input
            type='number'
            placeholder='Cursos bíblicos dirigidos'
            value={registros[p.id]?.cursos || ''}
            onChange={(e) => manejarCambio(p.id, 'cursos', e.target.value)}
            style={{ display: 'block', marginTop: 8, padding: 6, width: '100%' }}
          />
          <textarea
            placeholder='Comentarios'
            value={registros[p.id]?.comentarios || ''}
            onChange={(e) => manejarCambio(p.id, 'comentarios', e.target.value)}
            style={{ display: 'block', marginTop: 8, padding: 6, width: '100%' }}
          />
        </div>
      ))}
      <button
        onClick={exportarExcel}
        style={{
          marginTop: 20,
          padding: 10,
          backgroundColor: '#0a7cff',
          color: 'white',
          border: 'none',
          borderRadius: 5,
          cursor: 'pointer',
          marginRight: 10,
        }}
      >
        Exportar a Excel
      </button>

      <button
        onClick={guardarEnFirebase}
        disabled={guardando}
        style={{
          marginTop: 20,
          padding: 10,
          backgroundColor: guardando ? '#888' : '#0a7cff',
          color: 'white',
          border: 'none',
          borderRadius: 5,
          cursor: guardando ? 'not-allowed' : 'pointer',
        }}
      >
        {guardando ? 'Guardando...' : 'Guardar en base de datos'}
      </button>
    </div>
  );
}
