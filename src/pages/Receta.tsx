import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecetas, crearReceta, marcarItemEntregado } from '../utils/recetasService';
import { getMedicamentos } from '../utils/medicamentosService';
import { getPaciente } from '../utils/pacientesService';
import { generarPDFReceta } from '../utils/pdfGenerator';
import type { Receta, ItemReceta } from '../types/receta';
import type { Medicamento } from '../types/medicamento';
import type { Paciente } from '../types/paciente';
import { Calendar, Clock, Plus, Save, Pill, ArrowLeft, Download, PackageOpen } from 'lucide-react';

export default function RecetaPage() {
    const { id: dni } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [paciente, setPaciente] = useState<Paciente | null>(null);
    const [recetas, setRecetas] = useState<Receta[]>([]);
    const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Formulario temporal
    const [tempItems, setTempItems] = useState<Omit<ItemReceta, 'id' | 'receta_id'>[]>([]);
    const [medicamentoNombre, setMedicamentoNombre] = useState('');
    const [isOtroMedicamento, setIsOtroMedicamento] = useState(false);
    const [dias, setDias] = useState<number | ''>('');
    const [frecuenciaHoras, setFrecuenciaHoras] = useState<number | ''>('');

    // Modal de entrega
    const [showDeliveryModal, setShowDeliveryModal] = useState(false);
    const [deliveryItem, setDeliveryItem] = useState<ItemReceta | null>(null);
    const [deliveryMedId, setDeliveryMedId] = useState('');
    const [deliveryCantidad, setDeliveryCantidad] = useState<number | ''>(1);
    const [isDelivering, setIsDelivering] = useState(false);

    useEffect(() => {
        if (!dni) return;
        
        async function loadData() {
            try {
                const [pacienteResult, recetasResult, medicamentosResult] = await Promise.allSettled([
                    getPaciente(dni!),
                    getRecetas(dni!),
                    getMedicamentos()
                ]);
                
                if (pacienteResult.status === 'fulfilled') {
                    setPaciente(pacienteResult.value);
                }

                if (recetasResult.status === 'fulfilled') {
                    setRecetas(recetasResult.value);
                }

                if (medicamentosResult.status === 'fulfilled') {
                    setMedicamentos(medicamentosResult.value);
                }
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, [dni]);

    const handleAddItem = () => {
        if (!medicamentoNombre.trim() || !dias || !frecuenciaHoras) {
            alert("Completa todos los campos para agregar un ítem.");
            return;
        }

        const newItem: Omit<ItemReceta, 'id' | 'receta_id'> = {
            medicamento_nombre: medicamentoNombre.trim(),
            dias: Number(dias),
            frecuencia_horas: Number(frecuenciaHoras),
        };

        setTempItems([...tempItems, newItem]);
        
        // Reset form
        setMedicamentoNombre('');
        setDias('');
        setFrecuenciaHoras('');
    };

    const handleRemoveTempItem = (index: number) => {
        const newItems = [...tempItems];
        newItems.splice(index, 1);
        setTempItems(newItems);
    };

    const handleSaveReceta = async () => {
        if (!dni) return;
        if (tempItems.length === 0) {
            alert("Agrega al menos un medicamento a la receta.");
            return;
        }

        setIsSaving(true);
        try {
            const nuevaReceta = await crearReceta(dni, tempItems);
            
            if (paciente) {
                generarPDFReceta(paciente, nuevaReceta, tempItems);
            }
            
            // Reload recetas
            const recetasData = await getRecetas(dni);
            setRecetas(recetasData);
            setTempItems([]); // Clear draft
            alert("Receta guardada exitosamente y PDF generado.");
        } catch (error) {
            console.error("Error saving receta", error);
            alert("Ocurrió un error al guardar la receta.");
        } finally {
            setIsSaving(false);
        }
    };

    const normalizeString = (str: string) => {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim()
            .toLowerCase();
    };

    const handleOpenDeliveryModal = (item: ItemReceta) => {
        const medMatch = medicamentos.find(m => normalizeString(m.nombre) === normalizeString(item.medicamento_nombre));
        
        if (!medMatch) {
            alert(`El medicamento "${item.medicamento_nombre}" no existe en tu inventario. Solo puedes entregar medicamentos registrados en el sistema.`);
            return;
        }

        setDeliveryItem(item);
        setDeliveryMedId(medMatch.id);
        setDeliveryCantidad(1);
        setShowDeliveryModal(true);
    };

    const handleConfirmDelivery = async () => {
        if (!deliveryItem || !deliveryMedId || !deliveryCantidad || !dni || isDelivering) return;
        
        setIsDelivering(true);
        try {
            await marcarItemEntregado(deliveryItem.id, deliveryMedId, Number(deliveryCantidad), dni);
            setShowDeliveryModal(false);
            const recetasData = await getRecetas(dni);
            setRecetas(recetasData);
            alert('Medicamento entregado y stock actualizado correctamente.');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            alert(errorMessage || 'Error al entregar el medicamento.');
        } finally {
            setIsDelivering(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-6 relative">
            <div className="flex items-center gap-4 mb-8">
                <button 
                    onClick={() => navigate(`/pacientes/${dni}`)}
                    className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-slate-300 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-4xl font-bold text-white">
                    Recetas del Paciente <span className="text-cyan-400">{dni}</span>
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Sección 1: Lista de Recetas Existentes */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">Historial de Recetas</h2>
                    
                    {recetas.length === 0 ? (
                        <div className="bg-slate-900/50 rounded-xl p-8 text-center border border-slate-800">
                            <Pill className="mx-auto h-12 w-12 text-slate-500 mb-3" />
                            <p className="text-slate-400">No hay recetas registradas para este paciente.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recetas.map(receta => (
                                <div key={receta.id} className="bg-slate-900 rounded-xl p-5 border border-slate-800 hover:border-slate-700 transition-colors">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center text-cyan-400 font-medium">
                                            <Calendar size={18} className="mr-2" />
                                            {new Date(receta.fecha).toLocaleDateString('es-AR', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-500 font-mono">ID: {receta.id.split('-')[0]}</span>
                                            {paciente && (
                                                <button
                                                    onClick={() => generarPDFReceta(paciente, receta, receta.items || [])}
                                                    className="flex items-center gap-1 text-xs text-cyan-400 border border-cyan-400/50 px-2 py-1 rounded hover:bg-cyan-400/10 hover:border-cyan-400 transition-colors"
                                                >
                                                    <Download size={14} /> PDF
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        {receta.items && receta.items.length > 0 ? (
                                            receta.items.map(item => (
                                                <div key={item.id} className="bg-slate-950/50 rounded-lg p-3 flex justify-between items-center text-sm border border-slate-800/50">
                                                    <div>
                                                        <span className="font-semibold text-slate-200 block mb-1">💊 {item.medicamento_nombre}</span>
                                                        <div className="flex items-center gap-4 text-slate-400">
                                                            <span className="flex items-center"><Clock size={14} className="mr-1" /> cada {item.frecuencia_horas}h</span>
                                                            <span className="flex items-center bg-slate-800 px-2 py-1 rounded text-xs">{item.dias} días</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {!item.entregado ? (
                                                            <button
                                                                onClick={() => handleOpenDeliveryModal(item)}
                                                                className="text-xs flex items-center gap-1 bg-cyan-900/30 text-cyan-400 border border-cyan-800 px-2 py-1 rounded hover:bg-cyan-900/50 transition-colors shadow-[0_0_8px_rgba(34,211,238,0.1)]"
                                                            >
                                                                <PackageOpen size={14} /> Entregar
                                                            </button>
                                                        ) : (
                                                            <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded border border-green-400/20">
                                                                ✓ Entregado
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-slate-500 italic">Sin ítems registrados.</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sección 2: Nueva Receta */}
                <div>
                    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 sticky top-6 shadow-xl">
                        <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2 mb-6 flex items-center gap-2">
                            <Plus size={24} className="text-cyan-400" /> Nueva Receta
                        </h2>

                        {/* Formulario de Agregar Item */}
                        <div className="space-y-4 mb-6 bg-slate-950 p-4 rounded-lg border border-slate-800">
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-slate-400">Medicamento</label>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setIsOtroMedicamento(!isOtroMedicamento);
                                            setMedicamentoNombre('');
                                        }}
                                        className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                                    >
                                        {isOtroMedicamento ? 'Elegir del inventario' : 'Ingresar externo'}
                                    </button>
                                </div>
                                {isOtroMedicamento ? (
                                    <input
                                        type="text"
                                        value={medicamentoNombre}
                                        onChange={(e) => setMedicamentoNombre(e.target.value)}
                                        placeholder="Escribe el nombre del medicamento"
                                        className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all"
                                    />
                                ) : (
                                    <select
                                        value={medicamentoNombre}
                                        onChange={(e) => setMedicamentoNombre(e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all"
                                    >
                                        <option value="" disabled>-- Selecciona un medicamento --</option>
                                        {medicamentos.map(med => (
                                            <option key={med.id} value={med.nombre}>
                                                {med.nombre} (Stock actual: {med.stockAct})
                                            </option>
                                        ))}
                                    </select>
                                )}
                                {!isOtroMedicamento && <p className="text-xs text-slate-500 mt-1.5 italic">Aviso: Recetarlo no descontará stock automáticamente.</p>}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Días de uso</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={dias}
                                        onChange={(e) => setDias(e.target.value ? Number(e.target.value) : '')}
                                        placeholder="Ej: 7"
                                        className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Frecuencia (horas)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={frecuenciaHoras}
                                        onChange={(e) => setFrecuenciaHoras(e.target.value ? Number(e.target.value) : '')}
                                        placeholder="Ej: 8"
                                        className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleAddItem}
                                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium px-4 py-2.5 rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-2 mt-2"
                            >
                                <Plus size={18} /> Agregar Medicamento a la Receta
                            </button>
                        </div>

                        {/* Items Temporales */}
                        {tempItems.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Medicamentos en la receta</h3>
                                <div className="space-y-2">
                                    {tempItems.map((item, idx) => (
                                        <div key={idx} className="bg-slate-800/50 rounded-lg p-3 flex justify-between items-center border border-cyan-900/30">
                                            <div>
                                                <p className="font-medium text-white">{item.medicamento_nombre}</p>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    Tomar cada <strong className="text-cyan-400">{item.frecuencia_horas}h</strong> durante <strong className="text-cyan-400">{item.dias} días</strong>
                                                </p>
                                            </div>
                                            <button 
                                                onClick={() => handleRemoveTempItem(idx)}
                                                className="text-red-400 hover:text-red-300 p-1 bg-red-400/10 rounded hover:bg-red-400/20 transition-colors"
                                                title="Eliminar"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleSaveReceta}
                            disabled={isSaving || tempItems.length === 0}
                            className={`w-full flex items-center justify-center gap-2 ${tempItems.length === 0 ? 'opacity-50 cursor-not-allowed bg-slate-700 text-slate-400' : 'bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.4)]'} font-bold px-4 py-3 rounded-lg transition-all text-lg`}
                        >
                            {isSaving ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-950"></div>
                            ) : (
                                <Save size={20} />
                            )}
                            Guardar Receta
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de Entrega */}
            {showDeliveryModal && deliveryItem && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 max-w-md w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">Entregar Medicamento</h3>
                        <p className="text-sm text-slate-300 mb-4">
                            Receta indica: <strong className="text-cyan-400">{deliveryItem.medicamento_nombre}</strong>
                        </p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Medicamento a entregar</label>
                                <div className="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-slate-700 font-semibold flex justify-between items-center">
                                    <span>{deliveryItem.medicamento_nombre}</span>
                                    {medicamentos.find(m => m.id === deliveryMedId) && (
                                        <span className="text-xs font-normal text-cyan-400">
                                            Stock: {medicamentos.find(m => m.id === deliveryMedId)?.stockAct}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-500 mt-2">
                                    Este medicamento fue emparejado automáticamente con tu inventario.
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Cantidad a entregar</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={deliveryCantidad}
                                    onChange={(e) => setDeliveryCantidad(e.target.value ? Number(e.target.value) : '')}
                                    disabled={isDelivering}
                                    className="w-full px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-cyan-400 outline-none transition-colors disabled:opacity-50"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                onClick={() => setShowDeliveryModal(false)}
                                disabled={isDelivering}
                                className="px-4 py-2 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmDelivery}
                                disabled={!deliveryMedId || !deliveryCantidad || isDelivering}
                                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-[0_0_10px_rgba(34,211,238,0.3)] flex items-center gap-2"
                            >
                                {isDelivering ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-950"></div>
                                        Procesando...
                                    </>
                                ) : (
                                    "Confirmar Entrega"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
