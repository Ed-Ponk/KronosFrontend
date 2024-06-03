import React, { useState, useEffect } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/solid';
import axiosInstance from '../../api/axiosConfig';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { DataCurso } from '../../types/Curso';
import { DataEscuela } from '../../types/Escuela';
import { DataFacultad } from '../../types/Facultad';

const MySwal = withReactContent(Swal);

const FormCursoEscuela: React.FC = () => {
  const [cursos, setCursos] = useState<DataCurso[]>([]);
  const [escuelas, setEscuelas] = useState<DataEscuela[]>([]);
  const [facultades, setFacultades] = useState<DataFacultad[]>([]);
  const [selectedFacultad, setSelectedFacultad] = useState<number | null>(null);
  const [selectedCursos, setSelectedCursos] = useState<Set<number>>(new Set());
  const [selectedEscuelas, setSelectedEscuelas] = useState<Set<number>>(new Set());
  const [allCursosChecked, setAllCursosChecked] = useState<boolean>(false);
  const [allEscuelasChecked, setAllEscuelasChecked] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cursosResponse = await axiosInstance.get('/curso/cursos-activos');
        setCursos(cursosResponse.data.data);

        const escuelasResponse = await axiosInstance.get('/escuela');
        setEscuelas(escuelasResponse.data.data);

        const facultadesResponse = await axiosInstance.get('/facultad');
        setFacultades(facultadesResponse.data.data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (allCursosChecked) {
      setSelectedCursos(new Set(cursos.map(curso => curso.curso_id)));
    } else {
      setSelectedCursos(new Set());
    }
  }, [allCursosChecked, cursos]);

  useEffect(() => {
    const relatedEscuelas = selectedFacultad
      ? escuelas.filter(escuela => escuela.facultad_id === selectedFacultad)
      : escuelas;
    if (allEscuelasChecked) {
      setSelectedEscuelas(new Set(relatedEscuelas.map(escuela => escuela.escuela_id)));
    } else {
      setSelectedEscuelas(new Set());
    }
  }, [allEscuelasChecked, escuelas, selectedFacultad]);


  const handleFacultadChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFacultad(Number(event.target.value));
    setAllEscuelasChecked(false);
    setSelectedEscuelas(new Set());
  };

  const handleCursoCheckboxChange = (cursoId: number) => {
    setSelectedCursos(prevState => {
      const newState = new Set(prevState);
      if (newState.has(cursoId)) {
        newState.delete(cursoId);
      } else {
        newState.add(cursoId);
      }
      return newState;
    });
  };

  const handleEscuelaCheckboxChange = (escuelaId: number) => {
    setSelectedEscuelas(prevState => {
      const newState = new Set(prevState);
      if (newState.has(escuelaId)) {
        newState.delete(escuelaId);
      } else {
        newState.add(escuelaId);
      }
      return newState;
    });
  };


  const filteredEscuelas = selectedFacultad
    ? escuelas.filter(escuela => escuela.facultad_id === selectedFacultad)
    : escuelas;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axiosInstance.post('/curso/registrar-escuela-curso', {
        curso_id: Array.from(selectedCursos),
        escuela_id: Array.from(selectedEscuelas)
      });
      
      if (response.data.status) {
        MySwal.fire({
          title: 'Éxito',
          text: 'Relación creada con éxito',
          icon: 'success',
        });
        // Opcional: resetear los estados después de guardar
        setSelectedFacultad(null);
        setSelectedCursos(new Set());
        setSelectedEscuelas(new Set());
        setAllCursosChecked(false);
        setAllEscuelasChecked(false);
      } else {
        MySwal.fire({
          title: 'Error',
          text: response.data.message,
          icon: 'error',
        });
      }
    } catch (error) {
      console.error('Error creando la relación:', error);
      MySwal.fire({
        title: 'Error',
        text: 'Error al crear la relación. Inténtalo de nuevo más tarde.',
        icon: 'error',
      });
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h1 className="text-xl font-semibold mb-4">Relacionar Cursos con Escuelas y Grupos</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-900 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                    <span>Cursos</span>
                    {open ? (
                      <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                    )}
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                    <label className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={allCursosChecked}
                        onChange={() => setAllCursosChecked(!allCursosChecked)}
                        className="mr-2"
                      />
                      Seleccionar todos los cursos
                    </label>
                    <ul className="max-h-64 overflow-y-auto border border-gray-300 rounded-md p-2">
                      {cursos.map(curso => (
                        <li key={curso.curso_id} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            checked={selectedCursos.has(curso.curso_id)}
                            onChange={() => handleCursoCheckboxChange(curso.curso_id)}
                            className="mr-2"
                          />
                          {curso.curso}
                        </li>
                      ))}
                    </ul>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
          <div>
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-900 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                    <span>Escuelas</span>
                    {open ? (
                      <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                    )}
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700">Selecciona una facultad</label>
                      <select
                        value={selectedFacultad ?? ''}
                        onChange={handleFacultadChange}
                        className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Selecciona una facultad</option>
                        {facultades.map(facultad => (
                          <option key={facultad.facultad_id} value={facultad.facultad_id}>
                            {facultad.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <label className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        checked={allEscuelasChecked}
                        onChange={() => setAllEscuelasChecked(!allEscuelasChecked)}
                        className="mr-2"
                      />
                      Seleccionar todas las escuelas relacionadas
                    </label>
                    <ul className="max-h-64 overflow-y-auto border border-gray-300 rounded-md p-2">
                      {filteredEscuelas.map(escuela => (
                        <li key={escuela.escuela_id} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            checked={selectedEscuelas.has(escuela.escuela_id)}
                            onChange={() => handleEscuelaCheckboxChange(escuela.escuela_id)}
                            className="mr-2"
                          />
                          {escuela.escuela}
                        </li>
                      ))}
                    </ul>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Guardar Relación
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormCursoEscuela;
