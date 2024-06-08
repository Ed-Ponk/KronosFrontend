import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';

import FormGrupo from '../components/grupo/FormGrupo'
import TablaGrupo from '../components/grupo/TablaGrupo';
import { DataGrupo } from '../types/Grupo';

const GrupoPage: React.FC = () => {

    const [selectedData, setSelectedData] = useState<DataGrupo | null>(null);
    const [dataRecords, setDataRecords] = useState<DataGrupo[]>([]);


    const fetchData = async () => {
        try {
            const response = await axiosInstance.get('grupos');
            //dar formato necesario
            let datosFormateados: DataGrupo[] = []
            response.data.data.forEach((grupo: { grupo_curso_id: any; curso_id: any; curso: any; grupo_id: any; grupo: any; docente_id: any; docente: any; escuela_id: any; escuela: any; semestre_id: any; nombre_semestre: any; }) => {
                datosFormateados.push({
                    grupo_curso_id: grupo.grupo_curso_id,
                    curso: {
                        id: grupo.curso_id,
                        name: grupo.curso,
                    },
                    grupo: {
                        id: grupo.grupo_id,
                        name: grupo.grupo
                    },
                    docente: {
                        id: grupo.docente_id,
                        name: grupo.docente,
                    },
                    escuela: {
                        id: grupo.escuela_id,
                        name: grupo.escuela,
                    },
                    nombre_semestre: {
                        id: grupo.semestre_id,
                        name: grupo.nombre_semestre,
                    },
                })
            });

            setDataRecords(datosFormateados);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className='w-full h-auto md:h-full md:w-auto bg-gray-100 dark:bg-slate-900'>
            <div className='flex flex-col md:flex-row'>
                <div className='w-full md:w-2/6 p-4'>
                    <FormGrupo
                        selectedData={selectedData}
                        setSelectedData={setSelectedData}
                        fetchData={fetchData}
                    />

                </div>
                <div className='w-full md:w-4/6 p-4'>
                    <TablaGrupo
                        setSelectedData={setSelectedData}
                        records={dataRecords}
                        fetchData={fetchData}
                    />
                </div>
            </div>
        </div>
    );
}

export default GrupoPage;