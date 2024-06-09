import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';

type Curso = {
  curso_id: number;
  escuela_id: number;
  nombre: string;
};

type SelectCursoProps = {
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  escuelaId: number | string; // Prop para el id de la escuela seleccionada
  name?: string; // Prop opcional
  value?: number | string; // Prop opcional para el valor seleccionado
  className?: string; // Prop opcional para el className
};

const SelectCurso: React.FC<SelectCursoProps> = ({ onChange, escuelaId, name, value, className }) => {
  const [data, setData] = useState<Curso[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/curso/cursos-escuela?escuela_id=${escuelaId}`);
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

    if (escuelaId) {
      fetchData();
    }
  }, [escuelaId]);

  return (
    
    <select 
      id="cursos" 
      name={name} 
      value={value} 
      onChange={onChange} 
      className={className || "block w-3/12 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"}
    >
      <option value="0" >Seleccionar Curso</option>
      {loading ? (
        <option>Cargando...</option>
      ) : (
        data.length > 0 ? (
          data.map((curso) => (
            <option key={curso.curso_id} value={curso.curso_id}>
              {curso.nombre}
            </option>
          ))
        ) : (
          <option disabled>No hay datos disponibles seleccione escuela</option>
        )
      )}
    </select>
  );
};

export default SelectCurso;