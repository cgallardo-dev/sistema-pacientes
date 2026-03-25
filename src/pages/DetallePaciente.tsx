import { useParams, Link } from "react-router-dom";
import type { Paciente } from "../types/paciente";

function DetallePaciente({ pacientes }: { pacientes: Paciente[] }) {
    const { id } = useParams();
    const paciente = pacientes.find((p) => p.dni === id);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-4">Detalle del Paciente</h1>
            <div className="mb-6 space-y-2">
                <p className="text-gray-700"><strong>DNI:</strong> {id}</p>
                <p className="text-gray-700"><strong>Nombre:</strong> {paciente?.nombre} {paciente?.apellido}</p>
            </div>

            <div className="space-y-4 border-t pt-6">
                <h2 className="text-xl font-bold">Registrar Tratamientos</h2>
                <div className="flex gap-4">
                    <Link 
                        to={`/ozonoterapia/${id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Registrar Ozonoterapia
                    </Link>
                    <Link 
                        to={`/laser/${id}`}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Registrar Láser
                    </Link>
                </div>
            </div>
        </div>
    );
}
export default DetallePaciente;

