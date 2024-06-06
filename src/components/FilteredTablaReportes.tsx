import React, { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import axios from 'axios';

const FilteredTablaReportes: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [filterText, setFilterText] = useState<string>('');
  const [filterColumn, setFilterColumn] = useState<string>('estudiante');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/grupos/sustentaciones');
        if (response.data.status) {
          setData(response.data.data);
          setFilteredData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = data.filter(item =>
      (item[filterColumn] ? item[filterColumn] : '').toString().toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredData(filtered);
  }, [filterText, filterColumn, data]);

  const columns: TableColumn<any>[] = [
    {
      name: 'Estudiante',
      selector: row => row.estudiante,
      sortable: true,
      wrap: true,
    },
    {
      name: 'Fecha',
      selector: row => row.fecha || '',
      sortable: true,
      wrap: true,
    },
    {
      name: 'Hora',
      selector: row => row.hora_inicio || '',
      sortable: true,
      wrap: true,
    },
    {
      name: 'Jurado 1',
      selector: row => row.jurado_01 || '',
      sortable: true,
      wrap: true,
    },
    {
      name: 'Jurado 2',
      selector: row => row.jurado_02 || '',
      sortable: true,
      wrap: true,
    },
    {
      name: 'Asesor',
      selector: row => row.jurado_03 || '',
      sortable: true,
      wrap: true,
    }
  ];

  const handleDownloadExcel = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/grupos/sustentaciones-excel', {
        responseType: 'blob', // Esto es importante para manejar el archivo correctamente
      });

      // Crear un enlace para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sustentaciones.xlsx'); // Nombre del archivo
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading Excel file:', error);
    }
  };

  return (
    <div className="mt-5 flex flex-col w-4/5 mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden p-5">
      <h1 className="font-medium text-gray-900 dark:text-gray-100">Filtrar Sustentaciones</h1>
      <hr />
      <div className="mt-3 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex flex-row items-center space-x-2">
          <select
            value={filterColumn}
            onChange={e => setFilterColumn(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="estudiante">Estudiante</option>
            <option value="jurado_01">Jurado 1</option>
            <option value="jurado_02">Jurado 2</option>
            <option value="jurado_03">Asesor</option>
            <option value="fecha">Fecha</option>
          </select>
          <input
            type="text"
            placeholder={`Filtrar por ${filterColumn}`}
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          onClick={handleDownloadExcel}
          className="mt-3 sm:mt-0 bg-blue-500 text-white p-2 rounded"
        >
          Descargar en Excel
        </button>
      </div>
      <DataTable
        className="text-gray-900 dark:text-gray-100 mt-3"
        columns={columns}
        data={filteredData}
        fixedHeader
        pagination
        noDataComponent={<p className="text-gray-900 dark:text-gray-100">No hay registros para mostrar</p>}
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
            pageButtonsStyle: {
              fill: 'var(--color-text-pagination)', // Cambia el color de las flechas de navegación
              '&:hover:not(:disabled)': {
                backgroundColor: 'var(--color-bg-pagination-hover)',
              },
              '&:focus': {
                outline: 'none',
                backgroundColor: 'var(--color-bg-pagination-hover)',
              },
            },
          },
        }}
      />
    </div>
  );
};

export default FilteredTablaReportes;
