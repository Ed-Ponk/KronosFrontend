import React, { useState, ChangeEvent, useEffect } from 'react';
import axiosInstance from '../../api/axiosConfig';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ModalComponent from '../modal';
import SelectSemestre from '../semestre/SelectSemestre';
import SelectEscuela from '../escuela/selectEscuela';
import SelectCurso from '../curso/SelectCurso';
import SelectGrupo from '../grupo/SelectGrupo';
import SelectJurado from '../jurado/SelectJurado';

const MySwal = withReactContent(Swal);

type EstudianteFormState = {
  estudiante_id?: number;
  codigo: string;
  nombre_completo: string;
  email: string;
  telefono: string;
  escuela_id: number | string;
  semestre_id: number | string;
  jurado_1_id?: number | string;
  jurado_2_id?: number | string;
  jurado_3_id?: number | string;
  titulo_tesis?: string;
  grupo_id?: number | string;
  curso_id?: number | string;
};

interface ModalEstudianteProps {
  isOpen: boolean;
  onRequestClose: () => void;
  initialData: EstudianteFormState;
  title: string;
  isEditing: boolean;
}

const ModalEstudiante: React.FC<ModalEstudianteProps> = ({ isOpen, onRequestClose, initialData, title, isEditing }) => {
  const [formData, setFormData] = useState<EstudianteFormState>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleFormChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateJurados = () => {
    const { jurado_1_id, jurado_2_id, jurado_3_id } = formData;
    return jurado_1_id !== jurado_2_id && jurado_1_id !== jurado_3_id && jurado_2_id !== jurado_3_id;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateJurados()) {
      MySwal.fire({
        title: 'Error',
        text: 'Los jurados seleccionados deben ser diferentes entre sí.',
        icon: 'error',
      });
      return;
    }

    try {
      if (isEditing) {
        const response = await axiosInstance.put(`/estudiantes/actualizar/${formData.estudiante_id}`, formData);
        if (response.data.status) {
          MySwal.fire({
            title: 'Actualización exitosa',
            text: 'El estudiante ha sido actualizado correctamente',
            icon: 'success',
          });
          window.location.reload();
        } else {
          MySwal.fire({
            title: 'Error',
            text: response.data.message,
            icon: 'error',
          });
        }
      } else {
        const response = await axiosInstance.post('/estudiantes/agregar', formData);
        if (response.data.status) {
          MySwal.fire({
            title: 'Registro exitoso',
            text: 'El estudiante ha sido agregado correctamente',
            icon: 'success',
          });
          window.location.reload();
        } else {
          MySwal.fire({
            title: 'Error',
            text: response.data.message,
            icon: 'error',
          });
        }
      }
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
    <ModalComponent isOpen={isOpen} onRequestClose={onRequestClose} title={title}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium leading-6 text-gray-900">Semestre</label>
            <SelectSemestre name="semestre_id" value={formData.semestre_id || ""} onChange={handleFormChange} className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium leading-6 text-gray-900">Codigo Universitario</label>
            <input type="text" name="codigo" value={formData.codigo || ""} onChange={handleFormChange} className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium leading-6 text-gray-900">Nombre Completo</label>
            <input type="text" name="nombre_completo" value={formData.nombre_completo || ""} onChange={handleFormChange} className="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium leading-6 text-gray-900">Email</label>
            <input type="email" name="email" value={formData.email || ""} onChange={handleFormChange} className="block w-full p-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium leading-6 text-gray-900">N° Telefono</label>
            <input type="number" name="telefono" value={formData.telefono || ""} onChange={handleFormChange} className="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium leading-6 text-gray-900">Escuela</label>
            <SelectEscuela name="escuela_id" value={formData.escuela_id || ""} onChange={handleFormChange} className="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium leading-6 text-gray-900">Curso</label>
            <SelectCurso name="curso_id" value={formData.curso_id || ""} escuelaId={formData.escuela_id || ""} onChange={handleFormChange} className="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium leading-6 text-gray-900">Grupo</label>
            <SelectGrupo name="grupo_id" value={formData.grupo_id || ""} escuelaId={formData.escuela_id || ""} cursoId={formData.curso_id || ""} semestreId={formData.semestre_id || ""} onChange={handleFormChange} className="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium leading-6 text-gray-900">Jurado 1</label>
            <SelectJurado name="jurado_1_id" value={formData.jurado_1_id || ""} escuelaId={formData.escuela_id || ""} semestreId={formData.semestre_id || ""} onChange={handleFormChange} className="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium leading-6 text-gray-900">Jurado 2</label>
            <SelectJurado name="jurado_2_id" value={formData.jurado_2_id || ""} escuelaId={formData.escuela_id || ""} semestreId={formData.semestre_id || ""} onChange={handleFormChange} className="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium leading-6 text-gray-900">Jurado 3</label>
            <SelectJurado name="jurado_3_id" value={formData.jurado_3_id || ""} escuelaId={formData.escuela_id || ""} semestreId={formData.semestre_id || ""} onChange={handleFormChange} className="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium leading-6 text-gray-900">Titulo de Tesis</label>
            <input type="text" name="titulo_tesis" value={formData.titulo_tesis || ""} onChange={handleFormChange} className="block p-2 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6" required />
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

export default ModalEstudiante;
