interface Jurado_Semestre {
    jurado_id?: number;
    nombre_completo?: string;
    email?: string;
    telefono?: string;
    semestre?: string;
    dedicacion?: string;
    hora_asesoria_semanal?: string;
}
  
export interface JuradoList {
    Jurado_Semestre: Jurado_Semestre[];
}
  

export interface Jurado_SemestreList {
    Jurado_Semestre: Jurado_SemestreList[];
}