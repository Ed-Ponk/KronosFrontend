import React, { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { DataFacultad, TablaFacultadProps } from '../../types/Facultad';
import axiosInstance from '../../api/axiosConfig';

const MySwal = withReactContent(Swal);

const TablaFacultad: React.FC<TablaFacultadProps> = ({ setSelectedFacultad, records, fetchData }) => {
  const [data, setData] = useState<DataFacultad[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
        return row.nombre.toLowerCase().includes(query);
      });
      setData(newData);
    }
  };

  const handleEdit = (facultad: DataFacultad) => {
    setSelectedFacultad(facultad);
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
        axiosInstance.delete('/facultad/eliminar-facultad', {
          data: JSON.stringify({ facultad_id: id })
        })
          .then(response => {
            if (response.data.status) {
              MySwal.fire(
                'Eliminado!',
                response.data.message,
                'success'
              );
              fetchData();
            } else {
              MySwal.fire(
                'Error!',
                response.data.message,
                'error'
              );
            }
          })
          .catch(() => {
            MySwal.fire(
              'Error!',
              'Hubo un problema al eliminar la facultad.',
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

  const columns: TableColumn<DataFacultad>[] = [
    {
      name: 'ID',
      selector: (row: DataFacultad) => row.facultad_id,
      sortable: true,
      width: '70px',
    },
    {
      name: 'Nombre',
      selector: (row: DataFacultad) => row.nombre,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Acciones',
      cell: (row: DataFacultad) => (
        <div>
          <button
            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-700 mr-2"
            onClick={() => handleEdit(row)}
          >
            Editar
          </button>
          <button
            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-700"
            onClick={() => handleDelete(row.facultad_id)}
          >
            Eliminar
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
  ];

  return (
    <div className='mt-5 flex flex-col w-4/5 mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden p-5'>
      <h1 className='font-medium text-gray-900 dark:text-gray-200'>Lista de Facultades</h1>
      <hr className='border-gray-300 dark:border-gray-700' />
      <div className='my-3 w-100 flex'>
         <input
          name='buscar'
          onChange={handleFilter}
          className='block px-1.5 w-1/2 rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-200 dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          placeholder='Ingresar nombre de la facultad'
          type='search'
        />
      </div>
      {loading ? (
        <p className='text-gray-900 dark:text-gray-200'>Cargando...</p>
      ) : (
        <DataTable
          className='text-gray-900 dark:text-gray-200'
          columns={columns}
          data={data}
          fixedHeader
          pagination
          paginationComponentOptions={paginationOptions}
          noDataComponent={<p className='text-gray-900 dark:text-gray-200'>No hay registros para mostrar</p>}
          responsive
          fixedHeaderScrollHeight="400px"
          customStyles={{
            headCells: {
              style: {
                backgroundColor: 'var(--color-bg-head)',
                color: 'var(--color-text-head)',
              },
            },
            cells: {
              style: {
                backgroundColor: 'var(--color-bg-cell)',
                color: 'var(--color-text-cell)',
              },
            },
            rows: {
              style: {
                '&:nth-child(even)': {
                  backgroundColor: 'var(--color-bg-row)',
                },
              },
            },
            pagination: {
              style: {
                backgroundColor: 'var(--color-bg-pagination)',
                color: 'var(--color-text-pagination)',
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default TablaFacultad;
