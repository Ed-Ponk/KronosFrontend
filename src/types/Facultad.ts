export type DataItem = {
  facultad_id: number;
  nombre: string;
};

export interface TablaFacultadProps {
  setSelectedFacultad: React.Dispatch<React.SetStateAction<DataItem | null>>;
  records: DataItem[];
  fetchData: () => void;
}


export interface FormFacultadProps {
  selectedFacultad: DataItem | null;
  setSelectedFacultad: React.Dispatch<React.SetStateAction<DataItem | null>>;
  fetchData: () => void;
}