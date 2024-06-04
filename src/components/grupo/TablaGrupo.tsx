import React from 'react';
import TablaGenerica from '../common/DataTable';
import { TableColumn } from 'react-data-table-component';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { DataGrupo } from '../../types/Grupo';
import axiosInstance from '../../api/axiosConfig';

const MySwal = withReactContent(Swal);

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
            width: '100px',
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
                axiosInstance.delete('/grupos/eliminar', {
                    data: JSON.stringify({ grupo_curso_id: id })
                })
                    .then(response => {
                        if (response.data.status) {
                            MySwal.fire(
                                'Eliminado!',
                                response.data.message,
                                'success'
                            );
                            fetchData();
                        } else {
                            MySwal.fire(
                                'Error!',
                                response.data.message,
                                'error'
                            );
                        }
                    })
                    .catch(() => {
                        MySwal.fire(
                            'Error!',
                            'Hubo un problema al eliminar el grupo horario.',
                            'error'
                        );
                    });
            }
        });
    };

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
