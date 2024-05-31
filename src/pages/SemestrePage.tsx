import React, { useState, useEffect } from 'react';
import TablaSemestre from '../components/TablaSemestre';
import FormSemestre from '../components/FormSemestre';
import axios from 'axios';

type DataItem = {
  semestre_id: number;
  nombre_semestres: string;
  fecha_fin: string;
  fecha_inicio: string;
  vigente: string;
};

const SemestrePage: React.FC = () => {
  const [selectedSemestre, setSelectedSemestre] = useState<DataItem | null>(null);
  const [records, setRecords] = useState<DataItem[]>([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/semestres');
      setRecords(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(); 
  }, []);

  return (
    <div className='w-full h-full md:w-auto bg-gray-100 '>
      <FormSemestre selectedSemestre={selectedSemestre} setSelectedSemestre={setSelectedSemestre} fetchData={fetchData} />
      <TablaSemestre setSelectedSemestre={setSelectedSemestre} records={records} fetchData={fetchData} />
    </div>
  );
};

export default SemestrePage;
