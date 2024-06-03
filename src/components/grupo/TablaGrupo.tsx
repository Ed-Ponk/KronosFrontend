import React from 'react';
import TablaGenerica from '../common/DataTable';
import { TableColumn } from 'react-data-table-component';
import { DataGrupo } from '../../types/Grupo';


const TablaGrupo = ({ setSelectedData, records, fetchData }: { setSelectedData: (record: DataGrupo) => void, records: DataGrupo[], fetchData: () => void }) => {
    const columns: TableColumn<DataGrupo>[] = [
        {
            name: 'ID',
            selector: (row: DataGrupo) => row.grupo_curso_id,
            sortable: true,
            width: '70px',
            center: true,
        },
        {
            name: 'Semestre',
            selector: (row: DataGrupo) => row.nombre_semestre.name,
            sortable: true,
            wrap: true,
            width:'100px',
            center: true,
        },
        {
            name: 'Curso',
            selector: (row: DataGrupo) => row.curso.name,
            sortable: true,
            wrap: true,
            center: true,
        },
        {
            name: 'Grupo',
            selector: (row: DataGrupo) => row.grupo.name,
            sortable: true,
            wrap: true,
            width: '90px',
            center: true,
        },
        {
            name: 'Docente',
            selector: (row: DataGrupo) => row.docente.name,
            sortable: true,
            wrap: true,
            center: true,
        },
        // {
        //     name: 'Escuela',
        //     selector: (row: DataGrupo) => row.escuela.name,
        //     sortable: true,
        //     wrap: true,
        //     center: true,
            
        // },
        {
            name: 'Acciones',
            cell: (row: DataGrupo) => (
                <div>
                    <button
                        className="text-blue-600 hover:text-blue-900 mr-2"
                        onClick={() => setSelectedData(row)}
                    >
                        Editar
                    </button>
                    <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDelete(row.grupo_curso_id)}
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
        <TablaGenerica<DataGrupo>
            records={records}
            columns={columns}
            setSelectedRecord={setSelectedData}
            fetchData={fetchData}
            filterKey="curso"
        />
    );
};

export default TablaGrupo;
