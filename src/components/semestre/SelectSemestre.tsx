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
  setSemestreMap?: (map: { [key: string]: number }) => void;
  name?: string; // Prop opcional
  value?: number | string; // Prop opcional para el valor seleccionado
  className?: string; // Prop opcional para la clase CSS
};

const SelectSemestre: React.FC<SelectSemestreProps> = ({ onChange, name, value, className, setSemestreMap }) => {
  const [data, setData] = useState<Semestre[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/semestres');
        // Asegurarse de que data no sea null antes de establecerlo
        if (response.data && response.data.data) {
          setData(response.data.data);
          if (setSemestreMap) {
            const map = response.data.data.reduce((acc: { [key: string]: number }, semestre: Semestre) => {
              acc[semestre.nombre_semestres] = semestre.semestre_id;
              return acc;
            }, {});
            setSemestreMap(map);
          }
        } else {
          // Manejo cuando no hay datos (puedes mostrar un mensaje o manejar como prefieras)
          setData([]); // Establecer a un arreglo vacío si no hay datos
        }
        setLoading(false); // Cambia el estado de carga a falso
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Llama a la función fetchData al montar el componente
  }, [setSemestreMap]);

  return (
    <select
      id="semestres"
      name={name}
      value={value}
      onChange={onChange}
      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 ${className}`}
    >
      <option value="0">Seleccionar Semestre</option>
      {loading ? (
        <option>Cargando...</option>
      ) : (
        data.length > 0 ? (
          data.map((semestre) => (
            <option key={semestre.semestre_id} value={semestre.semestre_id}>
              {semestre.nombre_semestres}
            </option>
          ))
        ) : (
          <option disabled>No hay datos disponibles</option>
        )
      )}
    </select>
  );
};

export default SelectSemestre;
