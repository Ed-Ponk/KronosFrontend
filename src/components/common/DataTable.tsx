import React, { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

interface TablaGenericaProps<T> {
  records: T[];
  columns: TableColumn<T>[];
  setSelectedRecord?: (record: T) => void;
  fetchData?: () => void;
  filterKey: keyof T;
}

const TablaGenerica = <T extends object>({ records, columns, setSelectedRecord, fetchData, filterKey }: TablaGenericaProps<T>) => {
  const [data, setData] = useState<T[]>([]);
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
        return (row[filterKey].name as unknown as string).toLowerCase().includes(query);
      });
      setData(newData);
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
        // Aquí puedes agregar la lógica de eliminación específica
        fetchData && fetchData();
        MySwal.fire('Eliminado!', 'El registro ha sido eliminado.', 'success');
      }
    });
  };

  const paginationOptions = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
  };

  return (
    <div className='flex flex-col w-11/12 mx-auto bg-white rounded-xl shadow-md overflow-hidden p-5'>
      <h1 className='font-medium'>Lista de Registros</h1>
      <hr></hr>
      <div className='mt-3 w-100 flex'>
        <input
          name='buscar'
          onChange={handleFilter}
          className='block px-1.5 w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
          placeholder={'Buscar por ' + (filterKey as string) } 
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

export default TablaGenerica;
