import { supabase } from '../supabase';
import type { MovimientoInventario } from '../types/movimiento';

export async function getMovimientos(medicamentoId: string): Promise<MovimientoInventario[]> {
    const { data, error } = await supabase
        .from('movimientos_inventario')
        .select('*')
        .eq('medicamento_id', medicamentoId)
        .order('fecha', { ascending: false });

    if (error) {
        console.error(`Error fetching movimientos for medicamento ${medicamentoId}:`, error);
        throw error;
    }
    return data as MovimientoInventario[];
}

export async function registrarMovimiento(movimiento: Omit<MovimientoInventario, 'id' | 'fecha'>): Promise<MovimientoInventario> {
    // 1. Fetch current stock to make sure there's enough (if SALIDA)
    const { data: medData, error: medError } = await supabase
        .from('medicamentos')
        .select('stockAct')
        .eq('id', movimiento.medicamento_id)
        .single();
        
    if (medError) throw medError;

    let newStock = medData.stockAct;
    if (movimiento.tipo === 'ENTRADA') {
        newStock += movimiento.cantidad;
    } else if (movimiento.tipo === 'SALIDA') {
        if (newStock < movimiento.cantidad) {
            throw new Error('Stock insuficiente para la salida solicitada.');
        }
        newStock -= movimiento.cantidad;
    }

    // 2. Insert movement
    const { data: insertData, error: insertError } = await supabase
        .from('movimientos_inventario')
        .insert([{
            medicamento_id: movimiento.medicamento_id,
            tipo: movimiento.tipo,
            cantidad: movimiento.cantidad,
            paciente_dni: movimiento.paciente_dni || null,
            fecha: new Date().toISOString()
        }])
        .select()
        .single();

    if (insertError) throw insertError;

    // 3. Update stock
    const { error: updateError } = await supabase
        .from('medicamentos')
        .update({ stockAct: newStock })
        .eq('id', movimiento.medicamento_id);

    if (updateError) {
        // We'd ideally have a rollback here if not using an RPC,
        // but for simplicity in the frontend as requested:
        console.error('Failed to update stock after registering movement', updateError);
        throw updateError;
    }

    return insertData as MovimientoInventario;
}
