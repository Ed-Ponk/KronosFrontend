export type DataSemestre = {
  semestre_id: number;
  nombre_semestres: string;
  fecha_fin?: string | null;
  fecha_inicio?: string | null;
  vigente?: string | null;
}

export interface DataSemestreResponse {
  status: boolean;
  data: DataSemestre;
}
