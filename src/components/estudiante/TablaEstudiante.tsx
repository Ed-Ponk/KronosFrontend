import React, { useState, useEffect, ChangeEvent } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import axiosInstance from '../../api/axiosConfig';
import SelectSemestre from '../semestre/SelectSemestre';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/solid';
import { Estudiante } from '../../types/Estudiante';
import { DataFacultad } from '../../types/Facultad';
import { DataEscuela } from '../../types/Escuela';
import { DataCurso } from '../../types/Curso'; // Importa el tipo de Curso

const MySwal = withReactContent(Swal);

const TablaEstudiante: React.FC = () => {
  const [data, setData] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [records, setRecords] = useState<Estudiante[]>([]);
  const [selectedSemestre, setSelectedSemestre] = useState<number | null>(null);
  const [selectedFacultad, setSelectedFacultad] = useState<number | null>(null);
  const [selectedEscuela, setSelectedEscuela] = useState<number | null>(null);
  const [selectedCurso, setSelectedCurso] = useState<number | null>(null); // Cambia a number
  const [facultades, setFacultades] = useState<DataFacultad[]>([]);
  const [escuelas, setEscuelas] = useState<DataEscuela[]>([]);
  const [cursos, setCursos] = useState<DataCurso[]>([]); // Estado para los cursos
  const [showTable, setShowTable] = useState<boolean>(false);

  const fetchFacultades = async () => {
    try {
      const response = await axiosInstance.get('/facultad');
      setFacultades(response.data.data);
    } catch (error) {
      console.error('Error fetching facultades:', error);
    }
  };

  const fetchEscuelas = async () => {
    try {
      const response = await axiosInstance.get('/escuela');
      setEscuelas(response.data.data);
    } catch (error) {
      console.error('Error fetching escuelas:', error);
    }
  };

  const fetchCursos = async () => {
    try {
      const response = await axiosInstance.get('/curso');
      setCursos(response.data.data);
    } catch (error) {
      console.error('Error fetching cursos:', error);
    }
  };

  useEffect(() => {
    fetchFacultades();
    fetchEscuelas();
    fetchCursos(); // Llamar a la función para obtener los cursos
  }, []);

  const fetchData = async (semestreId: number, escuelaId: number | null, cursoId: number | null) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/estudiantes/obtener-estudiantes-semestre', {
        semestre_id: semestreId,
        escuela_id: escuelaId,
        curso_id: cursoId,
      });

      if (!response.data.status || !response.data) {
        MySwal.fire({
          title: 'Sin registros',
          text: 'No hay datos para los filtros seleccionados',
          icon: 'info',
        });
        setShowTable(false);
      } else {
        const data = response.data.data;
        setData(data.data);
        setRecords(data.data);
        setShowTable(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      MySwal.fire({
        title: 'Error',
        text: 'Hubo un error al obtener los datos',
        icon: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLocaleLowerCase();
    if (query === '') {
      setRecords(data);
    } else {
      const newData = data.filter(row => row.nombre_completo.toLocaleLowerCase().includes(query));
      setRecords(newData);
    }
  };

  const handleBuscar = () => {
    if (selectedSemestre !== null) {
      fetchData(selectedSemestre, selectedEscuela, selectedCurso);
    }
  };

  const handleSemestreChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const semestreId = parseInt(event.target.value);
    setSelectedSemestre(semestreId);
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

  const paginationOptions = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
  };

  const columns: TableColumn<Estudiante>[] = [
    {
      name: 'Código',
      selector: (row: Estudiante) => row.codigo,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Nombre Completo',
      selector: (row: Estudiante) => row.nombre_completo,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Email',
      selector: (row: Estudiante) => row.email,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Teléfono',
      selector: (row: Estudiante) => row.telefono,
      sortable: true,
      width: '120px',
    },
    {
      name: 'Jurado 1',
      selector: (row: Estudiante) => row.jurado1 ?? 'Sin asignar',
      sortable: true,
      wrap: true,
    },
    {
      name: 'Jurado 2',
      selector: (row: Estudiante) => row.jurado2 ?? 'Sin asignar',
      sortable: true,
      wrap: true,
    },
    {
      name: 'Jurado 3',
      selector: (row: Estudiante) => row.jurado3,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Tesis',
      selector: (row: Estudiante) => row.tesis,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Grupo',
      selector: (row: Estudiante) => row.grupo,
      sortable: true,
      wrap: true,
    },
  ];

  return (
    <div className='mt-5 flex flex-col w-full mx-auto bg-white rounded-xl shadow-md overflow-hidden p-5'>
      <h1 className='font-medium'>Lista de Estudiantes</h1>
      <hr />
      <div className="sm:col-span-3 mt-2">
        <label className="block text-sm font-medium leading-6 text-gray-900">Semestres</label>
        <div className='flex'>
          <div className="mt-2 w-1/2">
            <SelectSemestre onChange={handleSemestreChange} />
          </div>
          <div className="mt-2 w-1/2 flex justify-end">
            <button
              name='filtrarEstudiante'
              className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              type="button"
              onClick={handleBuscar}
            >
              Buscar
            </button>
          </div>
        </div>
      </div>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-900 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
              <span>Filtros</span>
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
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Selecciona una escuela</label>
                <select
                  value={selectedEscuela ?? ''}
                  onChange={handleEscuelaChange}
                  className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
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
                <label className="block text-sm font-medium text-gray-700">Curso</label>
                <select
                  value={selectedCurso ?? ''}
                  onChange={handleCursoChange}
                  className="mt-2 block w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="">Selecciona un curso</option>
                  {cursos.map(curso => (
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
      {showTable && (
        <>
          <div className='w-100 mt-5 flex '>
            <input
              name='buscar'
              onChange={handleFilter}
              className='block px-1.5 w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              placeholder='Ingresar nombre del estudiante'
              type='search'
            />
          </div>
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <DataTable
              className='text-color-black'
              columns={columns}
              data={records}
              fixedHeader
              pagination
              paginationComponentOptions={paginationOptions}
              noDataComponent={<div className='mt-2'>No hay registros para mostrar</div>}
              responsive
              fixedHeaderScrollHeight="400px"
            />
          )}
        </>
      )}
    </div>
  );
};

export default TablaEstudiante;
