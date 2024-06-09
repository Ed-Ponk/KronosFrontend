import React, { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axiosInstance from '../../api/axiosConfig';
import { DataCursoEscuela, TablaCursoEscuelaProps } from '../../types/CursoEscuela';

const MySwal = withReactContent(Swal);

const TablaCursoEscuela: React.FC<TablaCursoEscuelaProps> = ({ setSelectedCursoEscuela, records, fetchData }) => {
  const [data, setData] = useState<DataCursoEscuela[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [escuelas, setEscuelas] = useState<{ escuela_id: number, escuela: string }[]>([]);
  const [selectedEscuela, setSelectedEscuela] = useState<number | null>(null);

  useEffect(() => {
    const uniqueEscuelas = Array.from(new Set(records.map(record => ({
      escuela_id: record.escuela_id,
      escuela: record.escuela,
    }))));

    setEscuelas(uniqueEscuelas);
  }, [records]);

  useEffect(() => {
    setData(records || []); // Asegúrate de que records no sea null o undefined
    setLoading(false); // Cambia el estado de carga a falso
  }, [records]);

  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    if (query === '') {
      setData(records); // Restablece los datos completos si el input está vacío
    } else {
      const newData = records.filter(row => {
        return row.curso.toLowerCase().includes(query) || row.escuela.toLowerCase().includes(query);
      });
      setData(newData);
    }
  };

  const handleEscuelaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const escuelaId = Number(event.target.value);
    setSelectedEscuela(escuelaId);
    if (escuelaId === 0) {
      setData(records); // Show all records if "all" is selected
    } else {
      const filteredData = records.filter(record => record.escuela_id === escuelaId);
      setData(filteredData);
    }
  };

  

  const handleDelete = (id: number) => {
    MySwal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        axiosInstance.delete('/curso/eliminar-curso-escuela', {
          data: { escuela_curso_id: id }
        })
          .then(() => {
            MySwal.fire(
              'Eliminado!',
              'La relación ha sido eliminada.',
              'success'
            );
            fetchData();
          })
          .catch(error => {
            MySwal.fire(
              'Error!',
              'Hubo un problema al eliminar la relación.',
              'error'
            );
          });
      }
    });
  };

  const paginationOptions = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
  };

  const columns: TableColumn<DataCursoEscuela>[] = [
    {
      name: 'ID',
      selector: (row: DataCursoEscuela) => row.id,
      sortable: true,
      width: '70px',
    },
    {
      name: 'Curso',
      selector: (row: DataCursoEscuela) => row.curso,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Escuela',
      selector: (row: DataCursoEscuela) => row.escuela,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Acciones',
      cell: (row: DataCursoEscuela) => (
        <div>
          <button
            className="text-red-600 hover:text-red-900"
            onClick={() => handleDelete(row.id)}
          >
            Eliminar
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true as any, // Convertimos el booleano a cadena
    }
  ];

  return (
    <div className='mt-5 flex flex-col mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-5'>
      <h1 className='font-medium text-gray-900 dark:text-gray-200'>Lista de Relaciones Curso-Escuela</h1>
      <hr className="border-gray-300 dark:border-gray-700" />
      <div className='mt-3 mb-3 w-150 flex'>
        <input
          name='buscar'
          onChange={handleFilter}
          className='block px-1.5 w-1/2 rounded-md border-0 py-1.5 text-gray-900 dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          placeholder='Ingresar nombre del curso o escuela'
          type='search'
        />
      </div>
      
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <DataTable
          className='text-color-black'
          columns={columns}
          data={data}
          fixedHeader
          pagination
          paginationComponentOptions={paginationOptions}
          noDataComponent={<p>No hay registros para mostrar</p>}
          responsive
          fixedHeaderScrollHeight="400px"
        />
      )}
    </div>
  );
};

export default TablaCursoEscuela;
