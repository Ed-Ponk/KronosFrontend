import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';

type Jurado = {
  jurado_id: number;
  nombre_completo: string;
};

type SelectJuradoProps = {
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  semestreId: number | string;
  escuelaId: number | string;
  name?: string;
  value?: number | string;
  className?: string;
};

const SelectJurado: React.FC<SelectJuradoProps> = ({ onChange, semestreId, escuelaId, name, value, className }) => {
  const [data, setData] = useState<Jurado[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/jurados/obtener-select-jurados-escuela-semestre?semestre_id=${semestreId}&escuela_id=${escuelaId}`);
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

    if (semestreId && escuelaId) {
      fetchData();
    }
  }, [semestreId, escuelaId]);

  return (
    <select 
      id="jurados" 
      name={name} 
      value={value ?? ""} 
      onChange={onChange} 
      className={className || "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"}
    >
      <option value="" >Seleccionar Jurado</option>
      {loading ? (
        <option>Cargando...</option>
      ) : (
        data.length > 0 ? (
          data.map((jurado) => (
            <option key={jurado.jurado_id} value={jurado.jurado_id}>
              {jurado.nombre_completo}
            </option>
          ))
        ) : (
          <option disabled>No hay datos disponibles</option>
        )
      )}
    </select>
  );
};

export default SelectJurado;
