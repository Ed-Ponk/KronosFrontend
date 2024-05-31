import React, { useState, useEffect } from 'react';
import TablaFacultad from '../components/facultad/TablaFacultad';
import FormFacultad from '../components/facultad/FormFacultad';
import FormEscuela from '../components/escuela/FormEscuela';
import TablaEscuela from '../components/escuela/TablaEscuela';
import axiosInstance from '../api/axiosConfig';
import { DataFacultad } from '../types/Facultad';
import { DataEscuela } from '../types/Escuela';

const FacultadPage: React.FC = () => {
  const [selectedFacultad, setSelectedFacultad] = useState<DataFacultad | null>(null);
  const [facultadRecords, setFacultadRecords] = useState<DataFacultad[]>([]);
  const [selectedEscuela, setSelectedEscuela] = useState<DataEscuela | null>(null);
  const [escuelaRecords, setEscuelaRecords] = useState<DataEscuela[]>([]);

  const fetchFacultadData = async () => {
    try {
      const response = await axiosInstance.get('facultad');
      setFacultadRecords(response.data.data);
    } catch (error) {
      console.error('Error fetching facultad data:', error);
    }
  };

  const fetchEscuelaData = async () => {
    try {
      const response = await axiosInstance.get('escuela');
      setEscuelaRecords(response.data.data);
    } catch (error) {
      console.error('Error fetching escuela data:', error);
    }
  };

  useEffect(() => {
    fetchFacultadData();
    fetchEscuelaData();
  }, []);

  return (
    <div className='w-full h-full md:w-auto bg-gray-100'>
      <div className='flex flex-col md:flex-row'>
        <div className='w-full md:w-1/2 p-4'>
          <FormFacultad
            selectedFacultad={selectedFacultad}
            setSelectedFacultad={setSelectedFacultad}
            fetchData={fetchFacultadData}
          />
          <TablaFacultad
            setSelectedFacultad={setSelectedFacultad}
            records={facultadRecords}
            fetchData={fetchFacultadData}
          />
        </div>
        <div className='w-full md:w-1/2 p-4'>
          <FormEscuela
            selectedEscuela={selectedEscuela}
            setSelectedEscuela={setSelectedEscuela}
            fetchData={fetchEscuelaData}
          />
          <TablaEscuela
            setSelectedEscuela={setSelectedEscuela}
            records={escuelaRecords}
            fetchData={fetchEscuelaData}
          />
        </div>
      </div>
    </div>
  );
};

export default FacultadPage;
