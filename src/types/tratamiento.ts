export interface Tratamiento {
    id: string;
    paciente_dni: string;
    tipo: 'ozonoterapia' | 'laser';
    fecha_hora: Date;
    dias_semana: string[];
}
