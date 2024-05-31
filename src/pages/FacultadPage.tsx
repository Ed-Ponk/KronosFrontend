import React, { useState, useEffect } from 'react';
import TablaFacultad from '../components/facultad/TablaFacultad';
import FormFacultad from '../components/facultad/FormFacultad';
import axiosInstance from '../api/axiosConfig';
import { DataItem } from '../types/Facultad';

const FacultadPage: React.FC = () => {
  const [selectedFacultad, setSelectedFacultad] = useState<DataItem | null>(null);
  const [records, setRecords] = useState<DataItem[]>([]);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get('facultad');
      setRecords(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(); 
  }, []);

  return (
    <div className='w-full h-full md:w-auto bg-gray-100'>
      <FormFacultad selectedFacultad={selectedFacultad} setSelectedFacultad={setSelectedFacultad} fetchData={fetchData} />
      <TablaFacultad setSelectedFacultad={setSelectedFacultad} records={records} fetchData={fetchData} />
    </div>
  );
};

export default FacultadPage;
