import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';

const MySwal = withReactContent(Swal);

type DataItem = {
  usuario_id: number;
  email: string;
  clave: string;
  estado: string;
  jurado_id: string;
  rol: string;
};

interface FormUsuarioProps {
  selectedUsuario: DataItem | null;
  setSelectedUsuario: React.Dispatch<React.SetStateAction<DataItem | null>>;
  fetchData: () => void;
}

export const FormUsuario: React.FC<FormUsuarioProps> = ({ selectedUsuario, setSelectedUsuario, fetchData }) => {
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const [estado, setEstado] = useState(false);

  useEffect(() => {
    if (selectedUsuario) {
      setEmail(selectedUsuario.email);
      setClave(''); // Clear the password field when editing
      setEstado(selectedUsuario.estado === '1');
    }
  }, [selectedUsuario]);

  const handleCancel = () => {
    setSelectedUsuario(null);
    setEmail('');
    setClave('');
    setEstado(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const endpoint = selectedUsuario ? `http://127.0.0.1:5000/usuarios/actualizar-usuario` : `http://127.0.0.1:5000/usuarios/registro-usuario`;
    const method = selectedUsuario ? 'PUT' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario_id: selectedUsuario ? selectedUsuario.usuario_id : undefined,
          email: email,
          clave: selectedUsuario ? (clave ? clave : null) : clave, // Send null if password is empty when updating
          estado: estado ? 1 : 0, // 1 for Activo, 0 for Inactivo
          jurado_id: null, // Predeterminado a null
          rol: 'Administrador' // Predeterminado a Administrador
        }),
      });
      console.log(response);
      const data = await response.json();

      if (data.status) {
        MySwal.fire({
          title: 'Éxito',
          text: selectedUsuario ? 'Usuario actualizado con éxito' : 'Usuario registrado con éxito',
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
        text: 'Error al registrar el usuario. Inténtalo de nuevo más tarde.',
        icon: 'error',
      });
    }
  };

  const handleAsignarUsuarios = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/usuarios/asignar-jurado');
      if (response.data.status) {
        MySwal.fire({
          title: 'Éxito',
          text: 'Usuarios asignados a jurados con éxito',
          icon: 'success',
        });
        fetchData(); // Actualiza la tabla
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
        text: 'Error al asignar usuarios a jurados. Inténtalo de nuevo más tarde.',
        icon: 'error',
      });
    }
  };

  return (
    <div className="flex mt-3 flex-col w-1/2 mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden p-5">
      <h1 className="block font-medium leading-6 text-gray-900 dark:text-gray-200 mb-4">
        {selectedUsuario ? 'Editar Usuario' : 'Registrar Usuario Administrador'}
      </h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full dark:bg-gray-700 rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-200 p-1 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="flex-1">
            <label htmlFor="clave" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
              Clave
            </label>
            <div className="mt-2">
              <input
                id="clave"
                name="clave"
                type="password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                className="block w-full rounded-md border-0 dark:bg-gray-700 py-1.5 text-gray-900 dark:text-gray-200 p-1 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                required={!selectedUsuario} // Required only if not editing
              />
            </div>
          </div>
        </div>

        <div className='flex items-center space-x-4'>
          <div className='flex-1'>
            <label htmlFor="estado" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
              Estado
            </label>
            <div className="mt-2 flex items-center">
              <input
                id="estado"
                name="estado"
                type="checkbox"
                checked={estado}
                onChange={(e) => setEstado(e.target.checked)}
                className="rounded-md border-0 text-indigo-600  dark:text-indigo-400 shadow-sm focus:ring-2 focus:ring-indigo-600"
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
            {selectedUsuario ? 'Actualizar Usuario' : 'Registrar Usuario'}
          </button>
          {selectedUsuario && (
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

      <div className="mt-6 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-200">Asignar Usuarios a Jurados</h2>
        <button
          type="button"
          onClick={handleAsignarUsuarios}
          className="flex justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          Asignar
        </button>
      </div>
    </div>
  );

};

export default FormUsuario;
