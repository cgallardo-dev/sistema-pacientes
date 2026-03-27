import { useParams, Link } from "react-router-dom";
import type { Paciente } from "../types/paciente";

function DetallePaciente({ pacientes }: { pacientes: Paciente[] }) {
    const { id } = useParams();
    const paciente = pacientes.find((p) => p.dni === id);

    return (
        <div className="min-h-screen bg-slate-950 p-6">
            <div className="bg-slate-900 p-6 rounded-lg shadow-lg border border-slate-800 max-w-4xl mx-auto mt-8 text-white">
                <h1 className="text-3xl font-bold mb-6 text-cyan-400">Detalle del Paciente</h1>
                
                <div className="mb-8 p-4 bg-slate-800 rounded-lg border border-slate-700 space-y-3">
                    <p className="text-xl text-slate-300">
                        <strong className="text-white">Nombre:</strong> {paciente?.nombre} {paciente?.apellido}
                    </p>
                    <p className="text-lg text-slate-300">
                        <strong className="text-white">DNI:</strong> {id}
                    </p>
                    <p className="text-lg text-slate-300">
                        <strong className="text-white">Afección:</strong> <span className="text-rose-400 font-semibold">{paciente?.diagnostico || 'No especificada'}</span>
                    </p>
                </div>

                <div className="border-t border-slate-700 pt-8 flex justify-center">
                    <Link 
                        to={`/plan-mensual/${id}`}
                        className="bg-cyan-400 text-slate-950 font-bold px-8 py-4 rounded-xl hover:bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.6)] transition-all duration-300 text-center text-xl w-full md:w-auto"
                    >
                        Crear / Ver Plan Mensual
                    </Link>
                </div>
            </div>
        </div>
    );
}
export default DetallePaciente;
