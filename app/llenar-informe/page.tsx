'use client';

import { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

export default function FormularioInforme() {
  const nombres = [
    'Carlos Pérez', 'Ana Rodríguez', 'Luis Gómez', 'María López',
    'José Martínez', 'Laura García', 'Pedro Sánchez'
  ];

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const [formulario, setFormulario] = useState({
    nombre: '',
    mes: '',
    esPrecursor: false,
    horas: '',
    cursos: '',
    comentarios: ''
  });

  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'error' | 'exito' } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormulario({
        ...formulario,
        [name]: checkbox.checked
      });
    } else {
      setFormulario({
        ...formulario,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nombres.includes(formulario.nombre)) {
      setMensaje({ texto: 'Por favor selecciona un nombre válido de la lista.', tipo: 'error' });
      return;
    }

    const horasNum = parseInt(formulario.horas);
    const cursosNum = parseInt(formulario.cursos);

    if (isNaN(horasNum) || horasNum < 0) {
      setMensaje({ texto: 'Por favor ingresa un número válido y no negativo en Horas.', tipo: 'error' });
      return;
    }

    if (isNaN(cursosNum) || cursosNum < 0) {
      setMensaje({ texto: 'Por favor ingresa un número válido y no negativo en Cursos bíblicos.', tipo: 'error' });
      return;
    }

    try {
      await addDoc(collection(db, 'informes'), {
        ...formulario,
        horas: horasNum,
        cursos: cursosNum
      });

      setMensaje({ texto: '¡Gracias por enviar tu informe!', tipo: 'exito' });
      setFormulario({
        nombre: '',
        mes: '',
        esPrecursor: false,
        horas: '',
        cursos: '',
        comentarios: ''
      });

      setTimeout(() => setMensaje(null), 3000);
    } catch (error) {
      console.error('Error al guardar:', error);
      setMensaje({ texto: 'Ocurrió un error al enviar el informe.', tipo: 'error' });
    }
  };

  return (
    <div style={{
      maxWidth: 500, margin: '40px auto', padding: 30,
      border: '1px solid #ccc', borderRadius: 10, backgroundColor: '#f9f9f9'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: 20 }}>Enviar Informe de Predicación</h2>

      <form onSubmit={handleSubmit}>

        <label htmlFor="nombre">Nombre:</label><br />
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formulario.nombre}
          onChange={handleChange}
          list="nombres"
          required
          placeholder="Escribe tu nombre"
          style={{ width: '100%', padding: 8, marginBottom: 15, borderRadius: 5, border: '1px solid #ccc' }}
        />
        <datalist id="nombres">
          {nombres.map((nombre) => (
            <option key={nombre} value={nombre} />
          ))}
        </datalist>

        <label htmlFor="mes">Mes:</label><br />
        <select
          id="mes"
          name="mes"
          value={formulario.mes}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: 8, marginBottom: 15, borderRadius: 5 }}
        >
          <option value="">Selecciona un mes</option>
          {meses.map((mes) => (
            <option key={mes} value={mes}>{mes}</option>
          ))}
        </select>

        <label htmlFor="esPrecursor" style={{ display: 'inline-flex', alignItems: 'center', marginBottom: 15 }}>
          <input
            type="checkbox"
            id="esPrecursor"
            name="esPrecursor"
            checked={formulario.esPrecursor}
            onChange={handleChange}
            style={{ marginRight: 8 }}
          />
          ¿Es precursor?
        </label><br />

        <label htmlFor="horas">Horas:</label><br />
        <input
          type="number"
          id="horas"
          name="horas"
          value={formulario.horas}
          onChange={handleChange}
          required
          min={0}
          style={{ width: '100%', padding: 8, marginBottom: 15, borderRadius: 5 }}
        />

        <label htmlFor="cursos">Cursos bíblicos:</label><br />
        <input
          type="number"
          id="cursos"
          name="cursos"
          value={formulario.cursos}
          onChange={handleChange}
          required
          min={0}
          style={{ width: '100%', padding: 8, marginBottom: 15, borderRadius: 5 }}
        />

        <label htmlFor="comentarios">Comentarios:</label><br />
        <textarea
          id="comentarios"
          name="comentarios"
          value={formulario.comentarios}
          onChange={handleChange}
          style={{ width: '100%', padding: 8, marginBottom: 15, borderRadius: 5 }}
        ></textarea>

        <button
          type="submit"
          style={{
            width: '100%', padding: 10, backgroundColor: '#004080',
            color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer'
          }}
        >
          Enviar Informe
        </button>

        {mensaje && (
          <p
            style={{
              marginTop: 20,
              textAlign: 'center',
              color: mensaje.tipo === 'exito' ? 'green' : 'red'
            }}
          >
            {mensaje.texto}
          </p>
        )}
      </form>
    </div>
  );
}




