import React, { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// Define un tipo genérico para tus datos
type DataItem = {
  semestre_id: number;
  nombre_semestres: string;
  fecha_fin: string;
  fecha_inicio: string;
  vigente: string;
};

interface TablaSemestreProps {
  setSelectedSemestre: React.Dispatch<React.SetStateAction<DataItem | null>>;
  records: DataItem[];
  fetchData: () => void;
}

const TablaSemestre: React.FC<TablaSemestreProps> = ({ setSelectedSemestre, records, fetchData }) => {
  const [data, setData] = useState<DataItem[]>([]);
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
        return row.nombre_semestres.toLowerCase().includes(query);
      });
      setData(newData);
    }
  };

  const handleEdit = (semestre: DataItem) => {
    setSelectedSemestre(semestre);
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
        // Lógica para eliminar el semestre con el ID proporcionado
        axios.delete('http://127.0.0.1:5000/semestres/eliminar-semestre', {
          headers: {
            'Content-Type': 'application/json',
          },
          data: JSON.stringify({ semestre_id: id })
        })
          .then(() => {
            MySwal.fire(
              'Eliminado!',
              'El semestre ha sido eliminado.',
              'success'
            );
            fetchData(); // Actualiza la tabla después de eliminar
          })
          .catch(error => {
            MySwal.fire(
              'Error!',
              'Hubo un problema al eliminar el semestre.',
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
      selector: (row: DataItem) => row.semestre_id,
      sortable: true,
      width: '70px',
    },
    {
      name: 'Nombre',
      selector: (row: DataItem) => row.nombre_semestres,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Fecha Inicio',
      selector: (row: DataItem) => row.fecha_inicio,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Fecha Fin',
      selector: (row: DataItem) => row.fecha_fin,
      sortable: true,
      width: '120px',
    },
    {
      name: 'Vigencia',
      selector: (row: DataItem) => row.vigente,
      sortable: true,
      width: '100px',
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
            onClick={() => handleDelete(row.semestre_id)}
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
    <div className='mt-5 flex flex-col w-1/2 mx-auto bg-white rounded-xl shadow-md overflow-hidden p-5'>
      <h1 className='font-medium'>Lista de Semestres</h1>
      <hr></hr>
      <div className='mt-3 w-100 flex'>
         <input
          name='buscar'
          onChange={handleFilter}
          className='block px-1.5 w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          placeholder='Ingresar nombre del semestre'
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

export default TablaSemestre;
