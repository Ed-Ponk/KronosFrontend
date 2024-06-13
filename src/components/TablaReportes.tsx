import React, { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axiosInstance from '../api/axiosConfig';
import ComboboxCustom2 from './common/Combobox2';
import { useData } from '../contexts/DataContextProps ';

const MySwal = withReactContent(Swal);

const TablaReportes: React.FC = () => {
  const { asignaciones } = useData();
  const [data, setData] = useState<any[]>(asignaciones.estructura_data);
  const [filteredData, setFilteredData] = useState<any[]>(asignaciones.estructura_data);
  const [dataJurados, setDataJurados] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchJurados = async () => {
      try {
        const response = await axiosInstance.get('jurados');
        const juradosData = response.data.data.map((item: any) => ({
          id: item.jurado_id,
          name: item.nombre_completo,
        }));
        setDataJurados(juradosData);
      } catch (error) {
        console.error('Error fetching jurado data:', error);
      }
    };

    fetchJurados();
  }, []);

  useEffect(() => {
    setData(asignaciones.estructura_data);
    setFilteredData(asignaciones.estructura_data);
  }, [asignaciones]);

  useEffect(() => {
    applyFilters();
  }, [startDate, endDate, searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, rowIndex: number, column: string) => {
    const newData = [...data];
    newData[rowIndex][column] = e.target.value;
    setData(newData);
  };

  const handleJuradosChange = (selectedOption: any, rowIndex: number, juradoIndex: number) => {
    const newData = [...data];
    const jurados = [...newData[rowIndex].jurados_asignados];
    if (jurados[juradoIndex]) {
      jurados[juradoIndex].nombre = selectedOption.name;
    } else {
      jurados[juradoIndex] = { nombre: selectedOption.name, semestre_jurado_id: selectedOption.id };
    }
    newData[rowIndex].jurados_asignados = jurados;
    setData(newData);
  };

  const handleSave = async () => {
    try {
      const response = await axiosInstance.post('/sustentacion/actualizar_sustentaciones', {
        extra: {
          'duracion_sustentacion': asignaciones.duracion_sustentacion,
          'tipo_sustentacion': asignaciones.tipo_sustentacion == 'PARCIAL' ? 'P' : 'F', // P o F
        },
        sustentaciones: filteredData
      });

      if (response.data.status) {
        MySwal.fire({
          title: 'Éxito',
          text: 'Datos guardados correctamente',
          icon: 'success',
        });

        localStorage.removeItem('datosSustentacion');
        localStorage.removeItem('disponiblesData');
        localStorage.removeItem('datosSustentacionAsignada');
        location.reload();
      } else {
        MySwal.fire({
          title: 'Error',
          text: response.data.message,
          icon: 'warning',
        });
      }
    } catch (error) {
      MySwal.fire({
        title: 'Error',
        text: 'Hubo un error al guardar los datos. Inténtalo de nuevo más tarde.',
        icon: 'error',
      });
    }
  };

  const handleSaveExcel = async () => {
    if (filteredData.length === 0) {
      MySwal.fire({
        title: 'Error',
        text: 'No hay datos para descargar.',
        icon: 'error',
      });
      return;
    }

    try {
      const responseExcel = await axiosInstance.post('/disponibilidadHoraria/generate_excel', filteredData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      const url = window.URL.createObjectURL(new Blob([responseExcel.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sustentaciones.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      MySwal.fire({
        title: 'Error',
        text: 'Hubo un error al guardar los datos. Inténtalo de nuevo más tarde.',
        icon: 'error',
      });
    }
  };

  const applyFilters = () => {
    let filtered = data;

    if (startDate && endDate) {
      filtered = filtered.filter((item) => {
        const date = new Date(item.horario.split(' ')[0]);
        return date >= new Date(startDate) && date <= new Date(endDate);
      });
    }

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.alumno_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.jurados_asignados.some((jurado) =>
          jurado && jurado.nombre !== null ? jurado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) : null
        )
      );
    }

    setFilteredData(filtered);
  };

  const handleViewDisponibles = async () => {
    try {
      // Obtener los datos almacenados en localStorage
      const storedData = JSON.parse(localStorage.getItem('datosSustentacion') || '{}');
      localStorage.setItem('datosSustentacionAsignada', JSON.stringify(data));
  
      // Verificar que los datos existan en localStorage
      if (!storedData || Object.keys(storedData).length === 0) {
        MySwal.fire({
          title: 'Error',
          text: 'No hay datos guardados para enviar.',
          icon: 'error',
        });
        return;
      }
  
     // Realizar la solicitud POST con los datos obtenidos de localStorage
     const response = await axiosInstance.post('/sustentacion/obtener_disponibilidad', storedData);

     // Obtener los datos de disponibilidad de la respuesta
     const disponiblesData = response.data;
     console.log(disponiblesData);
 
     // Guardar los datos de disponibilidad en localStorage
     localStorage.setItem('disponiblesData', JSON.stringify(disponiblesData));
 
     // Abrir la nueva página en una pestaña nueva
     const url = `/nueva-pagina`;
     window.open(url, '_blank');
    } catch (error) {
      console.error('Error fetching disponibles data:', error);
      MySwal.fire({
        title: 'Error',
        text: 'Hubo un error al obtener la disponibilidad. Inténtalo de nuevo más tarde.',
        icon: 'error',
      });
    }
  };
  const columns: TableColumn<any>[] = [
    {
      name: 'Alumno',
      selector: (row) => row.alumno_nombre,
      cell: (row, rowIndex) => (
        <input
          type="text"
          value={row.alumno_nombre}
          onChange={(e) => handleInputChange(e, rowIndex, 'alumno_nombre')}
          className="w-full p-1 border border-gray-300 dark:text-black rounded"
        />
      ),
      wrap: true,
    },
    {
      name: 'Fecha',
      selector: (row) => row.horario.split(' ')[0] || '',
      cell: (row, rowIndex) => (
        <input
          type="date"
          value={row.horario.split(' ')[0] || ''}
          onChange={(e) => {
            const newData = [...data];
            newData[rowIndex].horario = `${e.target.value} ${row.horario.split(' ')[1] || ''}`;
            setData(newData);
          }}
          className="w-full p-1 border border-gray-300 dark:text-black rounded"
        />
      ),
      wrap: true,
    },
    {
      name: 'Hora',
      selector: (row) => row.horario.split(' ')[1] || '',
      cell: (row, rowIndex) => (
        <input
          type="time"
          value={row.horario.split(' ')[1] || ''}
          onChange={(e) => {
            const newData = [...data];
            newData[rowIndex].horario = `${row.horario.split(' ')[0] || ''} ${e.target.value}`;
            setData(newData);
          }}
          className="w-full p-1 border border-gray-300 dark:text-black rounded"
        />
      ),
      wrap: true,
    },
    {
      name: 'Jurado 1',
      selector: (row) => row.jurados_asignados[1]?.nombre || '',
      cell: (row, rowIndex) => (
        <ComboboxCustom2
          className="w-full"
          data_options={dataJurados}
          data={{ id: row.jurados_asignados[1]?.semestre_jurado_id, name: row.jurados_asignados[1]?.nombre }}
          setData={(selectedOption: any) => handleJuradosChange(selectedOption, rowIndex, 1)}
        />
      ),
      wrap: true,
    },
    {
      name: 'Jurado 2',
      selector: (row) => row.jurados_asignados[2]?.nombre || '',
      cell: (row, rowIndex) => (
        <ComboboxCustom2
          className="w-full"
          data_options={dataJurados}
          data={{ id: row.jurados_asignados[2]?.semestre_jurado_id, name: row.jurados_asignados[2]?.nombre }}
          setData={(selectedOption: any) => handleJuradosChange(selectedOption, rowIndex, 2)}
        />
      ),
      wrap: true,
    },
    {
      name: 'Asesor',
      selector: (row) => row.jurados_asignados[0]?.nombre || row.asesor,
      cell: (row, rowIndex) => (
        <ComboboxCustom2
          className="w-full"
          data_options={dataJurados}
          data={{ id: row.jurados_asignados[0]?.semestre_jurado_id, name: row.jurados_asignados[0]?.nombre || row.asesor }}
          setData={(selectedOption: any) => handleJuradosChange(selectedOption, rowIndex, 0)}
        />
      ),
      wrap: true,
    },
  ];

  const paginationOptions = {
    rowsPerPageText: 'Filas por página',
    rangeSeparatorText: 'de',
    selectAllRowsItem: true,
    selectAllRowsItemText: 'Todos',
  };

  return (
    <div className="mt-5 flex flex-col w-11/12 mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden p-5">
      <div className='flex mb-2 justify-between'>
        <h1 className="font-medium text-gray-900 dark:text-gray-100">Lista de Sustentaciones</h1>
        <button onClick={handleViewDisponibles} className="bg-blue-500 text-white bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded">Ver Disponibles</button>
      </div>
      <hr />
      <div className="flex justify-between gap-2 mb-2 mt-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por alumno o jurado"
          className="p-2 w-1/3 border border-gray-300 rounded"
        />
        <div className='flex gap-2'>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
        </div>
      </div>
      <hr />
      <DataTable
        className="text-gray-900 dark:text-gray-100"
        columns={columns}
        data={filteredData}
        fixedHeader
        pagination
        paginationComponentOptions={paginationOptions}
        noDataComponent={<p className="text-gray-900 dark:text-gray-100">No hay registros para mostrar</p>}
        responsive
        fixedHeaderScrollHeight="500px"
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
              fill: 'var(--color-text-pagination)',
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
      <div className='flex justify-end gap-2'>
        <button
          onClick={handleSaveExcel}
          className="mt-3 w-1/6 p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Descargar
        </button>
        <button
          onClick={handleSave}
          className="mt-3 w-1/6 p-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default TablaReportes;
