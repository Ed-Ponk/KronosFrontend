import React, { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const jsonData = {
  "data": [
    
    {
        "alumno_nombre": "STEVE WILLIAMS",
        "asesor": "JUAN PÉREZ",
        "horario": "",
        "jurados_asignados": [],
        "semestre_jurado_id": 31,
        "sustentacion_id": 7
    },
    {
        "alumno_nombre": "SUSAN WAGNER",
        "asesor": "ANA GARCÍA",
        "horario": "",
        "jurados_asignados": [],
        "semestre_jurado_id": 32,
        "sustentacion_id": 8
    },
    {
        "alumno_nombre": "STEPHANIE COLLINS",
        "asesor": "CARLOS SÁNCHEZ",
        "horario": "",
        "jurados_asignados": [],
        "semestre_jurado_id": 33,
        "sustentacion_id": 9
    },
    {
        "alumno_nombre": "EUGENE BOWMAN",
        "asesor": "MARÍA RODRÍGUEZ",
        "horario": "2024-06-11 20:00",
        "jurados_asignados": [
            {
                "nombre": "MARÍA RODRÍGUEZ",
                "semestre_jurado_id": 34
            },
            {
                "nombre": "ANA GARCÍA",
                "semestre_jurado_id": 32
            },
            {
                "nombre": "CARLOS SÁNCHEZ",
                "semestre_jurado_id": 33
            }
        ],
        "semestre_jurado_id": 34,
        "sustentacion_id": 10
    },
    {
        "alumno_nombre": "KIMBERLY SMITH",
        "asesor": "LUIS FERNÁNDEZ",
        "horario": "",
        "jurados_asignados": [],
        "semestre_jurado_id": 35,
        "sustentacion_id": 11
    },
    {
        "alumno_nombre": "SAMANTHA COOK",
        "asesor": "LUCÍA GÓMEZ",
        "horario": "2024-06-14 22:00",
        "jurados_asignados": [
            {
                "nombre": "LUCÍA GÓMEZ",
                "semestre_jurado_id": 36
            },
            {
                "nombre": "JUAN PÉREZ",
                "semestre_jurado_id": 31
            },
            {
                "nombre": "MARÍA RODRÍGUEZ",
                "semestre_jurado_id": 34
            }
        ],
        "semestre_jurado_id": 36,
        "sustentacion_id": 12
    },
    {
        "alumno_nombre": "LESLIE HERRING",
        "asesor": "FRANCISCO TORRES",
        "horario": "2024-06-15 15:00",
        "jurados_asignados": [
            {
                "nombre": "FRANCISCO TORRES",
                "semestre_jurado_id": 43
            },
            {
                "nombre": "JUAN PÉREZ",
                "semestre_jurado_id": 31
            },
            {
                "nombre": "LUIS FERNÁNDEZ",
                "semestre_jurado_id": 35
            }
        ],
        "semestre_jurado_id": 43,
        "sustentacion_id": 19
    },
    {
        "alumno_nombre": "MADISON ZUNIGA",
        "asesor": "ISABEL MORALES",
        "horario": "2024-06-11 20:00",
        "jurados_asignados": [
            {
                "nombre": "ISABEL MORALES",
                "semestre_jurado_id": 44
            },
            {
                "nombre": "ANA GARCÍA",
                "semestre_jurado_id": 32
            },
            {
                "nombre": "CARLOS SÁNCHEZ",
                "semestre_jurado_id": 33
            }
        ],
        "semestre_jurado_id": 44,
        "sustentacion_id": 20
    },
    {
        "alumno_nombre": "PAMELA JONES",
        "asesor": "LUIS FERNÁNDEZ",
        "horario": "",
        "jurados_asignados": [],
        "semestre_jurado_id": 35,
        "sustentacion_id": 26
    },
    {
        "alumno_nombre": "BRAD GARCIA",
        "asesor": "JAVIER MARTÍNEZ",
        "horario": "2024-06-14 20:00",
        "jurados_asignados": [
            {
                "nombre": "JAVIER MARTÍNEZ",
                "semestre_jurado_id": 37
            },
            {
                "nombre": "CARLOS SÁNCHEZ",
                "semestre_jurado_id": 33
            },
            {
                "nombre": "MARÍA RODRÍGUEZ",
                "semestre_jurado_id": 34
            }
        ],
        "semestre_jurado_id": 37,
        "sustentacion_id": 28
    },
    {
        "alumno_nombre": "SHAWN LAMB",
        "asesor": "MARTA LÓPEZ",
        "horario": "",
        "jurados_asignados": [],
        "semestre_jurado_id": 38,
        "sustentacion_id": 29
    },
    {
        "alumno_nombre": "SABRINA OSBORNE",
        "asesor": "ALBERTO HERRERA",
        "horario": "",
        "jurados_asignados": [],
        "semestre_jurado_id": 41,
        "sustentacion_id": 32
    },
    {
        "alumno_nombre": "EBONY WILSON",
        "asesor": "ANA GARCÍA",
        "horario": "2024-06-10 17:00",
        "jurados_asignados": [
            {
                "nombre": "ANA GARCÍA",
                "semestre_jurado_id": 32
            },
            {
                "nombre": "JUAN PÉREZ",
                "semestre_jurado_id": 31
            },
            {
                "nombre": "CARLOS SÁNCHEZ",
                "semestre_jurado_id": 33
            }
        ],
        "semestre_jurado_id": 32,
        "sustentacion_id": 38
    },
    {
        "alumno_nombre": "FRANK WARREN",
        "asesor": "ANA GARCÍA",
        "horario": "2024-06-10 17:00",
        "jurados_asignados": [
            {
                "nombre": "ANA GARCÍA",
                "semestre_jurado_id": 32
            },
            {
                "nombre": "JUAN PÉREZ",
                "semestre_jurado_id": 31
            },
            {
                "nombre": "CARLOS SÁNCHEZ",
                "semestre_jurado_id": 33
            }
        ],
        "semestre_jurado_id": 32,
        "sustentacion_id": 23
    },
    {
        "alumno_nombre": "BRENDA FORD",
        "asesor": "MARÍA RODRÍGUEZ",
        "horario": "2024-06-15 16:00",
        "jurados_asignados": [
            {
                "nombre": "MARÍA RODRÍGUEZ",
                "semestre_jurado_id": 34
            },
            {
                "nombre": "ANA GARCÍA",
                "semestre_jurado_id": 32
            },
            {
                "nombre": "LUIS FERNÁNDEZ",
                "semestre_jurado_id": 35
            }
        ],
        "semestre_jurado_id": 34,
        "sustentacion_id": 25
    },
    {
        "alumno_nombre": "ANDREW OLIVER",
        "asesor": "LUCÍA GÓMEZ",
        "horario": "",
        "jurados_asignados": [],
        "semestre_jurado_id": 36,
        "sustentacion_id": 27
    },
    {
        "alumno_nombre": "MELISSA FORD",
        "asesor": "SERGIO JIMÉNEZ",
        "horario": "",
        "jurados_asignados": [],
        "semestre_jurado_id": 39,
        "sustentacion_id": 30
    },
    {
        "alumno_nombre": "ALEXA VELASQUEZ",
        "asesor": "ELENA RUIZ",
        "horario": "2024-06-12 18:00",
        "jurados_asignados": [
            {
                "nombre": "ELENA RUIZ",
                "semestre_jurado_id": 40
            },
            {
                "nombre": "JUAN PÉREZ",
                "semestre_jurado_id": 31
            },
            {
                "nombre": "MARÍA RODRÍGUEZ",
                "semestre_jurado_id": 34
            }
        ],
        "semestre_jurado_id": 40,
        "sustentacion_id": 31
    },
    {
        "alumno_nombre": "TIFFANY JOHNSON",
        "asesor": "CARMEN DÍAZ",
        "horario": "",
        "jurados_asignados": [],
        "semestre_jurado_id": 42,
        "sustentacion_id": 33
    },
    {
        "alumno_nombre": "JEFFREY FLEMING",
        "asesor": "ISABEL MORALES",
        "horario": "2024-06-15 18:00",
        "jurados_asignados": [
            {
                "nombre": "ISABEL MORALES",
                "semestre_jurado_id": 44
            },
            {
                "nombre": "JUAN PÉREZ",
                "semestre_jurado_id": 31
            },
            {
                "nombre": "ANA GARCÍA",
                "semestre_jurado_id": 32
            }
        ],
        "semestre_jurado_id": 44,
        "sustentacion_id": 35
    },
    {
        "alumno_nombre": "BRIAN BERGER",
        "asesor": "PEDRO ROMERO",
        "horario": "2024-06-11 17:00",
        "jurados_asignados": [
            {
                "nombre": "PEDRO ROMERO",
                "semestre_jurado_id": 45
            },
            {
                "nombre": "ANA GARCÍA",
                "semestre_jurado_id": 32
            },
            {
                "nombre": "CARLOS SÁNCHEZ",
                "semestre_jurado_id": 33
            }
        ],
        "semestre_jurado_id": 45,
        "sustentacion_id": 36
    },
    {
        "alumno_nombre": "DILLON CRUZ",
        "asesor": "JUAN PÉREZ",
        "horario": "",
        "jurados_asignados": [],
        "semestre_jurado_id": 31,
        "sustentacion_id": 37
    },
    {
        "alumno_nombre": "ERIC THOMAS",
        "asesor": "MARÍA RODRÍGUEZ",
        "horario": "",
        "jurados_asignados": [],
        "semestre_jurado_id": 34,
        "sustentacion_id": 40
    },
    {
        "alumno_nombre": "ADAM MITCHELL",
        "asesor": "LUCÍA GÓMEZ",
        "horario": "",
        "jurados_asignados": [],
        "semestre_jurado_id": 36,
        "sustentacion_id": 42
    }
  ],
  "message": "Prueba",
  "status": true
};

const TablaReportes: React.FC = () => {
    const [data, setData] = useState<any[]>(jsonData.data);
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, rowIndex: number, column: string) => {
      const newData = [...data];
      newData[rowIndex][column] = e.target.value;
      setData(newData);
    };
  
    const handleJuradosChange = (e: React.ChangeEvent<HTMLInputElement>, rowIndex: number, juradoIndex: number) => {
      const newData = [...data];
      const jurados = [...newData[rowIndex].jurados_asignados];
      if (jurados[juradoIndex]) {
        jurados[juradoIndex].nombre = e.target.value;
      } else {
        jurados[juradoIndex] = { nombre: e.target.value, semestre_jurado_id: null };
      }
      newData[rowIndex].jurados_asignados = jurados;
      setData(newData);
    };
  
    const handleSave = () => {
      console.log('Datos guardados:', data);
      // Aquí puedes manejar la lógica para enviar el JSON al servidor
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
          <input
            type="text"
            value={row.jurados_asignados[0]?.nombre || ''}
            onChange={(e) => handleJuradosChange(e, rowIndex, 0)}
            className="w-full p-1 border border-gray-300 rounded"
          />
        ),
        sortable: true,
        wrap: true,
      },
      {
        name: 'Jurado 2',
        selector: row => row.jurados_asignados[1]?.nombre || '',
        cell: (row, rowIndex) => (
          <input
            type="text"
            value={row.jurados_asignados[1]?.nombre || ''}
            onChange={(e) => handleJuradosChange(e, rowIndex, 1)}
            className="w-full p-1 border border-gray-300 rounded"
          />
        ),
        sortable: true,
        wrap: true,
      },
      {
        name: 'Asesor',
        selector: row => row.jurados_asignados[2]?.nombre || row.asesor,
        cell: (row, rowIndex) => (
          <input
            type="text"
            value={row.jurados_asignados[2]?.nombre || row.asesor}
            onChange={(e) => handleJuradosChange(e, rowIndex, 2)}
            className="w-full p-1 border border-gray-300 rounded"
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