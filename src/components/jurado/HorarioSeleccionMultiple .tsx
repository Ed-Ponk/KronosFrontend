import React, { useEffect, useState } from 'react';
import TablaSeleccionMultiple from './TablaSeleccionMultiple';
import SelectSemana from './SelectSemana';
import axiosInstance from '../../api/axiosConfig';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import WeekSelector from './SelectorSemanas';

const MySwal = withReactContent(Swal);

const HorarioSeleccionMultiple = () => {
  const [selectedSemana, setSelectedSemana] = useState<number>(0);
  const [selectedCells, setSelectedCells] = useState<{ disponibles: string[]; ocupadas: string[]; mediasHoras: string[] }>({
    disponibles: [],
    ocupadas: [],
    mediasHoras: []
  });
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([]);

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
        if (horarioArray[0] === 'v') return setSelectedCells({ disponibles: [], ocupadas: [], mediasHoras: [] });

        if (horarioArray.length !== 6) console.log('distinto');

        let horasDisponibles: string[] = [];
        let horasOcupadas: string[] = [];
        let horasMedias: string[] = [];
        horarioArray.forEach((dia, index: number) => {
          horasDisponibles.push(
            ...Object.keys(dia)
              .filter((key) => key.startsWith('hora_') && dia[key] === 'D')
              .map((key) => (Number.parseInt(key.replace('hora_', '')) - 7) + '-' + (index + 1))
          );
        });

        horarioArray.forEach((dia, index: number) => {
          horasOcupadas.push(
            ...Object.keys(dia)
              .filter((key) => key.startsWith('hora_') && dia[key] === 'O')
              .map((key) => (Number.parseInt(key.replace('hora_', '')) - 7) + '-' + (index + 1))
          );
        });

        horarioArray.forEach((dia, index: number) => {
          horasMedias.push(
            ...Object.keys(dia)
              .filter((key) => key.startsWith('hora_') && dia[key] === 'M')
              .map((key) => (Number.parseInt(key.replace('hora_', '')) - 7) + '-' + (index + 1))
          );
        });

        setSelectedCells({ disponibles: horasDisponibles, ocupadas: horasOcupadas, mediasHoras: horasMedias });
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

  const handleSemestreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const semana = Number.parseInt(event.target.value);
    setSelectedSemana(semana);
    setSelectedWeeks([semana]);
    fetchHorasDisponibles(semana);
  };

  const handleGuardar = async () => {
    if (selectedSemana === 0) {
      return MySwal.fire({
        title: 'Error',
        text: 'Seleccione una semana porfavor',
        icon: 'error',
      });
    }

    const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const horasSeleccionadas: { [key: number]: { hora_inicio: string; hora_fin: string }[] } = {};

    for (const key in selectedCells) {
      selectedCells[key].forEach((cellId) => {
        const [rowIndex, colIndex] = cellId.split('-').map(Number);
        const hour_1 = `${7 + rowIndex}:00`;
        const hour_2 = `${8 + rowIndex}:00`;
        if (!horasSeleccionadas[colIndex]) {
          horasSeleccionadas[colIndex] = [];
        }
        horasSeleccionadas[colIndex].push({ hora_inicio: hour_1, hora_fin: hour_2 });
      });
    }

    try {
      const response = await axiosInstance({
        method: 'POST',
        url: 'disponibilidadHoraria/guardar',
        data: {
          user: window.sessionStorage.getItem('user'),
          semanas: selectedWeeks,
          disponibilidad: horasSeleccionadas,
        },
      });
      if (response.data.status) {
        MySwal.fire({
          title: 'Éxito',
          text: 'Disponibilidad horaria registrada con éxito',
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
        text: 'Error al registrar la disponibilidad horaria. Inténtalo de nuevo más tarde.',
        icon: 'error',
      });
    }
  };

  useEffect(() => {
    fetchSemanasFuturas();
  }, []);

  const [semanasFuturas, setSemanasFuturas] = useState<number[]>([]);
  const fetchSemanasFuturas = async () => {
    try {
      const response = await axiosInstance.get('disponibilidadHoraria/semanas' + (!modeTest ? '/disponibles' : ''));
      if (response.data && response.data.data) {
        setSemanasFuturas(response.data.data);
      } else {
        setSemanasFuturas([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSelectionChange = (weeks: number[]) => {
    setSelectedWeeks(weeks);
  };

  //Logica para activar el modo test para permitir registrar en semanas pasadas
  const [modeTest, setModeTest] = useState(false)

  useEffect(() => {
    fetchSemanasFuturas()
  }, [modeTest])

  return (
    <div className="flex flex-col mt-2 w-3/4 mx-auto bg-white rounded-xl shadow-md overflow-hidden p-5 dark:bg-gray-800">
      <h1 className="font-medium text-gray-900 dark:text-gray-200">Registrar Disponibilidad Horaria</h1>
      <hr />
      <div className="flex mt-2 flex-row justify-start">
        <label htmlFor="fecha_inicio" className="block text-sm font-medium mr-3 self-center text-gray-900 dark:text-gray-200">
          N° Semana:
        </label>
        <SelectSemana onChange={handleSemestreChange} />

        <label htmlFor="vigente" className="block ml-36 mr-2 text-sm font-medium self-center leading-6 dark:text-gray-200">
          Modo Test:
        </label>
        <input
          type="checkbox"
          checked={modeTest}
          onChange={(e) => setModeTest(e.target.checked)}
          className="rounded-md border-0 text-indigo-600 shadow-sm focus:ring-2 focus:ring-indigo-600" />

      </div>
      <TablaSeleccionMultiple selectedCells={selectedCells} setSelectedCells={setSelectedCells} />

      <div className="mt-2 justify-between w-full max-w-4xl p-4 items-center space-y-4 md:space-y-0">
        <p className="text-gray-500 dark:text-gray-300 font-bold text-center md:text-left flex-1">
          *Puede seleccionar y deseleccionar celdas haciendo clic y arrastrando el mouse sobre ellas.
        </p>
        {semanasFuturas.includes(selectedSemana) && (
          <div className="mt-2 flex flex-col md:flex-row justify-between  w-full max-w-4xl p-4 items-center space-y-4 md:space-y-0">
            <div className="flex-1 flex items-center justify-center">
              <WeekSelector weeks={semanasFuturas} initialSelectedWeek={selectedWeeks} onSelectionChange={handleSelectionChange} />
            </div>
            <button
              type="button"
              onClick={handleGuardar}
              className="w-32 ml-6 md:w-auto justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Guardar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HorarioSeleccionMultiple;
