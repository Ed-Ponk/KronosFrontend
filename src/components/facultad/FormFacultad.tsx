import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axiosInstance from '../../api/axiosConfig';
import {FormFacultadProps} from '../../types/Facultad';

const MySwal = withReactContent(Swal);


const FormFacultad: React.FC<FormFacultadProps> = ({ selectedFacultad, setSelectedFacultad, fetchData }) => {
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    if (selectedFacultad) {
      setNombre(selectedFacultad.nombre);
    }
  }, [selectedFacultad]);

  const handleCancel = () => {
    setSelectedFacultad(null);
    setNombre('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const endpoint = selectedFacultad ? '/facultad/actualizar-facultad' : '/facultad/registrar-facultad';
    const method = selectedFacultad ? 'PUT' : 'POST';

    try {
      const response = await axiosInstance({
        method: method,
        url: endpoint,
        data: {
          facultad_id: selectedFacultad ? selectedFacultad.facultad_id : undefined,
          nombre: nombre,
        },
      });
      if (response.data.status) {
        MySwal.fire({
          title: 'Éxito',
          text: selectedFacultad ? 'Facultad actualizada con éxito' : 'Facultad registrada con éxito',
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
    } catch (e) {
      MySwal.fire({
        title: 'Error',
        text: 'Error al registrar la facultad. Inténtalo de nuevo más tarde.',
        icon: 'error',
      });
    }
  };

  return (
    <div className="flex flex-col w-4/5 mx-auto bg-white rounded-xl shadow-md overflow-hidden p-5">
      <h1 className="block font-medium leading-6 text-gray-900 mb-4">
        {selectedFacultad ? 'Editar Facultad' : 'Registrar Facultad'}
      </h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className='flex space-x-4'>
          <div className='flex-1'>
            <label htmlFor="nombre" className="block text-sm font-medium leading-6 text-gray-900">
              Nombre de la Facultad
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
        </div>

        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {selectedFacultad ? 'Actualizar Facultad' : 'Registrar Facultad'}
          </button>
          {selectedFacultad && (
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

export default FormFacultad;
