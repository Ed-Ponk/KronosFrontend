import React, { useState, useEffect } from 'react';
import FormSemanaSustentacion from '../components/semanaSustentacion/FormSemana';
import TablaSemanaSustentacion from '../components/semanaSustentacion/TablaSemana';
import axiosInstance from '../api/axiosConfig';
import { DataItem } from '../types/SemanaSustentacion';

const SemanasSustentacionPage: React.FC = () => {
    const [selectedSemanaSustentacion, setSelectedSemanaSustentacion] = useState<DataItem | null>(null);
    const [records, setRecords] = useState<DataItem[]>([]);

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get('semana');
            
            let datosFormateados:DataItem[] = []

            response.data.data.forEach(item => {
                datosFormateados.push({
                    rango_fecha_sustentacion_id: item.rango_fecha_sustentacion_id,
                    tipo_sustentacion: {
                        id: item.tipo_sustentacion == 'Parcial' ? 0 : 1, 
                        name: item.tipo_sustentacion,
                    },
                    semanas: item.semanas,
                    fecha_fin: item.fecha_fin,
                    fecha_inicio: item.fecha_inicio,
                    duracion_sustentacion: item.duracion_sustentacion,
                    compensacion_docente: {
                        id: item.compensacion_docente == 'No' ? 0 : 1, 
                        name: item.compensacion_docente,
                    },
                    escuela_curso_id: {
                        id: item.escuela_curso_id,
                        escuela: {
                            id: item.escuela_id,
                            name: item.escuela,
                        },
                        curso: {
                            id: item.curso_id,
                            name: item.curso,
                        },
                    }
                
                })
            });

            setRecords(datosFormateados);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className='w-full overflow-auto h-full md:w-auto bg-gray-100  dark:bg-slate-900'>
            <FormSemanaSustentacion selectedSemanaSustentacion={selectedSemanaSustentacion} setSelectedSemanaSustentacion={setSelectedSemanaSustentacion} fetchData={fetchData} />
            <TablaSemanaSustentacion setSelectedSemanaSustentacion={setSelectedSemanaSustentacion} records={records} fetchData={fetchData} />
        </div>
    );
};

export default SemanasSustentacionPage;
