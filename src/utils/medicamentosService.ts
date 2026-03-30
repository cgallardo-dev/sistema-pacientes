import { supabase } from '../supabase';
import type { Medicamento } from '../types/medicamento';

export async function getMedicamentos(): Promise<Medicamento[]> {
    const { data, error } = await supabase
        .from('medicamentos')
        .select('*')
        .order('nombre');

    if (error) {
        console.error('Error fetching medicamentos:', error);
        throw error;
    }
    return data as Medicamento[];
}

export async function getMedicamento(id: string): Promise<Medicamento> {
    const { data, error } = await supabase
        .from('medicamentos')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error(`Error fetching medicamento con id ${id}:`, error);
        throw error;
    }
    return data as Medicamento;
}

export async function crearMedicamento(medicamento: Omit<Medicamento, 'id'>): Promise<Medicamento> {
    const { data, error } = await supabase
        .from('medicamentos')
        .insert([medicamento])
        .select()
        .single();

    if (error) {
        console.error('Error creating medicamento:', error);
        throw error;
    }
    return data as Medicamento;
}
