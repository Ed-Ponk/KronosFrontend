import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axiosInstance from '../../api/axiosConfig';
import { FormCursoProps } from '../../types/Curso';

const MySwal = withReactContent(Swal);

const FormCurso: React.FC<FormCursoProps> = ({ selectedCurso, setSelectedCurso, fetchData }) => {
  const [nombre, setNombre] = useState('');
  const [vigente, setVigente] = useState<boolean>(true);

  useEffect(() => {
    if (selectedCurso) {
      setNombre(selectedCurso.curso);
      setVigente(selectedCurso.vigente === 1);  // Actualiza el estado como booleano
    }
  }, [selectedCurso]);

  const handleCancel = () => {
    setSelectedCurso(null);
    setNombre('');
    setVigente(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = {
      curso_id: selectedCurso ? selectedCurso.curso_id : undefined,
      nombre: nombre,
      vigente: vigente ? 1 : 0 
    };

    console.log('Payload:', payload);

    const endpoint = selectedCurso ? '/curso/actualizar-curso' : '/curso/registrar-curso';
    const method = selectedCurso ? 'PUT' : 'POST';

    try {
      const response = await axiosInstance({
        method: method,
        url: endpoint,
        data: payload,
      });
      if (response.data.status) {
        MySwal.fire({
          title: 'Éxito',
          text: selectedCurso ? 'Curso actualizado con éxito' : 'Curso registrado con éxito',
          icon: 'success',
        });
        handleCancel();
        fetchData();
      } else {
        MySwal.fire({
          title: 'Error',
          text: response.data.message,
          icon: 'error',
        });
      }
    } catch (error) {
      console.error('Error al registrar el curso:', error);
      MySwal.fire({
        title: 'Error',
        text: 'Error al registrar el curso. Inténtalo de nuevo más tarde.',
        icon: 'error',
      });
    }
  };

  return (
    <div className="flex flex-col w-1/2 mx-auto bg-white rounded-xl shadow-md overflow-hidden p-5">
      <h1 className="block font-medium leading-6 text-gray-900 mb-4">
        {selectedCurso ? 'Editar Curso' : 'Registrar Curso'}
      </h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className='flex space-x-4'>
          <div className='flex-1'>
            <label htmlFor="nombre" className="block text-sm font-medium leading-6 text-gray-900">
              Nombre del Curso
            </label>
            <div className="mt-2">
              <input
                id="nombre"
                name="nombre"
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 p-1 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className='flex-1'>
            <label htmlFor="vigente" className="block text-sm font-medium leading-6 text-gray-900">
              Vigente
            </label>
            <div className="mt-2 flex items-center">
              <input
                id="vigente"
                name="vigente"
                type="checkbox"
                checked={vigente}
                onChange={(e) => setVigente(e.target.checked)}
                className="rounded-md border-0 text-indigo-600 shadow-sm focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {selectedCurso ? 'Actualizar Curso' : 'Registrar Curso'}
          </button>
          {selectedCurso && (
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

export default FormCurso;
