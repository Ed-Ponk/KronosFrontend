export type EstudianteFormState = {
    codigo: string;
    nombre_completo: string;
    email: string;
    telefono: string;
    escuela_id: number | string;
    semestre_id: number | string;
    jurado1?: number | string;
    jurado2?: number | string;
    jurado3?: number | string;
    tesis?: string;
    grupo_id?: number | string;
    curso_id?: number | string;
  };