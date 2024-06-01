import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

type DataItem = {
  semestre_id: number;
  nombre_semestres: string;
  fecha_fin: string;
  fecha_inicio: string;
  vigente: string;
};

interface FormSemestreProps {
  selectedSemestre: DataItem | null;
  setSelectedSemestre: React.Dispatch<React.SetStateAction<DataItem | null>>;
  fetchData: () => void;
}

export const FormSemestre: React.FC<FormSemestreProps> = ({ selectedSemestre, setSelectedSemestre, fetchData }) => {
  const [nombreSemestre, setNombreSemestre] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [vigente, setVigente] = useState(false);

  useEffect(() => {
    if (selectedSemestre) {
      setNombreSemestre(selectedSemestre.nombre_semestres);
      setFechaInicio(selectedSemestre.fecha_inicio);
      setFechaFin(selectedSemestre.fecha_fin);
      setVigente(selectedSemestre.vigente === 'Activo');
    }
  }, [selectedSemestre]);

  const handleCancel = () => {
    setSelectedSemestre(null);
    setNombreSemestre('');
    setFechaInicio('');
    setFechaFin('');
    setVigente(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const endpoint = selectedSemestre ? `http://127.0.0.1:5000/semestres/actualizar-semestre` : `http://127.0.0.1:5000/semestres/registro-semestre`;
    const method = selectedSemestre ? 'PUT' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          semestre_id: selectedSemestre ? selectedSemestre.semestre_id : undefined,
          nombre_semestre: nombreSemestre,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          vigente: vigente ? 1 : 0
        }),
      });
      console.log(response);
      const data = await response.json();
     
      if (data.status) {
        MySwal.fire({
          title: 'Éxito',
          text: selectedSemestre ? 'Semestre actualizado con éxito' : 'Semestre registrado con éxito',
          icon: 'success',
        });
        // Limpiar el formulario después del éxito
        handleCancel();
        fetchData(); // Actualiza la tabla
      } else {
        MySwal.fire({
          title: 'Error',
          text: data.message,
          icon: 'error',
        });
      }
    } catch (e) {
      MySwal.fire({
        title: 'Error',
        text: 'Error al registrar el semestre. Inténtalo de nuevo más tarde.',
        icon: 'error',
      });
    }
  };

 return (
  <div className="flex mt-2 flex-col w-1/2 mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-5">
    <h1 className="block font-medium leading-6 text-gray-900 dark:text-gray-200 mb-4">
      {selectedSemestre ? 'Editar Semestre' : 'Registrar Semestre'}
    </h1>
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="flex space-x-4">
        <div className="flex-1">
          <label htmlFor="fecha_inicio" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
            Fecha de Inicio
          </label>
          <div className="mt-2">
            <input
              id="fecha_inicio"
              name="fecha_inicio"
              type="date"
              required
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-200 dark:bg-gray-700 p-1 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className="flex-1">
          <label htmlFor="fecha_fin" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
            Fecha de Fin
          </label>
          <div className="mt-2">
            <input
              id="fecha_fin"
              name="fecha_fin"
              type="date"
              required
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-200 dark:bg-gray-700 p-1 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>

      <div className='flex space-x-4'>
        <div className='flex-1'>
          <label htmlFor="nombre_semestre" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
            Nombre del Semestre
          </label>
          <div className="mt-2">
            <input
              id="nombre_semestre"
              name="nombre_semestre"
              type="text"
              required
              value={nombreSemestre}
              onChange={(e) => setNombreSemestre(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-200 dark:bg-gray-700 p-1 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div className='flex-1'>
          <label htmlFor="vigente" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
            Vigente
          </label>
          <div className="mt-2 flex items-center">
            <input
              id="vigente"
              name="vigente"
              type="checkbox"
              checked={vigente}
              onChange={(e) => setVigente(e.target.checked)}
              className="rounded-md border-0 text-indigo-600 dark:bg-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-600"
            />
            <span className="ml-2 text-sm text-gray-900 dark:text-gray-200">Activo</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          type="submit"
          className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {selectedSemestre ? 'Actualizar Semestre' : 'Registrar Semestre'}
        </button>
        {selectedSemestre && (
          <button
            type="button"
            onClick={handleCancel}
            className="ml-4 flex justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  </div>
);
};

export default FormSemestre;