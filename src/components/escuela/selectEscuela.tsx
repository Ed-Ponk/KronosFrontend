import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';

type Escuela = {
  escuela_id: number;
  escuela: string;
};

type SelectEscuelaProps = {
  name?: string;
  value?: string | number;
  className?: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  setEscuelaMap?: (map: { [key: string]: number }) => void; // Para pasar el mapeo al componente padre
};

const SelectEscuela: React.FC<SelectEscuelaProps> = ({ name, value,className, onChange, setEscuelaMap }) => {
  const [data, setData] = useState<Escuela[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/escuela');
        if (response.data && response.data.data) {
          setData(response.data.data);
          // Crear el mapeo y pasarlo al componente padre si setEscuelaMap está definido
          if (setEscuelaMap) {
            const map = response.data.data.reduce((acc: { [key: string]: number }, escuela: Escuela) => {
              acc[escuela.escuela] = escuela.escuela_id;
              return acc;
            }, {});
            setEscuelaMap(map);
          }
        } else {
          setData([]); // Establecer a un arreglo vacío si no hay datos
        }
        setLoading(false); // Cambia el estado de carga a falso
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData(); // Llama a la función fetchData al montar el componente
  }, [setEscuelaMap]);

  return (
    <select
      id="escuelas"
      name={name}
      value={value}
      onChange={onChange}
      className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 ${className}`}
    >
      <option value="0">Seleccionar Escuela</option>
      {loading ? (
        <option>Cargando...</option>
      ) : (
        data.length > 0 ? (
          data.map((escuela) => (
            <option key={escuela.escuela_id} value={escuela.escuela_id}>
              {escuela.escuela}
            </option>
          ))
        ) : (
          <option disabled>No hay datos disponibles</option>
        )
      )}
    </select>
  );
};

export default SelectEscuela;
