import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';

type Semestre = {
  fecha_fin: string;
  fecha_inicio: string;
  nombre_semestres: string;
  semestre_id: number;
  vigente: string;
};

type SelectSemestreProps = {
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};

const SelectSemestre: React.FC<SelectSemestreProps> = ({ onChange }) => {
  const [data, setData] = useState<Semestre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/semestres');
        
        setData(response.data.data);
        setLoading(false); // Cambia el estado de carga a falso
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Llama a la función fetchData al montar el componente
  }, []);

  return (
    <select id="semestres" name="semestres" onChange={onChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
      <option value="0" selected disabled >Seleccionar Semestre</option>
      {loading ? (
        <option>Cargando...</option>
      ) : (
        data.map((semestre) => (
          <option key={semestre.semestre_id} value={semestre.semestre_id}>
            {semestre.nombre_semestres}
          </option>
        ))
      )}
    </select>
  );
};

export default SelectSemestre;
