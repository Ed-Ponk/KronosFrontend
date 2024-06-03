export type DataEscuela = {
  escuela_id: number;
  escuela: string;
  facultad?: string;
  facultad_id:number; 
};

export interface TablaEscuelaProps {
  setSelectedEscuela: React.Dispatch<React.SetStateAction<DataEscuela | null>>;
  records: DataEscuela[];
  fetchData: () => void;
}


export interface FormEscuelaProps {
  selectedEscuela: DataEscuela | null;
  setSelectedEscuela: React.Dispatch<React.SetStateAction<DataEscuela | null>>;
  fetchData: () => void;
}