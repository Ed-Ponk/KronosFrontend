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
            setDataRecords(response.data.data);
            
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
      }, []);

    return (
        <div className='w-full h-full md:w-auto bg-gray-100'>
            <div className='flex flex-col md:flex-row'>
                <div className='w-full md:w-1/2 p-4'>
                    <FormGrupo
                        selectedData={selectedData}
                        setSelectedData={setSelectedData}
                        fetchData={fetchData}
                    />

                </div>
                <div className='w-full md:w-1/2 p-4'>
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