export type DataCurso = {
  curso_id: number;
  curso: string;
  vigente: number;
};

export interface TablaCursoProps {
  setSelectedCurso: React.Dispatch<React.SetStateAction<DataCurso | null>>;
  records: DataCurso[];
  fetchData: () => void;
}


export interface FormCursoProps {
  selectedCurso: DataCurso | null;
  setSelectedCurso: React.Dispatch<React.SetStateAction<DataCurso | null>>;
  fetchData: () => void;
}


