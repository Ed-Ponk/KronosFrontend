import React, { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axiosInstance from '../../api/axiosConfig';
import { DataEscuela, TablaEscuelaProps } from '../../types/Escuela';

const MySwal = withReactContent(Swal);

const TablaEscuela: React.FC<TablaEscuelaProps> = ({ setSelectedEscuela, records, fetchData }) => {
  const [data, setData] = useState<DataEscuela[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setData(records || []); 
    setLoading(false); 
  }, [records]);

  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    if (query === '') {
      setData(records); 
    } else {
      const newData = records.filter(row => {
        return row.escuela.toLowerCase().includes(query);
      });
      setData(newData);
    }
  };

  const handleEdit = (escuela: DataEscuela) => {
    setSelectedEscuela(escuela);
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
        // Lógica para eliminar la escuela con el ID proporcionado
        axiosInstance.delete('/escuela/eliminar-escuela', {
          data: { escuela_id: id }
        })
        .then( response => {
          console.log(response.data)
          if(response.data.status){
            MySwal.fire(
              'Eliminado!',
              'La escuela ha sido eliminada.',
              'success'
            );
            fetchData();
          }else{
            MySwal.fire(
              'Error!',
              response.data.message,
              'error'
            );
          }
        })
        .catch(error => {
          MySwal.fire(
            'Error!',
            'Hubo un problema al eliminar la escuela.',
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

  const columns: TableColumn<DataEscuela>[] = [
    {
      name: 'ID',
      selector: (row: DataEscuela) => row.escuela_id,
      sortable: true,
      width: '70px',
    },
    {
      name: 'Escuela',
      selector: (row: DataEscuela) => row.escuela,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Facultad',
      selector: (row: DataEscuela) => row.facultad,
      sortable: true,
      width: '120px',
    },
    {
      name: 'Acciones',
      cell: (row: DataEscuela) => (
        <div>
          <button
            className="text-blue-600 hover:text-blue-900 mr-2"
            onClick={() => handleEdit(row)}
          >
            Editar
          </button>
          <button
            className="text-red-600 hover:text-red-900"
            onClick={() => handleDelete(row.escuela_id)}
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
    <div className='mt-5 flex flex-col w-4/5 mx-auto bg-white rounded-xl shadow-md overflow-hidden p-5'>
      <h1 className='font-medium'>Lista de Escuelas</h1>
      <hr></hr>
      <div className='mt-3 w-100 flex'>
         <input
          name='buscar'
          onChange={handleFilter}
          className='block px-1.5 w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          placeholder='Ingresar nombre de la escuela'
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

export default TablaEscuela;