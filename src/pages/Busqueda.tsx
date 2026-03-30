import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import type { Paciente } from '../types/paciente';
import { Search, User, ChevronRight } from 'lucide-react';

function Busqueda() {
    const [query, setQuery] = useState('');
    const [resultados, setResultados] = useState<Paciente[]>([]);
    const [buscando, setBuscando] = useState(false);
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setBuscando(true);
        setBusquedaRealizada(true);
        
        try {
            // Buscamos coincidencias tanto en nombre como en apellido
            const { data, error } = await supabase
                .from('pacientes')
                .select('*')
                .or(`nombre.ilike.%${query}%,apellido.ilike.%${query}%`)
                .order('nombre');

            if (error) throw error;
            setResultados(data as Paciente[] || []);
        } catch (error) {
            console.error('Error buscando pacientes:', error);
            setResultados([]);
        } finally {
            setBuscando(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950">
            <div className="max-w-4xl mx-auto px-6 py-20">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-white mb-4">
                        Búsqueda de Pacientes
                    </h1>
                    <p className="text-xl text-slate-400 mb-8">
                        Ingresa el nombre o apellido del paciente para buscar
                    </p>
                    
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 justify-center items-center">
                        <div className="relative w-full md:w-2/3">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                placeholder="Ej: Carlos, Gómez..."
                                className="w-full pl-12 pr-4 py-4 rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent text-lg transition-all shadow-inner"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={buscando || !query.trim()}
                            className="w-full md:w-auto bg-cyan-400 text-slate-950 px-8 py-4 rounded-lg text-lg font-bold hover:bg-cyan-300 transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {buscando ? (
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-950"></div>
                            ) : (
                                <>Buscar</>
                            )}
                        </button>   
                    </form>
                </div>

                {/* Resultados de Búsqueda */}
                <div className="mt-8 space-y-4">
                    {buscando ? (
                        <div className="text-center text-slate-400 py-8 font-medium">Buscando pacientes...</div>
                    ) : busquedaRealizada && resultados.length === 0 ? (
                        <div className="text-center text-slate-400 py-12 bg-slate-900/50 rounded-xl border border-slate-800 font-medium">
                            No se encontraron pacientes con ese nombre.
                        </div>
                    ) : busquedaRealizada && resultados.length > 0 ? (
                        <div className="grid gap-4">
                            <h2 className="text-cyan-400 font-bold text-lg mb-2">Se encontraron {resultados.length} resultados:</h2>
                            {resultados.map((paciente) => (
                                <div 
                                    key={paciente.dni}
                                    onClick={() => navigate(`/pacientes/${paciente.dni}`)}
                                    className="bg-slate-900 border border-slate-800 p-6 rounded-xl hover:border-cyan-400 transition-all cursor-pointer group flex items-center justify-between shadow-lg"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="p-3 bg-slate-800 rounded-full text-cyan-400 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-colors">
                                            <User size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                                                {paciente.nombre} {paciente.apellido}
                                            </h3>
                                            <div className="text-slate-400 text-sm mt-2 flex gap-4">
                                                <span className="bg-slate-800 px-3 py-1 rounded-md">DNI: <strong className="text-slate-200">{paciente.dni}</strong></span>
                                                {paciente.diagnostico && (
                                                    <span className="bg-rose-950/30 text-rose-300 px-3 py-1 rounded-md border border-rose-900/50">Afección: <strong className="text-rose-400">{paciente.diagnostico}</strong></span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight className="text-slate-600 group-hover:text-cyan-400 transition-colors" size={28} />
                                </div>
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
export default Busqueda;
