export interface Tratamiento {
    id: string;
    paciente_dni: string;
    tipo: 'ozonoterapia' | 'laser';
    fecha_hora: Date;
    fecha_hora_fin?: Date;
    dias_semana: string[];
    completado?: boolean;
}
