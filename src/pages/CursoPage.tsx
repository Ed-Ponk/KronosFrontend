import React, { useState, useEffect } from 'react';
import TablaCurso from '../components/curso/TablaCurso';
import FormCurso from '../components/curso/FormCurso';
import axiosInstance from '../api/axiosConfig';
import { DataCurso } from '../types/Curso';
import FormCursoEscuela from '../components/curso/FormCursoEscuela';
import TablaCursoEscuela from '../components/curso/TablaCursoEscuela';
import { DataCursoEscuela } from '../types/CursoEscuela';

const CursoPage: React.FC = () => {
  const [selectedCurso, setSelectedCurso] = useState<DataCurso | null>(null);
  const [cursoRecords, setCursoRecords] = useState<DataCurso[]>([]);
  const [selectedCursoEscuela, setSelectedCursoEscuela] = useState<DataCursoEscuela | null>(null);
  const [cursoEscuelaRecords, setCursoEscuelaRecords] = useState<DataCursoEscuela[]>([]);

  const fetchCursoData = async () => {
    try {
      const response = await axiosInstance.get('/curso');
      setCursoRecords(response.data.data);
    } catch (error) {
      console.error('Error fetching curso data:', error);
    }
  };

  const fetchCursoEscuelaData = async () => {
    try {
      const response = await axiosInstance.get('/curso/lista-escuela-cursos');
      setCursoEscuelaRecords(response.data.data);
    } catch (error) {
      console.error('Error fetching curso-escuela data:', error);
    }
  };

  useEffect(() => {
    fetchCursoData();
    fetchCursoEscuelaData();
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
          <FormCursoEscuela 
          />
          <TablaCursoEscuela
            setSelectedCursoEscuela={setSelectedCursoEscuela}
            records={cursoEscuelaRecords}
            fetchData={fetchCursoEscuelaData}
          />
        </div>
      </div>
    </div>
  );
};

export default CursoPage;
