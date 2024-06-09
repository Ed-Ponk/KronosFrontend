import React, { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import axios from 'axios';

const FechaTablaReportes: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [filterText, setFilterText] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [filterColumn, setFilterColumn] = useState<string>('estudiante');

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
    const filtered = data.filter(item => {
      const itemDate = new Date(item.fecha);
      const isDateInRange = (!startDate || itemDate >= new Date(startDate)) &&
                            (!endDate || itemDate <= new Date(endDate));

      const filterTextLower = filterText.toLowerCase();
      const matchesFilter = item.estudiante.toLowerCase().includes(filterTextLower) ||
                            item.jurado_01.toLowerCase().includes(filterTextLower) ||
                            item.jurado_02.toLowerCase().includes(filterTextLower) ||
                            item.jurado_03.toLowerCase().includes(filterTextLower);

      return matchesFilter && isDateInRange;
    });
    setFilteredData(filtered);
  }, [filterText, startDate, endDate, data]);

  const downloadExcel = async () => {
    try {
      const response = await axios.post(`http://127.0.0.1:5000/sustentacion/obtener-excel-sustentaciones`, filteredData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Para manejar la respuesta como un blob
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

  return (
    <div className="mt-5 flex flex-col w-4/5 mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden p-5">
      <h1 className="font-medium text-gray-900 dark:text-gray-100">Filtrar Sustentaciones</h1>
      <hr />
      <div className="mt-3 flex flex-col sm:flex-row justify-between items-center">
        <input
          type="text"
          placeholder="Filtrar por Nombre o Jurado"
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
          className="p-2 border w-2/6 border-gray-300 rounded"
        />
        <div className="flex flex-row items-center space-x-2">
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            placeholder="Fecha de inicio"
          />
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            placeholder="Fecha de fin"
          />
        </div>
        <button
          onClick={downloadExcel}
          className="ml-4 bg-blue-500 text-white hover:bg-blue-700 p-2 rounded"
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
