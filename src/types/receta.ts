export interface Receta {
    id: string;
    paciente_dni: string;
    fecha: string;
    items?: ItemReceta[];
}

export interface ItemReceta {
    id: string;
    receta_id: string;
    medicamento_nombre: string;
    dias: number;
    frecuencia_horas: number;
    entregado?: boolean;
}
