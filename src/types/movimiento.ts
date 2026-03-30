export interface MovimientoInventario {
    id: string;
    medicamento_id: string;
    tipo: 'ENTRADA' | 'SALIDA';
    cantidad: number;
    fecha: string;
    paciente_dni?: string;
}
