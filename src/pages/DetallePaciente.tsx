import { useParams } from "react-router-dom";
import { useState } from "react";
import type { Paciente } from "../types/paciente";
import { supabase } from "../supabase";

function DetallePaciente({ pacientes }: { pacientes: Paciente[] }) {
    const { id } = useParams();
    const paciente = pacientes.find((p) => p.dni === id);
    const [tipo, setTipo] = useState<'ozonoterapia' | 'laser'>('ozonoterapia');
    const [fechaHora, setFechaHora] = useState('');

    if (!paciente) {
        return <div className="p-4">Paciente no encontrado</div>;
    }

    async function agregarTratamiento() {
        if (!fechaHora) return alert('Seleccione una fecha y hora');
        const { error } = await supabase
            .from('tratamientos')
            .insert({ paciente_dni: id, tipo, fecha_hora: fechaHora });

        if (error) {
            console.error(error);
            alert('Error al guardar el tratamiento');
        } else {
            alert('Tratamiento registrado');
            setFechaHora('');
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-4">Detalle del Paciente</h1>
            <div className="mb-6 space-y-2">
                <p className="text-gray-700"><strong>DNI:</strong> {id}</p>
                <p className="text-gray-700"><strong>Nombre:</strong> {paciente.nombre} {paciente.apellido}</p>
                <p className="text-gray-700"><strong>Edad:</strong> {paciente.edad} años</p>
                <p className="text-gray-700"><strong>Enfermedad:</strong> {paciente.diagnostico}</p>
            </div>

            <div className="border-t pt-6">
                <h2 className="text-xl font-bold mb-4">Registrar Tratamiento</h2>
                <div className="space-y-4">
                    <select 
                        className="w-full p-2 border rounded"
                        value={tipo} 
                        onChange={(e) => setTipo(e.target.value as 'ozonoterapia' | 'laser')}
                    >
                        <option value="ozonoterapia">Ozonoterapia</option>
                        <option value="laser">Láser</option>
                    </select>
                    <input 
                        type="datetime-local" 
                        className="w-full p-2 border rounded"
                        value={fechaHora}
                        onChange={(e) => setFechaHora(e.target.value)}
                    />
                    <button 
                        onClick={agregarTratamiento}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Guardar Tratamiento
                    </button>
                </div>
            </div>
        </div>
    );
}
export default DetallePaciente;
