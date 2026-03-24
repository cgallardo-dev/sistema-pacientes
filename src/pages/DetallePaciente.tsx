import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type { Paciente } from "../types/paciente";
import { supabase } from "../supabase";
import Agenda from "../components/Agenda";

function DetallePaciente({ pacientes }: { pacientes: Paciente[] }) {
    const { id } = useParams();
    const paciente = pacientes.find((p) => p.dni === id);
    const [tipo, setTipo] = useState<'ozonoterapia' | 'laser'>('ozonoterapia');
    const [fechaHora, setFechaHora] = useState('');
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        async function fetchTratamientos() {
            const { data, error } = await supabase
                .from('tratamientos')
                .select('id, fecha_hora, tipo');

            if (error) console.error(error);
            if (data) {
                const formattedEvents = data.map(t => ({
                    title: t.tipo === 'ozonoterapia' ? 'Ozono' : 'Láser',
                    start: t.fecha_hora,
                    allDay: false
                }));
                setEvents(formattedEvents);
            }
        }
        fetchTratamientos();
    }, []);

    async function agregarTratamiento() {
        if (!fechaHora) return alert('Seleccione una fecha y hora desde el calendario');
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
        <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-4">Detalle del Paciente</h1>
            <div className="mb-6 space-y-2">
                <p className="text-gray-700"><strong>DNI:</strong> {id}</p>
                <p className="text-gray-700"><strong>Nombre:</strong> {paciente?.nombre} {paciente?.apellido}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-6">
                <div>
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
                        <div className="p-2 border rounded bg-gray-50 text-sm">
                            <strong>Fecha seleccionada:</strong> {fechaHora || 'Ninguna'}
                        </div>
                        <button 
                            onClick={agregarTratamiento}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                        >
                            Guardar Tratamiento
                        </button>
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-4">Disponibilidad</h2>
                    <Agenda 
                        events={events} 
                        view="timeGridWeek" 
                        onDateClick={(info) => setFechaHora(info.dateStr)}
                    />
                </div>
            </div>
        </div>
    );
}
export default DetallePaciente;
