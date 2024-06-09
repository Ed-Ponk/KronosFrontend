import React, { useState } from 'react';

interface TablaSeleccionMultipleProps {
  selectedCells: { disponibles: string[]; ocupadas: string[]; mediasHoras: string[] };
  setSelectedCells: React.Dispatch<React.SetStateAction<{ disponibles: string[]; ocupadas: string[]; mediasHoras: string[] }>>;
}

const TablaSeleccionMultiple: React.FC<TablaSeleccionMultipleProps> = ({ selectedCells, setSelectedCells }) => {
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [toggleMode, setToggleMode] = useState<string | null>(null);

  const hours = Array.from({ length: 16 }, (_, i) => {
    const hour = i + 7;
    return `${hour}:00 - ${hour + 1}:00`;
  });

  const handleMouseDown = (rowIndex: number, colIndex: number) => {
    const cellId = `${rowIndex}-${colIndex}`;
    if (selectedCells.ocupadas.includes(cellId) || selectedCells.mediasHoras.includes(cellId)) {
      return;
    }

    setIsSelecting(true);
    const newToggleMode = selectedCells.disponibles.includes(cellId) ? 'remove' : 'add';
    setToggleMode(newToggleMode);
    toggleCellSelection(cellId, newToggleMode);
  };

  const handleMouseUp = () => {
    setIsSelecting(false);
    setToggleMode(null);
  };

  const handleMouseMove = (rowIndex: number, colIndex: number) => {
    if (isSelecting) {
      const cellId = `${rowIndex}-${colIndex}`;
      if (selectedCells.ocupadas.includes(cellId) || selectedCells.mediasHoras.includes(cellId)) {
        return;
      }
      toggleCellSelection(cellId, toggleMode);
    }
  };

  const toggleCellSelection = (cellId: string, mode: string | null) => {
    setSelectedCells((prevSelected) => {
      const newSelected = { ...prevSelected };
      if (mode === 'add') {
        newSelected.disponibles = newSelected.disponibles.includes(cellId) ? newSelected.disponibles : [...newSelected.disponibles, cellId];
      } else if (mode === 'remove') {
        newSelected.disponibles = newSelected.disponibles.filter((id) => id !== cellId);
      }
      return newSelected;
    });
  };

  const getCellClass = (rowIndex: number, colIndex: number) => {
    const cellId = `${rowIndex}-${colIndex}`;
    if (selectedCells.ocupadas.includes(cellId)) {
      return 'bg-red-500 text-white';
    } else if (selectedCells.mediasHoras.includes(cellId)) {
      return 'bg-yellow-500 text-white';
    } else if (selectedCells.disponibles.includes(cellId)) {
      return 'bg-green-500 text-white';
    } else {
      return 'bg-white ';
    }
  };

  return (
    <div className="select-none">
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500"></div>
          <span>Disponible</span>
          <div className="w-4 h-4 bg-red-500"></div>
          <span>Ocupada</span>
          <div className="w-4 h-4 bg-yellow-500"></div>
          <span>Medias Horas</span>
        </div>
      </div>
      <table
        id="horario"
        className="w-full border-collapse mx-auto text-center mt-5"
        onMouseDown={(e) => e.preventDefault()}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <thead>
          <tr>
            <th className="border p-2 dark:bg-gray-700 dark:text-white">Hora/Día</th>
            <th className="border p-2 dark:bg-gray-700 dark:text-white">Lunes</th>
            <th className="border p-2 dark:bg-gray-700 dark:text-white">Martes</th>
            <th className="border p-2 dark:bg-gray-700 dark:text-white">Miércoles</th>
            <th className="border p-2 dark:bg-gray-700 dark:text-white">Jueves</th>
            <th className="border p-2 dark:bg-gray-700 dark:text-white">Viernes</th>
            <th className="border p-2 dark:bg-gray-700 dark:text-white">Sábado</th>
          </tr>
        </thead>
        <tbody>
          {hours.map((hour, rowIndex) => (
            <tr key={rowIndex}>
              <td className="border p-2 dark:bg-gray-800 dark:text-white">{hour}</td>
              {Array.from({ length: 6 }).map((_, colIndex) => (
                <td
                  key={colIndex}
                  className={`border p-2 dark:bg-gray-800 dark:text-white ${getCellClass(rowIndex, colIndex + 1)}`}
                  onMouseDown={() => handleMouseDown(rowIndex, colIndex + 1)}
                  onMouseMove={() => handleMouseMove(rowIndex, colIndex + 1)}
                ></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaSeleccionMultiple;
