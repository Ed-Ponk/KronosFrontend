import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';

type Grupo = {
  grupo_id: number;
  escuela_id: number;
  nombre: string;
};

type SelectGrupoProps = {
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  escuelaId: number | string;
  cursoId: number | string;
  semestreId: number | string;
  name?: string;
  value?: number | string;
  className?: string;
};

const SelectGrupo: React.FC<SelectGrupoProps> = ({ onChange, escuelaId, cursoId, semestreId, name, value, className }) => {
  const [data, setData] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/grupos/grupos-escuela?escuela_id=${escuelaId}&curso_id=${cursoId}&semestre_id=${semestreId}`);
        console.log(response)
        if (response.data && response.data.data) {
          setData(response.data.data);
        } else {
          setData([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (escuelaId && cursoId && semestreId) {
      fetchData();
    }
  }, [escuelaId, cursoId, semestreId]);

  return (
    <select 
      id="grupos" 
      name={name} 
      value={value ?? ""} 
      onChange={onChange} 
      className={className || "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"}
    >
      <option value="" >Seleccionar Grupo</option>
      {loading ? (
        <option>Cargando...</option>
      ) : (
        data.length > 0 ? (
          data.map((grupo) => (
            <option key={grupo.grupo_id} value={grupo.grupo_id}>
              {grupo.nombre}
            </option>
          ))
        ) : (
          <option disabled>No hay datos disponibles</option>
        )
      )}
    </select>
  );
};

export default SelectGrupo;
