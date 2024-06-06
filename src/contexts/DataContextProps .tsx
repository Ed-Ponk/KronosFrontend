import React, { createContext, useState, ReactNode, useContext } from 'react';

interface DataContextProps {
  asignaciones: any[];
  setAsignaciones: (data: any[]) => void;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [asignaciones, setAsignaciones] = useState<any[]>([]);

  return (
    <DataContext.Provider value={{ asignaciones, setAsignaciones }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData debe estar dentro de un DataProvider');
  }
  return context;
};
