import React, { ChangeEvent } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ModalComponent from '../modal';
import SelectSemestre from '../semestre/SelectSemestre';
import SelectEscuela from '../escuela/selectEscuela';

const MySwal = withReactContent(Swal);

type JuradoFormState = {
  jurado_id?: number;
  nombre_completo: string;
  email: string;
  telefono: string;
  escuela_id: number | string;
  semestre_id: number | string;
  dedicacion: string;
  hora_asesoria_semanal: number | string;
};

interface ModalJuradoProps {
  isOpen: boolean;
  onRequestClose: () => void;
  isEditing: boolean;
  jurado: JuradoFormState;
  setJurado: React.Dispatch<React.SetStateAction<JuradoFormState>>;
  fetchData: () => void;
}

const ModalJurado: React.FC<ModalJuradoProps> = ({
  isOpen,
  onRequestClose,
  isEditing,
  jurado,
  setJurado,
  fetchData
}) => {

  const handleFormChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setJurado({ ...jurado, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (isEditing) {
        // Update the jurado
        const response = await axios.put(`http://127.0.0.1:5000/jurados/actualizar/${jurado.jurado_id}`, jurado);
        if (response.data.status) {
          MySwal.fire({
            title: 'Actualización exitosa',
            text: 'El jurado ha sido actualizado correctamente',
            icon: 'success',
          });
        } else {
          MySwal.fire({
            title: 'Error',
            text: response.data.message,
            icon: 'error',
          });
        }
      } else {
        // Add a new jurado
        const response = await axios.post('http://127.0.0.1:5000/jurados/agregar', jurado);
        if (response.data.status) {
          MySwal.fire({
            title: 'Registro exitoso',
            text: 'El jurado ha sido agregado correctamente',
            icon: 'success',
          });
        } else {
          MySwal.fire({
            title: 'Error',
            text: response.data.message,
            icon: 'error',
          });
        }
      }
      fetchData();
      onRequestClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      MySwal.fire({
        title: 'Error',
        text: 'Hubo un error al enviar el formulario',
        icon: 'error',
      });
    }
  };

  return (
    <ModalComponent isOpen={isOpen} onRequestClose={onRequestClose} title={isEditing ? 'Editar Jurado' : 'Agregar Jurado'}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap">
          <div className="w-1/2 px-2 mb-4">
            <label className="block text-sm font-medium leading-6 text-gray-900">Semestre</label>
            <SelectSemestre name="semestre_id" value={jurado.semestre_id} onChange={handleFormChange} className="select-input w-full" />
          </div>
          <div className="w-1/2 px-2 mb-4">
            <label className="block text-sm font-medium leading-6 text-gray-900">Nombre Completo</label>
            <input type="text" name="nombre_completo" value={jurado.nombre_completo} onChange={handleFormChange} className="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" required />
          </div>
          <div className="w-1/2 px-2 mb-4">
            <label className="block text-sm font-medium leading-6 text-gray-900">Email</label>
            <input type="email" name="email" value={jurado.email} onChange={handleFormChange} className="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" required />
          </div>
          <div className="w-1/2 px-2 mb-4">
            <label className="block text-sm font-medium leading-6 text-gray-900">N° Telefono</label>
            <input type="number" name="telefono" value={jurado.telefono} onChange={handleFormChange} className="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" required />
          </div>
          <div className="w-1/2 px-2 mb-4">
            <label className="block text-sm font-medium leading-6 text-gray-900">Escuela</label>
            <SelectEscuela name="escuela_id" value={jurado.escuela_id} onChange={handleFormChange} className="select-input w-full" />
          </div>
          <div className="w-1/2 px-2 mb-4">
            <label className="block text-sm font-medium leading-6 text-gray-900">Dedicación</label>
            <select name="dedicacion" value={jurado.dedicacion} onChange={handleFormChange} className="select-input block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" required>
              <option value="">Seleccionar Dedicación</option>
              <option value="TC">Tiempo Completo</option>
              <option value="TP">Medio Tiempo</option>
            </select>
          </div>
          <div className="w-1/2 px-2 mb-4">
            <label className="block text-sm font-medium leading-6 text-gray-900">Horas de Asesoría Semanal</label>
            <input type="number" name="hora_asesoria_semanal" value={jurado.hora_asesoria_semanal} onChange={handleFormChange} className="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" required />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button type="button" onClick={onRequestClose} className="mr-2 bg-gray-500 text-white px-3 py-1 rounded">Cancelar</button>
          <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">{isEditing ? 'Actualizar' : 'Registrar'}</button>
        </div>
      </form>
    </ModalComponent>
  );
};

export default ModalJurado;
