import React, { useState, useEffect, ChangeEvent } from 'react';
import axiosInstance from '../../api/axiosConfig';

type SelectProps = {
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};

const SelectSemana: React.FC<SelectProps> = ({ onChange }) => {
  const [data, setData] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('disponibilidadHoraria/semanas');
        // Asegurarse de que data no sea null antes de establecerlo
        if (response.data && response.data.data) {
          setData(response.data.data);
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
  }, []);

  return (
    <select id="semana" name="semana" onChange={onChange} className="block w-3/12 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
      <option value="0" selected>Seleccionar</option>
      {loading ? (
        <option>Cargando...</option>
      ) : (
        data.length > 0 ? (
          data.map((semana) => (
            <option key={semana} value={semana}>
              {semana}
            </option>
          ))
        ) : (
          <option disabled>No hay datos disponibles</option>
        )
      )}
    </select>
  );
};

export default SelectSemana;
