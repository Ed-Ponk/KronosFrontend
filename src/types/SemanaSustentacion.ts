
export type DataItem = {
    rango_fecha_sustentacion_id: number;
    tipo_sustentacion: {
        valor: number; //0: parcial y 1: final
        nombre: string;
    };
    semanas: string;
    fecha_fin: string;
    fecha_inicio: string;
    duracion_sustentacion: number;
    compensacion_docente: {
        valor: number; //0: no, 1: si
        nombre: string;
    };
    escuela_curso_id: {
        id: number;
        escuela: {
            id: number;
            nombre: string;
        };
        curso: {
            id: number;
            nombre: string;
        };
    }

};