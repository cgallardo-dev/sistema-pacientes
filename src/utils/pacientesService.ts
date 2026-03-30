import { supabase } from '../supabase';
import type { Paciente } from '../types/paciente';

export async function getPacientes(): Promise<Pick<Paciente, 'dni' | 'nombre' | 'apellido'>[]> {
    const { data, error } = await supabase
        .from('pacientes')
        .select('dni, nombre, apellido')
        .order('apellido');

    if (error) {
        console.error('Error fetching pacientes:', error);
        throw error;
    }
    return data;
}

export async function getPaciente(dni: string): Promise<Paciente> {
    const { data, error } = await supabase
        .from('pacientes')
        .select('*')
        .eq('dni', dni)
        .single();

    if (error) {
        console.error('Error fetching paciente:', error);
        throw error;
    }
    return data;
}
