import React, { useEffect, useState } from 'react';
import TablaSeleccionMultiple from './TablaSeleccionMultiple';
import SelectSemana from './SelectSemana';
import axiosInstance from '../../api/axiosConfig';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const HorarioSeleccionMultiple = () => {
  const [selectedSemana, setSelectedSemana] = useState<number | null>(null);
  const [selectedCells, setSelectedCells] = useState<string[]>([]);

  useEffect(() => {
    console.log(selectedCells)
  }, [selectedCells])

  const fetchHorasDisponibles = async (semana: number) => {
    try {
      const response = await axiosInstance({
        method: 'POST',
        url: 'disponibilidadHoraria/obtener',
        data: {
          user: window.sessionStorage.getItem('user'),
          semana: semana
        },
      });
      if (response.data.status) {
        let horarioArray = response.data.data;
        if (horarioArray[0] == 'v') return setSelectedCells([])

        if (horarioArray.length != 6) console.log('distinto')

        let horasDisponibles = []
        horarioArray.forEach((dia, index:number) => {
          horasDisponibles.push(...Object.keys(dia)
            .filter(key => key.startsWith('hora_') && dia[key] === 'D')
            .map(key => (Number.parseInt(key.replace('hora_', '')) - 7) + '-' + (index+1)));
        });

        console.log(horasDisponibles);
        setSelectedCells(horasDisponibles)

      } else {
        MySwal.fire({
          title: 'Error',
          text: response.data.message,
          icon: 'error',
        });
      }
    } catch (e) {
      MySwal.fire({
        title: 'Error',
        text: 'Error al obtener las horas disponibles para la semana. Inténtalo de nuevo más tarde.',
        icon: 'error',
      });
    }
  };

  const handleSemestreChange1 = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSemana(Number.parseInt(event.target.value));

    fetchHorasDisponibles(Number.parseInt(event.target.value));
  };

  const handleGuardar = async () => {
    const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const horasSeleccionadas: { [key: number]: { hora_inicio: string, hora_fin: string }[] } = {};

    selectedCells.forEach((cellId) => {
      const [rowIndex, colIndex] = cellId.split('-').map(Number);
      //const day = daysOfWeek[colIndex - 1];
      const hour_1 = `${7 + rowIndex}:00`;
      const hour_2 = `${8 + rowIndex}:00`;
      if (!horasSeleccionadas[colIndex]) {
        horasSeleccionadas[colIndex] = [];
      }
      horasSeleccionadas[colIndex].push({ hora_inicio: hour_1, hora_fin: hour_2 });
    });

    try {
      const response = await axiosInstance({
        method: 'POST',
        url: 'disponibilidadHoraria/guardar',
        data: {
          user: window.sessionStorage.getItem('user'),
          semana: selectedSemana,
          disponibilidad: horasSeleccionadas,
        },
      });
      if (response.data.status) {
        MySwal.fire({
          title: 'Éxito',
          text: 'Disponiblidad horaria registrada con éxito',
          icon: 'success',
        });
      } else {
        MySwal.fire({
          title: 'Error',
          text: response.data.message,
          icon: 'error',
        });
      }
    } catch (e) {
      MySwal.fire({
        title: 'Error',
        text: 'Error al registrar la Disponiblidad horaria. Inténtalo de nuevo más tarde.',
        icon: 'error',
      });
    }

  };


  useEffect(() => {


  }, [])

  return (
    <div className="flex flex-col mt-2 w-3/4 mx-auto bg-white rounded-xl shadow-md overflow-hidden p-5 dark:bg-gray-800">
      <h1 className='font-medium text-gray-900 dark:text-gray-200'>Registrar Disponibilidad Horaria</h1>
      <hr />
      <div className='flex mt-2 flex-row justify-start'>
        <label htmlFor="fecha_inicio" className="block text-sm font-medium mr-3 self-center text-gray-900 dark:text-gray-200">
          N° Semana:
        </label>
        <SelectSemana onChange={handleSemestreChange1} />
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
