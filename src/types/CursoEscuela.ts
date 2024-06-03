
export type DataCursoEscuela = {
  id: number;
  curso: string;
  escuela: string;
  curso_id:number;
  escuela_id:number;
};

export interface TablaCursoEscuelaProps {
  setSelectedCursoEscuela: React.Dispatch<React.SetStateAction<DataCursoEscuela | null>>;
  records: DataCursoEscuela[];
  fetchData: () => void;
}
