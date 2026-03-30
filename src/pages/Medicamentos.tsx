import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Medicamento } from '../types/medicamento';
import { getMedicamentos, crearMedicamento } from '../utils/medicamentosService';
import { Pill, AlertTriangle, Plus, X } from 'lucide-react';

function Medicamentos() {
    const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Form state
    const [nombre, setNombre] = useState('');
    const [stockAct, setStockAct] = useState<number | ''>('');
    const [stockMin, setStockMin] = useState<number | ''>('');
    const [fechaVencimiento, setFechaVencimiento] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadMedicamentos = () => {
        setLoading(true);
        getMedicamentos()
            .then(setMedicamentos)
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadMedicamentos();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre || stockAct === '' || stockMin === '' || !fechaVencimiento) return;
        
        setIsSubmitting(true);
        try {
            await crearMedicamento({
                nombre,
                stockAct: Number(stockAct),
                stockMin: Number(stockMin),
                fechaVencimiento
            });
            setIsModalOpen(false);
            setNombre('');
            setStockAct('');
            setStockMin('');
            setFechaVencimiento('');
            loadMedicamentos();
        } catch (error) {
            console.error('Error creating medicamento:', error);
            // Handle error state if needed
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="p-6 text-slate-300">Cargando medicamentos...</div>;

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto text-slate-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Inventario de Medicamentos</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full sm:w-auto bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.4)] px-4 py-3 sm:py-2 rounded-lg flex justify-center items-center gap-2 transition-all"
                >
                    <Plus size={20} />
                    Nuevo Medicamento
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {medicamentos.map(med => (
                    <Link key={med.id} to={`/medicamentos/${med.id}`}>
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded-lg hover:border-blue-500 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg group-hover:bg-blue-500/20">
                                    <Pill size={24} />
                                </div>
                                <h2 className="text-xl font-semibold text-white truncate" title={med.nombre}>{med.nombre}</h2>
                            </div>
                            
                            <div className="space-y-2 text-slate-400">
                                <div className="flex justify-between items-center">
                                    <span>Stock Actual:</span>
                                    <span className={`font-mono font-medium ${med.stockAct <= med.stockMin ? 'text-red-400' : 'text-slate-200'}`}>
                                        {med.stockAct}
                                    </span>
                                </div>
                                {med.stockAct <= med.stockMin && (
                                    <div className="flex items-center gap-2 text-sm text-red-400 mt-2">
                                        <AlertTriangle size={16} />
                                        <span>Stock bajo mínimo ({med.stockMin})</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            
            {medicamentos.length === 0 && (
                <div className="text-center py-12 text-slate-400 bg-slate-900/50 rounded-lg border border-slate-800">
                    No hay medicamentos registrados.
                </div>
            )}

            {/* Modal para Nuevo Medicamento */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-800">
                            <h2 className="text-xl font-bold text-white">Nuevo Medicamento</h2>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.4)] p-1 rounded transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Ej. Paracetamol 500mg"
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">
                                        Stock Actual
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={stockAct}
                                        onChange={(e) => setStockAct(e.target.value ? Number(e.target.value) : '')}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">
                                        Stock Mínimo
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={stockMin}
                                        onChange={(e) => setStockMin(e.target.value ? Number(e.target.value) : '')}
                                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">
                                    Fecha de Vencimiento
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={fechaVencimiento}
                                    onChange={(e) => setFechaVencimiento(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    style={{ colorScheme: 'dark' }}
                                />
                            </div>
                            
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.4)] rounded-lg transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2 bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.4)] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all"
                                >
                                    {isSubmitting ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
export default Medicamentos;
