export type DataGrupos = {
  grupo_id: number;
  nombre: string;
};

export interface Option {
    id: number;
    name: string;
};

export interface DataGrupo {
    grupo_curso_id: number;
    curso: Option;
    grupo: Option;
    docente: Option;
    escuela: Option;
    nombre_semestre: Option;
};
