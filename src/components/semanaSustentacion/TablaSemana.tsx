import React, { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { DataItem } from '../../types/SemanaSustentacion';


const MySwal = withReactContent(Swal);


interface TablaSemanaSustentacionProps {
  setSelectedSemanaSustentacion: React.Dispatch<React.SetStateAction<DataItem | null>>;
  records: DataItem[];
  fetchData: () => void;
}

const TablaSemanaSustentacion: React.FC<TablaSemanaSustentacionProps> = ({ setSelectedSemanaSustentacion, records, fetchData }) => {
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
        return row.escuela_curso_id.curso.name.toLowerCase().includes(query);
      });
      setData(newData);
    }
  };

  const handleEdit = (semana_sustentacion: DataItem) => {
    setSelectedSemanaSustentacion(semana_sustentacion);
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
        // TODO: Lógica para eliminar el semana_sustentacion con el ID proporcionado
        axios.delete('http://127.0.0.1:5000/semana_sustentacions/eliminar-semana_sustentacion', {
          headers: {
            'Content-Type': 'application/json',
          },
          data: JSON.stringify({ semana_sustentacion_id: id })
        })
          .then(() => {
            MySwal.fire(
              'Eliminado!',
              'Se ha eliminado corectamente.',
              'success'
            );
            fetchData(); // Actualiza la tabla después de eliminar
          })
          .catch(error => {
            MySwal.fire(
              'Error!',
              'Hubo un problema al eliminar.',
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
      selector: (row: DataItem) => row.rango_fecha_sustentacion_id,
      sortable: true,
      width: '70px',
    },
    {
      name: 'Tipo',
      selector: (row: DataItem) => row.tipo_sustentacion.name,
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
      name: 'Duración',
      selector: (row: DataItem) => row.duracion_sustentacion,
      sortable: true,
      width: '100px',
    },
    {
        name: 'Compensasión',
        selector: (row: DataItem) => row.compensacion_docente.name,
        sortable: true,
        width: '100px',
      },
      {
        name: 'Curso',
        selector: (row: DataItem) => row.escuela_curso_id.curso.name,
        sortable: true,
        width: '100px',
      },
      {
        name: 'Escuela',
        selector: (row: DataItem) => row.escuela_curso_id.escuela.name,
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
            onClick={() => handleDelete(row.rango_fecha_sustentacion_id)}
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
    <div className="mt-5 mb-5 flex flex-col w-11/12 mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-5">
      <h1 className="font-medium text-gray-900 dark:text-gray-200">Lista de semanas de sustentaciones</h1>
      <hr className="border-gray-300 dark:border-gray-700" />
      <div className="mt-3 mb-3 w-100 flex">
        <input
          name="buscar"
          onChange={handleFilter}
          className="block px-1.5 w-1/2 rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-200 dark:bg-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Ingresar nombre del curso"
          type="search"
        />
      </div>
      {loading ? (
        <p className="text-gray-900 dark:text-gray-200">Cargando...</p>
      ) : (
        <DataTable
          className="text-gray-900 dark:text-gray-200"
          columns={columns}
          data={data}
          fixedHeader
          pagination
          paginationComponentOptions={paginationOptions}
          noDataComponent={<p className="text-gray-900 dark:text-gray-200">No hay registros para mostrar</p>}
          responsive
          fixedHeaderScrollHeight="400px"
        />
      )}
    </div>
  );
};

export default TablaSemanaSustentacion;
