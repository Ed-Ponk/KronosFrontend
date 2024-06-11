import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable, { TableColumn } from 'react-data-table-component';

interface DataItem {
  Semestre: string;
  Curso: string;
  Grupo_Horario: string;
  Codigo_Universitario: string;
  Apellidos_y_Nombres: string;
  Email: string;
  Telefono: string;
  Jurado_1: string;
  Jurado_2: string;
  Asesor: string;
  Fecha: string;
  hora_inicio: string;
  Titulo: string;
  TipoSustentacion: string;
}

const TablaReporteAdmin: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredData, setFilteredData] = useState<DataItem[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>('All');
  const [selectedTipoSustentacion, setSelectedTipoSustentacion] = useState<string>('All');

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/home/obtener-reporte-admin')
      .then(response => {
        const transformedData = response.data.data.map((item: DataItem) => ({
          ...item,
          TipoSustentacion: item.TipoSustentacion === 'Parcial' ? 'Parcial' : 'Final'
        }));
        setData(transformedData);
        setFilteredData(transformedData);
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching data');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = data;
    if (selectedSemester !== 'All') {
      filtered = filtered.filter(item => item.Semestre === selectedSemester);
    }
    if (selectedTipoSustentacion !== 'All') {
      filtered = filtered.filter(item => item.TipoSustentacion === selectedTipoSustentacion);
    }
    setFilteredData(filtered);
  }, [selectedSemester, selectedTipoSustentacion, data]);

  const handleSemesterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSemester(event.target.value);
  };

  const handleTipoSustentacionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTipoSustentacion(event.target.value);
  };

  const exportToExcel = () => {
    axios.post('http://127.0.0.1:5000/home/exportar-excel', filteredData, {
      headers: {
        'Content-Type': 'application/json',
      },
      responseType: 'blob'
    })
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'reportes.xlsx');
        document.body.appendChild(link);
        link.click();
      })
      .catch(error => {
        console.error('Error exporting data:', error);
      });
  };

  const columns: TableColumn<DataItem>[] = [
    { name: 'Semestre', selector: row => row.Semestre, sortable: true,wrap: true, width: '70px' },
    { name: 'Tipo de Sustentación', selector: row => row.TipoSustentacion, sortable: true,wrap: true },
    { name: 'Curso', selector: row => row.Curso, sortable: true,wrap: true },
    { name: 'Grupo Horario', selector: row => row.Grupo_Horario, sortable: true ,wrap: true},
    { name: 'Código Universitario', selector: row => row.Codigo_Universitario, sortable: true,wrap: true },
    { name: 'Apellidos y Nombres', selector: row => row.Apellidos_y_Nombres, sortable: true ,wrap: true},
    { name: 'Email', selector: row => row.Email, sortable: true, wrap: true},
    { name: 'Teléfono', selector: row => row.Telefono, sortable: true,wrap: true },
    { name: 'Jurado 1', selector: row => row.Jurado_1, sortable: true ,wrap: true},
    { name: 'Jurado 2', selector: row => row.Jurado_2, sortable: true ,wrap: true},
    { name: 'Asesor', selector: row => row.Asesor, sortable: true,wrap: true },
    { name: 'Fecha', selector: row => row.Fecha, sortable: true ,wrap: true},
    { name: 'Hora Inicio', selector: row => row.hora_inicio, sortable: true,wrap: true},
    { name: 'Título', selector: row => row.Titulo, sortable: true ,wrap: true}
  ];

  const paginationOptions = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
  };

  return (
    <div className="mt-5 flex flex-col w-3/4 mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-5">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <div>
            <label htmlFor="semester" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Semestre:</label>
            <select id="semester" value={selectedSemester} onChange={handleSemesterChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option value="All">Todos</option>
              <option value="2024-I">2024-I</option>
              <option value="2024-II">2024-II</option>
              {/* Add other semesters as needed */}
            </select>
          </div>
          <div>
            <label htmlFor="tipo-sustentacion" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Sustentación:</label>
            <select id="tipo-sustentacion" value={selectedTipoSustentacion} onChange={handleTipoSustentacionChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option value="All">Todos</option>
              <option value="Parcial">Parcial</option>
              <option value="Final">Final</option>
            </select>
          </div>
        </div>
        <button onClick={exportToExcel} className="bg-blue-500 text-white px-4 py-2 rounded">Exportar a Excel</button>
      </div>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : loading ? (
        <p className="text-gray-900 dark:text-gray-200">Cargando...</p>
      ) : (
        <div className="overflow-auto">
          <div className="min-w-full">
            <DataTable
              className="text-gray-900 dark:text-gray-200"
              columns={columns}
              data={filteredData}
              fixedHeader
              pagination
              paginationComponentOptions={paginationOptions}
              noDataComponent={<p className="text-gray-900 dark:text-gray-200">No hay registros para mostrar</p>}
              responsive
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TablaReporteAdmin;
