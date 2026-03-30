import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMedicamento } from '../utils/medicamentosService';
import { getMovimientos, registrarMovimiento } from '../utils/movimientosService';
import { getPacientes } from '../utils/pacientesService';
import type { Medicamento } from '../types/medicamento';
import type { MovimientoInventario } from '../types/movimiento';
import type { Paciente } from '../types/paciente';
import { ArrowLeft, PackagePlus, PackageMinus, Clock, AlertTriangle } from 'lucide-react';

export default function MedicamentoDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [medicamento, setMedicamento] = useState<Medicamento | null>(null);
    const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([]);
    const [pacientes, setPacientes] = useState<Pick<Paciente, 'dni' | 'nombre' | 'apellido'>[]>([]);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [showEntradaModal, setShowEntradaModal] = useState(false);
    const [showSalidaModal, setShowSalidaModal] = useState(false);
    
    // Form States
    const [cantidad, setCantidad] = useState<number | ''>('');
    const [pacienteDni, setPacienteDni] = useState<string>('');
    const [formError, setFormError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!id) return;
        
        const loadData = async () => {
            try {
                setLoading(true);
                const [medData, movData, pacData] = await Promise.all([
                    getMedicamento(id),
                    getMovimientos(id),
                    getPacientes()
                ]);
                setMedicamento(medData);
                setMovimientos(movData);
                setPacientes(pacData);
            } catch (err: any) {
                setError(err.message || 'Error cargando datos del medicamento');
            } finally {
                setLoading(false);
            }
        };
        
        loadData();
    }, [id]);

    const handleRegistrar = async (tipo: 'ENTRADA' | 'SALIDA') => {
        if (!id || !cantidad || cantidad <= 0) {
            setFormError('La cantidad debe ser mayor a 0');
            return;
        }
        if (tipo === 'SALIDA' && medicamento && cantidad > medicamento.stockAct) {
            setFormError('Stock insuficiente');
            return;
        }

        try {
            setIsSubmitting(true);
            setFormError(null);
            
            await registrarMovimiento({
                medicamento_id: id,
                tipo,
                cantidad: Number(cantidad),
                paciente_dni: tipo === 'SALIDA' ? pacienteDni || undefined : undefined
            });

            // Reload data
            const [newMedData, newMovData] = await Promise.all([
                getMedicamento(id),
                getMovimientos(id)
            ]);
            setMedicamento(newMedData);
            setMovimientos(newMovData);
            
            // Close modals & reset form
            setShowEntradaModal(false);
            setShowSalidaModal(false);
            setCantidad('');
            setPacienteDni('');
            
        } catch (err: any) {
            setFormError(err.message || 'Error registrando movimiento');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="p-6 text-slate-300">Cargando ficha de medicamento...</div>;
    if (error || !medicamento) return <div className="p-6 text-red-400">Error: {error || 'No encontrado'}</div>;

    const isLowStock = medicamento.stockAct <= medicamento.stockMin;

    return (
        <div className="p-6 max-w-4xl mx-auto text-slate-200">
            <button 
                onClick={() => navigate('/medicamentos')}
                className="flex items-center bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.4)] px-4 py-2 rounded mb-6 transition-all"
            >
                <ArrowLeft size={20} className="mr-2" />
                Volver a medicamentos
            </button>

            {/* Ficha de Medicamento */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">{medicamento.nombre}</h1>
                        <div className="flex items-center text-slate-400">
                            <Clock size={16} className="mr-2" />
                            <span>Vence: {new Date(medicamento.fechaVencimiento).toLocaleDateString()}</span>
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setShowEntradaModal(true)}
                            className="flex items-center px-4 py-2 bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.4)] rounded-lg transition-all"
                        >
                            <PackagePlus size={18} className="mr-2" />
                            Entrada
                        </button>
                        <button 
                            onClick={() => setShowSalidaModal(true)}
                            className="flex items-center px-4 py-2 bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.4)] rounded-lg transition-all"
                        >
                            <PackageMinus size={18} className="mr-2" />
                            Salida
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-lg border ${isLowStock ? 'bg-rose-950/30 border-rose-900' : 'bg-slate-800/50 border-slate-700'}`}>
                        <div className="text-sm text-slate-400 mb-1 flex items-center">
                            Stock Actual
                            {isLowStock && <AlertTriangle size={14} className="ml-2 text-rose-500" />}
                        </div>
                        <div className={`text-3xl font-bold ${isLowStock ? 'text-rose-400' : 'text-white'}`}>
                            {medicamento.stockAct}
                        </div>
                    </div>
                    <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                        <div className="text-sm text-slate-400 mb-1">Stock Mínimo</div>
                        <div className="text-3xl font-bold text-slate-300">
                            {medicamento.stockMin}
                        </div>
                    </div>
                </div>
            </div>

            {/* Historial de Movimientos */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white">Historial de Inventario</h2>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-800/50 text-slate-400 text-sm">
                                <th className="p-4 font-medium">Fecha</th>
                                <th className="p-4 font-medium">Tipo</th>
                                <th className="p-4 font-medium">Cantidad</th>
                                <th className="p-4 font-medium">Paciente (DNI)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {movimientos.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-500">
                                        No hay movimientos registrados.
                                    </td>
                                </tr>
                            ) : (
                                movimientos.map((mov) => (
                                    <tr key={mov.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="p-4 text-slate-300 whitespace-nowrap">
                                            {new Date(mov.fecha).toLocaleString()}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                                mov.tipo === 'ENTRADA' 
                                                    ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50' 
                                                    : 'bg-rose-950/30 text-rose-400 border-rose-900/50'
                                            }`}>
                                                {mov.tipo}
                                            </span>
                                        </td>
                                        <td className="p-4 font-mono font-medium text-slate-200">
                                            {mov.tipo === 'ENTRADA' ? '+' : '-'}{mov.cantidad}
                                        </td>
                                        <td className="p-4 text-slate-400">
                                            {mov.paciente_dni || '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals for actions */}
            {(showEntradaModal || showSalidaModal) && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md overflow-hidden shadow-xl">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-white mb-4">
                                Registrar {showEntradaModal ? 'Entrada' : 'Salida'}
                            </h3>
                            
                            {formError && (
                                <div className="mb-4 p-3 bg-rose-950/50 border border-rose-900 text-rose-400 text-sm rounded-lg">
                                    {formError}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Cantidad</label>
                                    <input 
                                        type="number" 
                                        min="1"
                                        value={cantidad}
                                        onChange={(e) => setCantidad(e.target.value === '' ? '' : Number(e.target.value))}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Ej: 50"
                                    />
                                </div>
                                
                                {showSalidaModal && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Paciente (Opcional)</label>
                                        <select
                                            value={pacienteDni}
                                            onChange={(e) => setPacienteDni(e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        >
                                            <option value="">Seleccionar paciente...</option>
                                            {pacientes.map(p => (
                                                <option key={p.dni} value={p.dni}>
                                                    {p.nombre} {p.apellido} ({p.dni})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="bg-slate-800/50 p-4 border-t border-slate-800 flex justify-end gap-3">
                            <button 
                                onClick={() => {
                                    setShowEntradaModal(false);
                                    setShowSalidaModal(false);
                                    setFormError(null);
                                    setCantidad('');
                                    setPacienteDni('');
                                }}
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.4)] rounded transition-all"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={() => handleRegistrar(showEntradaModal ? 'ENTRADA' : 'SALIDA')}
                                disabled={isSubmitting}
                                className={`px-4 py-2 bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.4)] rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {isSubmitting ? 'Guardando...' : 'Confirmar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
