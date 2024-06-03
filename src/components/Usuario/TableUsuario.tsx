import React, { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

type DataItem = {
  usuario_id: number;
  email: string;
  clave: string;
  estado: string;
  jurado_id: string;
  rol: string;
};

interface TableUsuarioProps {
  setSelectedUsuario: React.Dispatch<React.SetStateAction<DataItem | null>>;
  records: DataItem[];
  fetchData: () => void;
}

const TableUsuario: React.FC<TableUsuarioProps> = ({ setSelectedUsuario, records, fetchData }) => {
  const [data, setData] = useState<DataItem[]>(records);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setData(records);
    setLoading(false); // Cambia el estado de carga a falso
  }, [records]);

  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLocaleLowerCase();
    if (query === '') {
      setData(records); // Restablece los datos completos si el input está vacío
    } else {
      const newData = records.filter(row => {
        return row.email.toLocaleLowerCase().includes(query);
      });
      setData(newData);
    }
  };

  const handleEdit = (usuario: DataItem) => {
    setSelectedUsuario(usuario);
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
        // Lógica para eliminar el usuario con el ID proporcionado
        axios.delete('http://127.0.0.1:5000/usuarios/eliminar-usuario', {
          headers: {
            'Content-Type': 'application/json',
          },
          data: JSON.stringify({ usuario_id: id })
        })
          .then(() => {
            MySwal.fire(
              'Eliminado!',
              'El usuario ha sido eliminado.',
              'success'
            );
            fetchData(); // Actualiza la tabla después de eliminar
          })
          .catch(error => {
            MySwal.fire(
              'Error!',
              'Hubo un problema al eliminar el usuario.',
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

  const columns: TableColumn<DataItem>[] = [
    {
      name: 'ID',
      selector: (row: DataItem) => row.usuario_id,
      sortable: true,
      width: '70px',
    },
    {
      name: 'Email',
      selector: (row: DataItem) => row.email,
      sortable: true,
      wrap: true,
      width: '160px',
    },
    {
      name: 'Clave',
      selector: (row: DataItem) => row.clave,
      sortable: true,
      wrap: true,
      width: '150px',
    },
    {
      name: 'Estado',
      selector: (row: DataItem) => row.estado,
      sortable: true,
      width: '100px',
    },
    {
      name: 'Jurado ID',
      selector: (row: DataItem) => row.jurado_id,
      sortable: true,
      
    },
    {
      name: 'Rol',
      selector: (row: DataItem) => row.rol,
      sortable: true,
      width: '150px',
    },
    {
      name: 'Acciones',
      cell: (row: DataItem) => (
        <div>
          <button
            className="text-blue-600 hover:text-blue-900 mr-2"
            onClick={() => handleEdit(row)}
          >
            Editar
          </button>
          <button
            className="text-red-600 hover:text-red-900"
            onClick={() => handleDelete(row.usuario_id)}
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
    <div className='mt-5 mb-5 flex flex-col w-3/4 mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden p-5'>
      <h1 className='font-medium text-gray-900 dark:text-gray-200'>Lista de Usuarios</h1>
      <hr className='border-gray-300 dark:border-gray-700' />
      <div className='mt-3 w-full flex'>
        <input
          name='buscar'
          onChange={handleFilter}
          className='block px-1.5 w-1/2 mb-2 rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          placeholder='Ingresar email del usuario'
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
        />
      )}
    </div>
  );
};

export default TableUsuario;
