export type DataFacultad = {
  facultad_id: number;
  nombre: string;
};

export interface TablaFacultadProps {
  setSelectedFacultad: React.Dispatch<React.SetStateAction<DataFacultad | null>>;
  records: DataFacultad[];
  fetchData: () => void;
}


export interface FormFacultadProps {
  selectedFacultad: DataFacultad | null;
  setSelectedFacultad: React.Dispatch<React.SetStateAction<DataFacultad | null>>;
  fetchData: () => void;
}