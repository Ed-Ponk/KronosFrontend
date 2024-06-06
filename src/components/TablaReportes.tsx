import React from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';

interface EstudianteData {
  estudiante: string;
  dia: string;
  hora: string;
  asesor: string;
  jurado1: string;
  jurado2: string;
}

const data: EstudianteData[] = [
  {
    estudiante: 'ARIAS MORENO CARLO RENATO',
    dia: 'martes 07/05/2024',
    hora: '8:00 p.m.',
    asesor: 'REYES BURGOS KARLA CECILIA',
    jurado1: 'ARANGURI GARCIA',
    jurado2: 'ZUNE BISPO LUIS'
  },
  {
    estudiante: 'BARDALES RUEDA SEGUNDO JUAN JOSE',
    dia: 'martes 07/05/2024',
    hora: '8:00 p.m.',
    asesor: 'REYES BURGOS KARLA CECILIA',
    jurado1: 'ARANGURI GARCIA',
    jurado2: 'ZUNE BISPO LUIS'
  },
  {
    estudiante: 'BURGOS MEDINALEON LUIS MAURICIO',
    dia: 'martes 07/05/2024',
    hora: '8:00 p.m.',
    asesor: 'REYES BURGOS KARLA CECILIA',
    jurado1: 'ARANGURI GARCIA',
    jurado2: 'ZUNE BISPO LUIS'
  },
  {
    estudiante: 'CAJAN POLO JUAN ALBERTO SEGUNDO',
    dia: 'martes 07/05/2024',
    hora: '8:00 p.m.',
    asesor: 'REYES BURGOS KARLA CECILIA',
    jurado1: 'ARANGURI GARCIA',
    jurado2: 'ZUNE BISPO LUIS'
  },
  {
    estudiante: 'RIVERA AYALA JERRY',
    dia: 'martes 07/05/2024',
    hora: '8:00 p.m.',
    asesor: 'REYES BURGOS KARLA CECILIA',
    jurado1: 'LUJAN SEGURA EDWAR GLORMER',
    jurado2: 'ZUNE BISPO LUIS'
  },
  {
    estudiante: 'SAUCCO RUIZ JOE BRANDON',
    dia: 'miércoles 08/05/2024',
    hora: '10:00 a.m.',
    asesor: 'BRAVO JACO JESSE LEILA',
    jurado1: 'LUJAN SEGURA EDWAR GLORMER',
    jurado2: 'ZUNE BISPO LUIS'
  },
  {
    estudiante: 'SOPLAPUCO PURISACA JUNIOR ALEXIS',
    dia: 'miércoles 08/05/2024',
    hora: '10:00 a.m.',
    asesor: 'BRAVO JACO JESSE LEILA',
    jurado1: 'LUJAN SEGURA EDWAR GLORMER',
    jurado2: 'ZUNE BISPO LUIS'
  },
  {
    estudiante: 'TORRES VALDERRAMA DAMBERT WILFREDO',
    dia: 'miércoles 08/05/2024',
    hora: '10:00 a.m.',
    asesor: 'BRAVO JACO JESSE LEILA',
    jurado1: 'LUJAN SEGURA EDWAR GLORMER',
    jurado2: 'ZUNE BISPO LUIS'
  },
  {
    estudiante: 'SOPLAPUCO TAPARA IVANNA CAROLINA',
    dia: 'miércoles 08/05/2024',
    hora: '10:00 a.m.',
    asesor: 'BRAVO JACO JESSE LEILA',
    jurado1: 'LUJAN SEGURA EDWAR GLORMER',
    jurado2: 'ZUNE BISPO LUIS'
  },
  {
    estudiante: 'VALERA SANOVAL MARY CECY',
    dia: 'miércoles 08/05/2024',
    hora: '10:00 a.m.',
    asesor: 'BRAVO JACO JESSE LEILA',
    jurado1: 'LUJAN SEGURA EDWAR GLORMER',
    jurado2: 'ZUNE BISPO LUIS'
  }
];

// Definir las columnas
const columns: TableColumn<EstudianteData>[] = [
  {
    name: 'Apellidos y Nombres Estudiante',
    selector: (row: EstudianteData) => row.estudiante,
    sortable: true,
    wrap: true,
  },
  {
    name: 'Día',
    selector: (row: EstudianteData) => row.dia,
    sortable: true,
    wrap: true,
  },
  {
    name: 'Hora',
    selector: (row: EstudianteData) => row.hora,
    sortable: true,
    wrap: true,
  },
  {
    name: 'Asesor',
    selector: (row: EstudianteData) => row.asesor,
    sortable: true,
    wrap: true,
  },
  {
    name: 'Jurado 01',
    selector: (row: EstudianteData) => row.jurado1,
    sortable: true,
    wrap: true,
  },
  {
    name: 'Jurado 02',
    selector: (row: EstudianteData) => row.jurado2,
    sortable: true,
    wrap: true,
  },
];

const TablaReportes: React.FC = () => {
  return (

    <div className="mt-5 flex flex-col w-4/5 mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-5">
        <h1 className='font-medium mb-2 text-gray-900 dark:text-gray-200'>Lista de Jurados</h1>
      <hr />
      <div className='mt-2 flex flex-col md:flex-row md:items-center md:space-x-4'>
      <DataTable
        columns={columns}
        data={data}
        
        highlightOnHover
        pointerOnHover
        responsive
        customStyles={{
          header: {
            style: {
              minHeight: '56px',
              backgroundColor: '#f3f4f6',
              color: '#1f2937',
              borderBottom: '2px solid #e5e7eb',
              fontSize: '1.25rem',
            },
          },
          headRow: {
            style: {
              backgroundColor: '#f9fafb',
              borderBottom: '2px solid #e5e7eb',
            },
          },
          headCells: {
            style: {
              color: '#6b7280',
              fontSize: '1rem',
              fontWeight: '600',
              justifyContent: 'center',
            },
          },
          rows: {
            style: {
              minHeight: '72px', // override the row height
              '&:not(:last-of-type)': {
                borderBottom: '1px solid #e5e7eb',
              },
            },
          },
          cells: {
            style: {
              justifyContent: 'center',
              paddingLeft: '16px',
              paddingRight: '16px',
            },
          },
        }}
      />
      </div>
      
    </div>
  );
};

export default TablaReportes;
