import { supabase } from '../supabase';
import type { Receta, ItemReceta } from '../types/receta';
import { registrarMovimiento } from './movimientosService';

export async function getRecetas(pacienteDni: string): Promise<Receta[]> {
    const { data, error } = await supabase
        .from('recetas')
        .select(`
            *,
            items:items_receta(*)
        `)
        .eq('paciente_dni', pacienteDni)
        .order('fecha', { ascending: false });

    if (error) {
        console.error('Error fetching recetas:', error);
        throw error;
    }
    return data as Receta[];
}

export async function crearReceta(
    pacienteDni: string, 
    items: Omit<ItemReceta, 'id' | 'receta_id'>[]
): Promise<Receta> {
    // 1. Crear receta
    const { data: receta, error: errorReceta } = await supabase
        .from('recetas')
        .insert([{ paciente_dni: pacienteDni, fecha: new Date().toISOString() }])
        .select()
        .single();

    if (errorReceta) {
        console.error('Error creating receta:', errorReceta);
        throw errorReceta;
    }

    // 2. Crear items
    if (items.length > 0) {
        const itemsToInsert = items.map(item => ({
            ...item,
            receta_id: receta.id
        }));

        const { error: errorItems } = await supabase
            .from('items_receta')
            .insert(itemsToInsert);

        if (errorItems) {
            console.error('Error creating items_receta:', errorItems);
            throw errorItems;
        }
    }

    return {
        ...receta,
        items: items as ItemReceta[]
    } as Receta;
}

export async function marcarItemEntregado(
    itemId: string,
    medicamentoId: string,
    cantidad: number,
    pacienteDni: string
): Promise<void> {
    // 1. Registrar salida en inventario
    await registrarMovimiento({
        medicamento_id: medicamentoId,
        tipo: 'SALIDA',
        cantidad: cantidad,
        paciente_dni: pacienteDni
    });

    // 2. Marcar el item como entregado en la receta
    const { error } = await supabase
        .from('items_receta')
        .update({ entregado: true })
        .eq('id', itemId);

    if (error) {
        console.error('Error actualizando item_receta a entregado:', error);
        throw error;
    }
}
