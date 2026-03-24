
import Agenda from '../components/Agenda';
import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

function HomePage() {
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

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Agenda Semanal</h1>
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <Agenda events={events} view="timeGridWeek" />
            </div>
        </div>
    );
}
export default HomePage;