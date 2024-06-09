import React, { useState, useEffect } from 'react';

interface WeekSelectorProps {
  weeks: number[];
  initialSelectedWeek: number[];
  onSelectionChange: (selectedWeeks: number[]) => void;
}

const WeekSelector: React.FC<WeekSelectorProps> = ({ weeks, initialSelectedWeek, onSelectionChange }) => {
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>(initialSelectedWeek);

  const toggleWeekSelection = (week: number) => {
    setSelectedWeeks(prev => {
      const newSelection = prev.includes(week) ? prev.filter(w => w !== week) : [...prev, week];
      onSelectionChange(newSelection);
      return newSelection;
    });
  };

  useEffect(() => {
    onSelectionChange(selectedWeeks);
  }, []);

  useEffect(() => {
    setSelectedWeeks(initialSelectedWeek);
  }, [initialSelectedWeek])

  return (
    <div className="p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
      <p className="mb-2 text-gray-700 dark:text-gray-300 text-center">
        Seleccione las semanas en las que se guardarán los registros:
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {weeks.map(week => (
          <div
            key={week}
            className={`w-10 h-10 flex items-center justify-center rounded-full cursor-pointer 
              ${selectedWeeks.includes(week) ? 'bg-blue-400 text-white dark:bg-emerald-500 dark:text-black' : 'bg-gray-200 dark:bg-gray-700 dark:text-gray-400'}`}
            onClick={() => toggleWeekSelection(week)}
          >
            {week}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekSelector;
