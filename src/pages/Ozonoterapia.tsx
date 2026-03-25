import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import Agenda from "../components/Agenda";
import { getPatientColor } from "../utils/colors";

function Ozonoterapia() {
    const { id } = useParams();
    const [events, setEvents] = useState<any[]>([]);
    const [fechas, setFechas] = useState([{ date: '', time: '09:00' }, { date: '', time: '09:00' }, { date: '', time: '09:00' }]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function fetchTratamientos() {
            const { data } = await supabase
                .from('tratamientos')
                .select(`
                    id, 
                    fecha_hora, 
                    tipo, 
                    paciente_dni,
                    pacientes (
                        nombre, 
                        apellido
                    )
                `)
                .eq('tipo', 'ozonoterapia');
            if (data) {
                setEvents(data.map((t: any) => ({ 
                    title: `${t.pacientes?.nombre || ''} ${t.pacientes?.apellido || ''} - Ozono`, 
                    start: t.fecha_hora.replace('Z', '').split('+')[0], 
                    allDay: false,
                    color: getPatientColor(t.paciente_dni)
                })));
            }

        }
        fetchTratamientos();
    }, []);

    async function registrarTratamientos() {
        if (isSubmitting) return;
        setIsSubmitting(true);
        const insertData = fechas.map(f => ({
            paciente_dni: id,
            tipo: 'ozonoterapia',
            fecha_hora: `${f.date}T${f.time}:00`
        }));
        const { error } = await supabase.from('tratamientos').insert(insertData);
        setIsSubmitting(false);
        if (error) alert('Error');
        else {
            alert('Registrado');
            window.location.reload();
        }
    }

    return (
        <div className="p-6 min-h-screen bg-slate-950 text-slate-100">
            <h1 className="text-2xl font-bold mb-4">Ozonoterapia para Paciente {id}</h1>
            <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800">
                <Agenda events={events} view="dayGridWeek" />
            </div>
            <div className="mt-6 space-y-4 bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800">
                {fechas.map((_, i) => (
                    <div key={i} className="flex gap-4">
                        <input type="date" className="p-2 border border-slate-700 bg-slate-800 rounded text-slate-100" onChange={(e) => {
                            const newFechas = [...fechas];
                            newFechas[i].date = e.target.value;
                            setFechas(newFechas);
                        }} />
                        <input type="time" className="p-2 border border-slate-700 bg-slate-800 rounded text-slate-100" onChange={(e) => {
                            const newFechas = [...fechas];
                            newFechas[i].time = e.target.value;
                            setFechas(newFechas);
                        }} />
                    </div>
                ))}
                <button onClick={registrarTratamientos} disabled={isSubmitting} className={`bg-blue-600 text-white p-2 rounded hover:bg-blue-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {isSubmitting ? 'Guardando...' : 'Guardar 3 Fechas'}
                </button>
            </div>
        </div>
    );
}
export default Ozonoterapia;
