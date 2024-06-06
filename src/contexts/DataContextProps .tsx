import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext<any>(null);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [asignaciones, setAsignaciones] = useState<any[]>([]);

  return (
    <DataContext.Provider value={{ asignaciones, setAsignaciones }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  return useContext(DataContext);
};