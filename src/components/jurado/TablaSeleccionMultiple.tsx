import React, { useState } from 'react';

interface TablaSeleccionMultipleProps {
  selectedCells: string[];
  setSelectedCells: React.Dispatch<React.SetStateAction<string[]>>;
}

const TablaSeleccionMultiple: React.FC<TablaSeleccionMultipleProps> = ({ selectedCells, setSelectedCells }) => {
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const [toggleMode, setToggleMode] = useState<string | null>(null);

  const hours = Array.from({ length: 16 }, (_, i) => {
    const hour = i + 7;
    return `${hour}:00 - ${hour + 1}:00`;
  });

  const handleMouseDown = (rowIndex: number, colIndex: number) => {
    setIsSelecting(true);
    const cellId = `${rowIndex}-${colIndex}`;
    const newToggleMode = selectedCells.includes(cellId) ? 'remove' : 'add';
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
      toggleCellSelection(cellId, toggleMode);
    }
  };

  const toggleCellSelection = (cellId: string, mode: string | null) => {
    if (mode === 'add') {
      setSelectedCells((prevSelected) =>
        prevSelected.includes(cellId) ? prevSelected : [...prevSelected, cellId]
      );
    } else if (mode === 'remove') {
      setSelectedCells((prevSelected) =>
        prevSelected.includes(cellId) ? prevSelected.filter((id) => id !== cellId) : prevSelected
      );
    }
  };

  const isCellSelected = (rowIndex: number, colIndex: number) => {
    return selectedCells.includes(`${rowIndex}-${colIndex}`);
  };

  return (
    <div className="select-none">
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
                  className={`border p-2 dark:bg-gray-800 dark:text-white ${
                    isCellSelected(rowIndex, colIndex + 1) ? 'bg-blue-500 text-white dark:bg-blue-700' : ''
                  }`}
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
