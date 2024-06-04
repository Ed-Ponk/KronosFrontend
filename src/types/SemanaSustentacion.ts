
export type DataItem = {
    rango_fecha_sustentacion_id: number;
    tipo_sustentacion: {
        id: number; //0: parcial y 1: final
        name: string;
    };
    semanas: string;
    fecha_fin: string;
    fecha_inicio: string;
    duracion_sustentacion: number;
    compensacion_docente: {
        id: number; //0: no, 1: si
        name: string;
    };
    escuela_curso_id: {
        id: number;
        escuela: {
            id: number;
            name: string;
        };
        curso: {
            id: number;
            name: string;
        };
    }

};