import React, { useEffect, useState } from 'react';

import FormHomeWSP from '../components/Home/FormHomeWSP';
import axios from 'axios';
import DashboardCard from '../components/Home/DashBoardCard';
import TablaReportes from '../components/TablaReportes';
import FilteredTablaReportes from '../components/FilteredTablaReportes';

const HomePage: React.FC = () => {
  const [juradosVigentes, setJuradosVigentes] = useState<number>(0);
  const [estudiantesVigentes, setEstudiantesVigentes] = useState<number>(0);
  const [primeraFechaInicio, setPrimeraFechaInicio] = useState<string>('Sin fecha');

  const [semestre, setSemestre] = useState<any>(null); // Estado para almacenar la información del semestre

  const urlJurados = 'http://127.0.0.1:5000/jurados/obtener-jurado-semestre';
  const urlSemestre = 'http://127.0.0.1:5000/semestres/semestre-vigente';
  const urlEstudiantes = 'http://127.0.0.1:5000/estudiantes/obtener-cantidad-estudiantes';
  const urlFecha = 'http://127.0.0.1:5000/semana/obtener-primera-fecha';

  useEffect(() => {
    const fetchSemestre = async () => {
      try {
        const response = await axios.get(urlSemestre);
        const data = response.data;
        if (data.status) {
          setSemestre(data.data); // Guarda toda la información del semestre
          fetchJurados(data.data.semestre_id); // Llama a fetchJurados con el ID del semestre
          fetchEstudiantes(data.data.semestre_id);
          fetchFecha(data.data.semestre_id);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error fetching semestre:', error);
      }
    };

    const fetchJurados = async (semestreId: number) => {
      try {
        const response = await axios.get(`${urlJurados}?semestre_id=${semestreId}`);
        const data = response.data;
        if (data.status) {
          setJuradosVigentes(data.data.length);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error fetching jurados:', error);
      }
    };

    const fetchEstudiantes = async (semestreId: number) => {
      try {
        const response = await axios.get(`${urlEstudiantes}?semestre_id=${semestreId}`);
        const data = response.data;
        if (data.status) {
          setEstudiantesVigentes(data.cantidad_estudiantes);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error fetching estudiantes:', error);
      }
    };

    const fetchFecha = async (semestreId: number) => {
      try {
        const response = await axios.get(`${urlFecha}?semestre_id=${semestreId}`);
        const data = response.data;
        if (data.status) {
          setPrimeraFechaInicio(data.primera_fecha_inicio);
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error fetching fecha:', error);
      }
    };

    fetchSemestre();
  }, []);

  return (
    <div className='pt-5 w-full overflow-auto h-full md:w-auto bg-gray-100 dark:bg-slate-900'>
      <div className='mt-5 mb-5 flex w-4/5 mx-auto dark:bg-gray-800 rounded-xl overflow-hidden p- '>
        {semestre  && ( // Asegura que semestre tenga datos antes de renderizar
          <DashboardCard
            number={juradosVigentes}
            title="Cantidad Jurados"
            subtitle={semestre.nombre_semestres} // Envía el nombre del semestre al DashboardCard
          />
        )}
        {semestre && ( // Asegura que semestre tenga datos antes de renderizar
          <DashboardCard
            number={estudiantesVigentes}
            title="Cantidad Estudiantes"
            subtitle={semestre.nombre_semestres} // Envía el nombre del semestre al DashboardCard
          />
        )}
        {semestre && ( // Asegura que semestre tenga datos antes de renderizar
          <DashboardCard
            number={primeraFechaInicio}
            title="Sustentación Próxima"
            subtitle={semestre.nombre_semestres} // Envía el nombre del semestre al DashboardCard
          />
        )}
      </div>
      <FormHomeWSP />
      <FilteredTablaReportes />
    </div>
  );
};

export default HomePage;
