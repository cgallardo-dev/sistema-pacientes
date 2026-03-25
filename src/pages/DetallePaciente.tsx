import { useParams, Link } from "react-router-dom";
import type { Paciente } from "../types/paciente";

function DetallePaciente({ pacientes }: { pacientes: Paciente[] }) {
    const { id } = useParams();
    const paciente = pacientes.find((p) => p.dni === id);

    return (
        <div className="min-h-screen bg-slate-950 p-6">
            <div className="bg-slate-900 p-6 rounded-lg shadow-lg border border-slate-800 max-w-4xl mx-auto mt-8 text-white">
                <h1 className="text-2xl font-bold mb-4">Detalle del Paciente</h1>
                <div className="mb-6 space-y-2">
                    <p className="text-slate-300"><strong>DNI:</strong> {id}</p>
                    <p className="text-slate-300"><strong>Nombre:</strong> {paciente?.nombre} {paciente?.apellido}</p>
                </div>

                <div className="space-y-4 border-t border-slate-700 pt-6">
                    <h2 className="text-xl font-bold text-white">Registrar Tratamientos</h2>
                    <div className="flex gap-4">
                        <Link 
                            to={`/ozonoterapia/${id}`}
                            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Registrar Ozonoterapia
                        </Link>
                        <Link 
                            to={`/laser/${id}`}
                            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Registrar Láser
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default DetallePaciente;

