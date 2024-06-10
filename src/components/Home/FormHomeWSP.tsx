import React, { useState, useEffect } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/solid';
import axiosInstance from '../../api/axiosConfig';
import { DataFacultad } from '../../types/Facultad';
import { DataEscuela } from '../../types/Escuela';
import { DataCurso } from '../../types/Curso';
import { DataSemestre } from '../../types/Semestre';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const FormHomeWSP: React.FC = () => {
  const [selectedFacultad, setSelectedFacultad] = useState<number | null>(null);
  const [selectedEscuela, setSelectedEscuela] = useState<number | null>(null);
  const [selectedCurso, setSelectedCurso] = useState<number | null>(null); 
  const [facultades, setFacultades] = useState<DataFacultad[]>([]);
  const [escuelas, setEscuelas] = useState<DataEscuela[]>([]);
  const [cursos, setCursos] = useState<DataCurso[]>([]); 
  const [semestre, setSemestre] = useState<DataSemestre | null>(null); 
  const [phoneNumbers, setPhoneNumbers] = useState<{ number: string; type: string }[]>([]);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [newPhoneType, setNewPhoneType] = useState('');

  useEffect(() => {
    const fetchSemestre = async () => {
      try {
        const response = await axiosInstance.get('/semestres/semestre-vigente');
        if (response.data.status) {
          setSemestre(response.data.data);
        } else {
          setSemestre(null); 
        }
      } catch (error) {
        console.error('Error fetching semestre data:', error);
        setSemestre(null); 
      }
    };

    const fetchFacultades = async () => {
      try {
        const response = await axiosInstance.get('/facultad');
        if (response.data && response.data.data) {
          setFacultades(response.data.data);
        } else {
          setFacultades([]); 
        }
      } catch (error) {
        console.error('Error fetching facultades:', error);
        setFacultades([]); 
      }
    };

    const fetchEscuelas = async () => {
      try {
        const response = await axiosInstance.get('/escuela');
        console.log(response)
        if (response.data && response.data.data) {
          setEscuelas(response.data.data);
        } else {
          setEscuelas([]); 
        }
      } catch (error) {
        console.error('Error fetching escuelas:', error);
        setEscuelas([]); 
      }
    };

    const fetchCursos = async () => {
      try {
        const response = await axiosInstance.get('/curso');
        if (response.data && response.data.data) {
          setCursos(response.data.data);
        } else {
          setCursos([]); 
        }
      } catch (error) {
        console.error('Error fetching cursos:', error);
        setCursos([]); 
      }
    };

    fetchSemestre();
    fetchFacultades();
    fetchEscuelas();
    fetchCursos(); 
  }, []);

  const handleFacultadChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const facultadId = Number(event.target.value);
    setSelectedFacultad(facultadId);
    setSelectedEscuela(null);
    setSelectedCurso(null); 
  };

  const handleEscuelaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const escuelaId = Number(event.target.value);
    setSelectedEscuela(escuelaId);
    setSelectedCurso(null); 
  };

  const handleCursoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const cursoId = Number(event.target.value);
    setSelectedCurso(cursoId);
  };

  const handleAddPhoneNumber = () => {
    if (newPhoneNumber && newPhoneType) {
      const formattedNumber = newPhoneNumber.replace(/\s+/g, ''); // Remove spaces
      setPhoneNumbers([...phoneNumbers, { number: formattedNumber, type: newPhoneType }]);
      setNewPhoneNumber('');
      setNewPhoneType('');
    }else {
      // Mostrar un mensaje de error si el tipo de teléfono no está seleccionado
      MySwal.fire({
        title: 'Error',
        text: 'Por favor, selecciona un tipo de persona antes de agregarlo.',
        icon: 'error',
      });
    }
  };

  const handleWhatsappNotify = async () => {
    try {
      console.log(phoneNumbers);
      const response = await axiosInstance.post('/home/enviar-notificacion-prueba', { contactos: phoneNumbers ,withCredentials: true});
      if (response.data.status) {
        MySwal.fire({
          title: 'Éxito',
          text: 'Notificaciones enviadas con éxito.',
          icon: 'success',
        });
      } else {
        MySwal.fire({
          title: 'Error',
          text: response.data.message,
          icon: 'error',
        });
      }
    } catch (error) {
      MySwal.fire({
        title: 'Error',
        text: 'Error al enviar las notificaciones. Inténtalo de nuevo más tarde.',
        icon: 'error',
      });
    }
  };

  const filteredEscuelas = selectedFacultad ? escuelas.filter(escuela => escuela.facultad_id === selectedFacultad) : [];
  const filteredCursos = selectedEscuela ? cursos.filter(curso => curso.escuela_id === selectedEscuela) : [];

  const mostrarSemestre = () => {
    if (semestre) {
      return semestre.nombre_semestres; 
    }
    return 'No hay semestre disponible';
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedCurso) {
      MySwal.fire({
        title: 'Error',
        text: 'Por favor, selecciona un curso antes de continuar.',
        icon: 'error',
      });
      return;
    }

    const endpoint = "/home/enviar-notificacion";

    try {
      const response = await axiosInstance({
        method: 'POST',
        url: endpoint,
        data: {
          curso_id: selectedCurso,
        },
      });
      if (response.data.status) {
        MySwal.fire({
          title: 'Éxito',
          text: 'Notificaciones enviadas con éxito.',
          icon: 'success',
        });
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
        text: 'Error al enviar las notificaciones. Inténtalo de nuevo más tarde.',
        icon: 'error',
      });
    }
  };

  return (
    <div className="flex flex-col w-4/5 mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden p-5">
      <div className='flex justify-between'>
        <h2 className="block font-medium text-lg leading-6 text-gray-900 mb-4 dark:text-gray-200">
          Notificar estudiantes, docentes y jurados
        </h2>

        <p className='block font-medium text-base leading-6 text-gray-900 mb-4 dark:text-gray-200'>{mostrarSemestre()}</p>
      </div>
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-900 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75 ">
                <span>Filtros</span>
                {open ? (
                  <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                )}
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Selecciona una facultad</label>
                  <select
                    value={selectedFacultad ?? ''}
                    onChange={handleFacultadChange}
                    className="mt-2 block w-full p-2 border border-gray-300 rounded-md text-gray-700"
                  >
                    <option value="">Selecciona una facultad</option>
                    {facultades.map(facultad => (
                      <option key={facultad.facultad_id} value={facultad.facultad_id}>
                        {facultad.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Selecciona una escuela</label>
                  <select
                    value={selectedEscuela ?? ''}
                    onChange={handleEscuelaChange}
                    className="mt-2 block w-full p-2 border border-gray-300 rounded-md text-gray-700"
                  >
                    <option value="">Selecciona una escuela</option>
                    {filteredEscuelas.map(escuela => (
                      <option key={escuela.escuela_id} value={escuela.escuela_id}>
                        {escuela.escuela}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Curso</label>
                  <select
                    value={selectedCurso ?? ''}
                    onChange={handleCursoChange}
                    className="mt-2 block w-full p-2 border border-gray-300 rounded-md text-gray-700"
                  >
                    <option value="">Selecciona un curso</option>
                    {filteredCursos.map(curso => (
                      <option key={curso.curso_id} value={curso.curso_id}>
                        {curso.curso}
                      </option>
                    ))}
                  </select>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <button
          type="submit"
          className="flex justify-center float-end rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          Notificar por Whatsapp
        </button>
      </form>

      <div className="mt-6">
        <h3 className="block font-medium text-lg leading-6 text-gray-900 mb-4 dark:text-gray-200">
          Agregar Número de Teléfono
        </h3>
        <div className="flex space-x-4 mb-4">
          <input
            type="text"
            placeholder="Número de Teléfono"
            value={newPhoneNumber}
            onChange={(e) => setNewPhoneNumber(e.target.value)}
            className="p-2 border border-gray-300 rounded-md text-gray-700"
          />
          <select
            value={newPhoneType}
            onChange={(e) => setNewPhoneType(e.target.value)}
            className="p-2 border border-gray-300 rounded-md text-gray-700"
          >
            <option value="">Tipo</option>
            <option value="Estudiante">Estudiante</option>
            <option value="Docente">Docente</option>
            <option value="Jurado">Jurado</option>
          </select>
          <button
            onClick={handleAddPhoneNumber}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Agregar
          </button>
        </div>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Número de Teléfono
              </th>
              <th scope="col" className="px-6 py-3">
                Tipo
              </th>
            </tr>
          </thead>
          <tbody>
            {phoneNumbers.map((phone, index) => (
              <tr key={index} className="bg-white dark:bg-gray-800">
                <td className="px-6 py-4">{phone.number}</td>
                <td className="px-6 py-4">{phone.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={handleWhatsappNotify}
          className="p-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
         Prueba Whatsapp Notificar
        </button>
      </div>
    </div>
  );
}

export default FormHomeWSP;
