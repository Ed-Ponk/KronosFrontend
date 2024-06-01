import React, { useState, useEffect } from 'react';
import TablaCurso from '../components/curso/TablaCurso';
import FormCurso from '../components/curso/FormCurso';
import axiosInstance from '../api/axiosConfig';
import { DataCurso } from '../types/Curso';
import FormCursoEscuela from '../components/curso/FormCursoEscuela';

const CursoPage: React.FC = () => {
  const [selectedCurso, setSelectedCurso] = useState<DataCurso | null>(null);
  const [cursoRecords, setCursoRecords] = useState<DataCurso[]>([]);

  const fetchCursoData = async () => {
    try {
      const response = await axiosInstance.get('curso');
      setCursoRecords(response.data.data);
    } catch (error) {
      console.error('Error fetching curso data:', error);
    }
  };

  useEffect(() => {
    fetchCursoData();
  }, []);

  return (
    <div className='w-full h-full md:w-auto bg-gray-100'>
      <div className='flex flex-col md:flex-row'>
        <div className='w-full md:w-1/2 p-4'>
          <FormCurso
            selectedCurso={selectedCurso}
            setSelectedCurso={setSelectedCurso}
            fetchData={fetchCursoData}
          />
          <TablaCurso
            setSelectedCurso={setSelectedCurso}
            records={cursoRecords}
            fetchData={fetchCursoData}
          />
        </div>
        <div className='w-full md:w-1/2 p-4'>
          <FormCursoEscuela/>
        </div>
      </div>
    </div>
  );
};

export default CursoPage;
