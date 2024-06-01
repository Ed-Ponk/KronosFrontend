import React from 'react';
import { DataFacultad } from '../../types/Facultad';

interface SelectFacultadProps {
  value: number | null;
  onChange: (value: number) => void;
  facultades: DataFacultad[];
}

const SelectFacultad: React.FC<SelectFacultadProps> = ({ value, onChange, facultades }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(Number(event.target.value));
  };

  return (
    <div>
      <label htmlFor="facultad_id" className="block text-sm font-medium leading-6 text-gray-900">
        Facultad
      </label>
      <div className="mt-2">
        <select
          id="facultad_id"
          name="facultad_id"
          value={value !== null ? value : ''}
          onChange={handleChange}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 p-1 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        >
          <option value="" disabled>Selecciona una facultad</option>
          {facultades.map(facultad => (
            <option key={facultad.facultad_id} value={facultad.facultad_id}>
              {facultad.nombre}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectFacultad;
