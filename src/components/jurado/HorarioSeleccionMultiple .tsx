import React, { useState } from 'react';
import TablaSeleccionMultiple from './TablaSeleccionMultiple';
import SelectSemestre from '../semestre/SelectSemestre';

const HorarioSeleccionMultiple = () => {
  const [selectedSemestre1, setSelectedSemestre1] = useState<string | null>(null);
  const [selectedSemestre2, setSelectedSemestre2] = useState<string | null>(null);
  const [selectedCells, setSelectedCells] = useState<string[]>([]);

  const handleSemestreChange1 = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSemestre1(event.target.value);
  };

  const handleSemestreChange2 = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSemestre2(event.target.value);
  };

  const handleGuardar = () => {
    const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const horasSeleccionadas: { [key: string]: string[] } = {};

    selectedCells.forEach((cellId) => {
      const [rowIndex, colIndex] = cellId.split('-').map(Number);
      const day = daysOfWeek[colIndex - 1];
      const hour = `${7 + rowIndex}:00 - ${8 + rowIndex}:00`;
      if (!horasSeleccionadas[day]) {
        horasSeleccionadas[day] = [];
      }
      horasSeleccionadas[day].push(hour);
    });

    const data = {
      semestre: selectedSemestre1,
      semana: selectedSemestre2,
      disponibilidad: horasSeleccionadas,
    };

    console.log(JSON.stringify(data, null, 2));
  };

  return (
    <div className="flex flex-col mt-2 w-3/4 mx-auto bg-white rounded-xl shadow-md overflow-hidden p-5 dark:bg-gray-800">
      <h1 className='font-medium text-gray-900 dark:text-gray-200'>Registrar Disponibilidad Horaria</h1>
      <hr />
      <div className='flex mt-2 flex-row justify-between'>
        <SelectSemestre onChange={handleSemestreChange1} />
        <SelectSemestre onChange={handleSemestreChange2} />
      </div>
      <TablaSeleccionMultiple selectedCells={selectedCells} setSelectedCells={setSelectedCells} />

      <div className='mt-2 flex justify-between'>
        <p className="mr-4 text-gray-500 font-bold">*Puede seleccionar y deseleccionar celdas haciendo clic y arrastrando el mouse sobre ellas.</p>
        <button
          type="button"
          onClick={handleGuardar}
          className="flex w-1/4 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default HorarioSeleccionMultiple;
