import React, { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import axiosInstance from '../api/axiosConfig';
import ComboboxCustom2 from './common/Combobox2';
import { useData } from '../contexts/DataContextProps '; // Importa el hook useData

const MySwal = withReactContent(Swal);

const TablaReportes: React.FC = () => {
    const { asignaciones } = useData(); // Obtiene los datos de asignaciones del contexto
    const [data, setData] = useState<any[]>(asignaciones);
    const [dataJurados, setDataJurados] = useState<any[]>([]);
  
    useEffect(() => {
      const fetchJurados = async () => {
        try {
          const response = await axiosInstance.get('jurados');
          const juradosData = response.data.data.map((item: any) => ({
            id: item.jurado_id,
            name: item.nombre_completo
          }));
          setDataJurados(juradosData);
        } catch (error) {
          console.error('Error fetching jurado data:', error);
        }
      };
  
      fetchJurados();
    }, []);
  
    useEffect(() => {
      
      setData(asignaciones);
      console.log(asignaciones);
    }, [asignaciones]);
  
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
          console.log('Datos guardados:', data);

          const response = await axiosInstance.post('/sustentacion/actualizar_sustentaciones', data);

          if (response.data.status) {
              MySwal.fire({
                  title: 'Éxito',
                  text: 'Datos guardados y descargados correctamente',
                  icon: 'success',
              });
          } else {
              MySwal.fire({
                  title: 'Error',
                  text: response.data.message,
                  icon: 'error',
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
  

  
    const columns: TableColumn<any>[] = [
      {
        name: 'Alumno',
        selector: row => row.alumno_nombre,
        cell: (row, rowIndex) => (
          <input
            type="text"
            value={row.alumno_nombre}
            onChange={(e) => handleInputChange(e, rowIndex, 'alumno_nombre')}
            className="w-full p-1 border border-gray-300 rounded"
          />
        ),
        sortable: true,
        wrap: true,
      },
      {
        name: 'Fecha',
        selector: row => row.horario.split(' ')[0] || '',
        cell: (row, rowIndex) => (
          <input
            type="date"
            value={row.horario.split(' ')[0] || ''}
            onChange={(e) => {
              const newData = [...data];
              newData[rowIndex].horario = `${e.target.value} ${row.horario.split(' ')[1] || ''}`;
              setData(newData);
            }}
            className="w-full p-1 border border-gray-300 rounded"
          />
        ),
        sortable: true,
        wrap: true,
      },
      {
        name: 'Hora',
        selector: row => row.horario.split(' ')[1] || '',
        cell: (row, rowIndex) => (
          <input
            type="time"
            value={row.horario.split(' ')[1] || ''}
            onChange={(e) => {
              const newData = [...data];
              newData[rowIndex].horario = `${row.horario.split(' ')[0] || ''} ${e.target.value}`;
              setData(newData);
            }}
            className="w-full p-1 border border-gray-300 rounded"
          />
        ),
        sortable: true,
        wrap: true,
      },
      {
        name: 'Jurado 1',
        selector: row => row.jurados_asignados[0]?.nombre || '',
        cell: (row, rowIndex) => (
          <ComboboxCustom2
          className="w-full"
            data_options={dataJurados}
            data={{ id: row.jurados_asignados[0]?.semestre_jurado_id, name: row.jurados_asignados[0]?.nombre }}
            setData={(selectedOption: any) => handleJuradosChange(selectedOption, rowIndex, 0)}
          />
        ),
        sortable: true,
        wrap: true,
      },
      {
        name: 'Jurado 2',
        selector: row => row.jurados_asignados[1]?.nombre || '',
        cell: (row, rowIndex) => (
          <ComboboxCustom2
          className="w-full"
            data_options={dataJurados}
            data={{ id: row.jurados_asignados[1]?.semestre_jurado_id, name: row.jurados_asignados[1]?.nombre }}
            setData={(selectedOption: any) => handleJuradosChange(selectedOption, rowIndex, 1)}
          />
        ),
        sortable: true,
        wrap: true,
      },
      {
        name: 'Asesor',
        selector: row => row.jurados_asignados[2]?.nombre || row.asesor,
        cell: (row, rowIndex) => (
          <ComboboxCustom2
          className="w-full"
            data_options={dataJurados}
            data={{ id: row.jurados_asignados[2]?.semestre_jurado_id, name: row.jurados_asignados[2]?.nombre || row.asesor }}
            setData={(selectedOption: any) => handleJuradosChange(selectedOption, rowIndex, 2)}
          />
        ),
        sortable: true,
        wrap: true,
      }
    ];
  
    const paginationOptions = {
      rowsPerPageText: 'Filas por página',
      rangeSeparatorText: 'de',
      selectAllRowsItem: true,
      selectAllRowsItemText: 'Todos',
    };
  
    return (
      <div className="mt-5 flex flex-col w-4/5 mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden p-5">
        <h1 className="font-medium text-gray-900 dark:text-gray-100">Lista de Sustentaciones</h1>
        <hr />
        <DataTable
          className="text-gray-900 dark:text-gray-100"
          columns={columns}
          data={data}
          fixedHeader
          pagination
          paginationComponentOptions={paginationOptions}
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
        <div className='flex justify-end'>
          <button
            onClick={handleSave}
            className="mt-3 w-1/4 p-2 bg-green-500 text-white rounded hover:bg-green-700"
          >
            Guardar y Descargar
          </button>
        </div>
      </div>
    );
  };
  
  export default TablaReportes;
