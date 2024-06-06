import React, { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import axios from 'axios';

const FechaTablaReportes: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [filterText, setFilterText] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem('user') || '{}');
        const userId = user.id;

        const response = await axios.get(`http://127.0.0.1:5000/grupos/sustentaciones/${userId}`);
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
      (item.fecha ? item.fecha : '').toString().toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredData(filtered);
  }, [filterText, data]);

  const downloadExcel = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem('user') || '{}');
      const userId = user.id;

      const response = await axios.get(`http://127.0.0.1:5000/grupos/sustentaciones-excel/${userId}`, {
        responseType: 'blob', // Para manejar la respuesta como un blob
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sustentaciones.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading Excel:', error);
    }
  };

  const columns: TableColumn<any>[] = [
    {
      name: 'Estudiante',
      selector: row => row.nombre_estudiante,
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
      selector: row => row.nombre_jurado1 || '',
      sortable: true,
      wrap: true,
    },
    {
      name: 'Jurado 2',
      selector: row => row.nombre_jurado2 || '',
      sortable: true,
      wrap: true,
    },
    {
      name: 'Asesor',
      selector: row => row.nombre_jurado3 || '',
      sortable: true,
      wrap: true,
    }
  ];

  return (
    <div className="mt-5 flex flex-col w-4/5 mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden p-5">
      <h1 className="font-medium text-gray-900 dark:text-gray-100">Filtrar Sustentaciones por Fecha</h1>
      <hr />
      <div className="mt-3 flex flex-col sm:flex-row justify-between">
        <input
          type="text"
          placeholder="Filtrar por Fecha"
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <button
          onClick={downloadExcel}
          className="ml-4 bg-blue-500 text-white p-2 rounded"
        >
          Descargar Excel
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

export default FechaTablaReportes;
