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
import { useData } from '../../contexts/DataContextProps ';

const MySwal = withReactContent(Swal);

const FormAsignacion: React.FC = () => {
  const { setAsignaciones } = useData();
  const [selectedFacultad, setSelectedFacultad] = useState<number | null>(null);
  const [selectedEscuela, setSelectedEscuela] = useState<number | null>(null);
  const [selectedCurso, setSelectedCurso] = useState<number | null>(null);
  const [selectedTipo, setSelectedTipo] = useState<string | null>(null); 
  const [facultades, setFacultades] = useState<DataFacultad[]>([]);
  const [escuelas, setEscuelas] = useState<DataEscuela[]>([]);
  const [cursos, setCursos] = useState<DataCurso[]>([]);
  const [semestre, setSemestre] = useState<DataSemestre | null>(null);

  const [tipoSustentacion, setTipoSustentacion] = useState<string>('');
  const [semanas, setSemanas] = useState<string>('');
  const [rangoFechas, setRangoFechas] = useState<string>('');
  const [duracion, setDuracion] = useState<number>(0);
  const [compensacion, setCompensacion] = useState<string>('');

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

  const fetchDatosSustentacion = async () => {
    if (selectedEscuela && selectedCurso && selectedTipo) {
      try {
        const response = await axiosInstance.get(`/semana/semana-sustentacion-filtrada?escuela_id=${selectedEscuela}&curso_id=${selectedCurso}&tipo_sustentacion=${selectedTipo}`);
        if (response.data && response.data.data) {
          const fechas = response.data.data.fecha_inicio + " - " + response.data.data.fecha_fin;
          setTipoSustentacion(response.data.data.tipo_sustentacion);
          setSemanas(response.data.data.semanas);
          setRangoFechas(fechas);
          setDuracion(response.data.data.duracion_sustentacion);
          setCompensacion(response.data.data.compensacion_docente);

          const datos = {
            escuela_id: selectedEscuela,
            curso_id: selectedCurso,
            tipo_sustentacion: response.data.data.tipo_sustentacion,
            rango_fechas: fechas,
            duracion_sustentacion: response.data.data.duracion_sustentacion,
            compensacion_docente: response.data.data.compensacion_docente
          };
          localStorage.setItem('datosSustentacion', JSON.stringify(datos));
        } else {
          MySwal.fire({
            title: 'Error',
            text: 'No hay datos disponibles para la combinación seleccionada',
            icon: 'error',
          });
        }
      } catch (error) {
        console.error('Error fetching datos de sustentacion:', error);
      }
    }
  };

  const handleFacultadChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const facultadId = Number(event.target.value);
    setSelectedFacultad(facultadId);
    setSelectedEscuela(null);
  };

  const handleEscuelaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const escuelaId = Number(event.target.value);
    setSelectedEscuela(escuelaId);
  };

  const handleCursoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const cursoId = Number(event.target.value);
    setSelectedCurso(cursoId);
  };

  const filteredEscuelas = selectedFacultad ? escuelas.filter(escuela => escuela.facultad_id === selectedFacultad) : escuelas;

  const mostrarSemestre = () => {
    if (semestre) {
      return semestre.nombre_semestres; // Ajusta el campo según tu estructura
    }
    return 'No hay semestre disponible';
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const endpoint = "sustentacion/obtener_asignación";  // Actualiza con tu endpoint real

    

    try {
      let data = {
        escuela_id: selectedEscuela,
        curso_id: selectedCurso,
        tipo_sustentacion: tipoSustentacion.toUpperCase(),
        rango_fechas: rangoFechas,
        duracion_sustentacion: duracion,
        compensacion_docente: compensacion.toUpperCase()
      }
      console.log('datos enviados', data)

      const response = await axiosInstance({
        method: 'POST',
        url: endpoint,
        data: data,
      });
    
      if (response.data) {
        console.log('respos', response.data.data)
        setAsignaciones(response.data.data);  // Asigna los datos a la variable de estado
        MySwal.fire({
          title: 'Éxito',
          text: 'Horario de sustentaciones generado con éxito',
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
        text: 'Error al generar horario sustentación. Inténtalo de nuevo más tarde.',
        icon: 'error',
      });
    }
  };

  return (
    <div className="flex flex-col w-2/3 mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden p-5">
      <div className='flex justify-between'>
        <h2 className="block font-medium text-lg leading-6 text-gray-900 mb-4 dark:text-gray-200">
          Asignación de sustentaciones
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
                    {cursos.map(curso => (
                      <option key={curso.curso_id} value={curso.curso_id}>
                        {curso.curso}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Tipo de sustentación</label>
                  <select
                    value={selectedTipo ?? ''}
                    onChange={(e) => setSelectedTipo(e.target.value)}
                    className="mt-2 block w-full p-2 border border-gray-300 rounded-md text-gray-700"
                  >
                    <option value="">Selecciona el tipo de sustentación</option>
                    {['PARCIAL', 'FINAL'].map(tipo => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={fetchDatosSustentacion}
                  className="flex justify-center float-end rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Filtrar
                </button>                
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <div className="bg-gray-100 dark:bg-slate-700 p-4 rounded-lg shadow-md">
          <h2 className="block font-medium text-lg leading-6 text-gray-900 mb-4 dark:text-gray-200">
            Datos de la semana de sustentaciones
          </h2>
          <div className="mb-2">
            <label htmlFor="tipo_sustentacion" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
              Tipo de sustentación
            </label>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{tipoSustentacion}</p>
          </div>
          <div className="mb-2">
            <label htmlFor="semanas" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
              Semanas
            </label>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{semanas}</p>
          </div>
          <div className="mb-2">
            <label htmlFor="rango_fechas" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
              Rango fechas
            </label>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{rangoFechas}</p>
          </div>
          <div className="mb-2">
            <label htmlFor="duracion" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
              Duración por sustentación (minutos)
            </label>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{duracion}</p>
          </div>
          <div className="mb-2">
            <label htmlFor="compensacion" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
              Se compensa esas horas a los profesores
            </label>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{compensacion}</p>
          </div>
        </div>
        <button
            type="submit"
            className="flex justify-center float-end rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Generar horario sustentaciones
        </button>
      </form>
    </div>
  );
}

export default FormAsignacion;
