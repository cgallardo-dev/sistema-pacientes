import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import Agenda from "../components/Agenda";

function Laser() {
    const { id } = useParams();
    const [events, setEvents] = useState<any[]>([]);
    const [fechas, setFechas] = useState([{ date: '', time: '09:00' }, { date: '', time: '09:00' }]);

    useEffect(() => {
        async function fetchTratamientos() {
            const { data } = await supabase
                .from('tratamientos')
                .select(`
                    id, 
                    fecha_hora, 
                    tipo, 
                    pacientes (
                        nombre, 
                        apellido
                    )
                `)
                .eq('tipo', 'laser');
            if (data) {
                setEvents(data.map((t: any) => ({ 
                    title: `${t.pacientes?.nombre || ''} ${t.pacientes?.apellido || ''} - Láser`, 
                    start: t.fecha_hora.replace('Z', '').split('+')[0], 
                    allDay: false 
                })));
            }
        }
        fetchTratamientos();
    }, []);

    async function registrarTratamientos() {
        const insertData = fechas.map(f => ({
            paciente_dni: id,
            tipo: 'laser',
            fecha_hora: `${f.date}T${f.time}:00`
        }));
        const { error } = await supabase.from('tratamientos').insert(insertData);
        if (error) alert('Error');
        else {
            alert('Registrado');
            window.location.reload();
        }
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Láser para Paciente {id}</h1>
            <Agenda events={events} view="dayGridMonth" />
            <div className="mt-6 space-y-4">
                {fechas.map((_, i) => (
                    <div key={i} className="flex gap-4">
                        <input type="date" className="p-2 border" onChange={(e) => {
                            const newFechas = [...fechas];
                            newFechas[i].date = e.target.value;
                            setFechas(newFechas);
                        }} />
                        <input type="time" className="p-2 border" onChange={(e) => {
                            const newFechas = [...fechas];
                            newFechas[i].time = e.target.value;
                            setFechas(newFechas);
                        }} />
                    </div>
                ))}
                <button onClick={registrarTratamientos} className="bg-green-600 text-white p-2">Guardar 2 Fechas</button>
            </div>
        </div>
    );
}
export default Laser;
