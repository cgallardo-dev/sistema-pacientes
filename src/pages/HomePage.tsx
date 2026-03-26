
import Agenda from '../components/Agenda';
import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { getPatientColor } from '../utils/colors';

function HomePage() {
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        async function fetchTratamientos() {
            const { data, error } = await supabase
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
                `);

            if (error) console.error(error);
            if (data) {
                const formattedEvents = data.map((t: any) => ({
                    title: `${t.pacientes?.nombre || 'Sin nombre'} ${t.pacientes?.apellido || ''} - ${t.tipo === 'ozonoterapia' ? 'Ozono' : 'Láser'}`,
                    start: t.fecha_hora.replace('Z', '').split('+')[0],
                    allDay: false,
                    color: getPatientColor(t.paciente_dni || t.id)
                }));
                setEvents(formattedEvents);
            }
        }
        fetchTratamientos();
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 p-6 text-slate-100">
            <h1 className="text-3xl font-bold mb-6 text-white">Agenda Semanal</h1>
            <div className="md:bg-slate-900 md:p-6 md:rounded-xl md:shadow-lg md:border md:border-slate-800">
                <Agenda events={events} view="dayGridWeek" />
            </div>
        </div>
    );
}
export default HomePage;