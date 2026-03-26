import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import Agenda from "../components/Agenda";
import { getPatientColor } from "../utils/colors";

function Laser() {
    const { id } = useParams();
    const [events, setEvents] = useState<any[]>([]);
    const [fechas, setFechas] = useState([{ date: '', time: '09:00' }, { date: '', time: '09:00' }]);

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
                .eq('tipo', 'laser');
            if (data) {
                setEvents(data.map((t: any) => ({ 
                    title: `${t.pacientes?.nombre || ''} ${t.pacientes?.apellido || ''} - Láser`, 
                    start: t.fecha_hora.replace('Z', '').split('+')[0], 
                    allDay: false,
                    color: getPatientColor(t.paciente_dni || t.id),
                    paciente_dni: String(t.paciente_dni || t.id)
                })));
            }
        }
        fetchTratamientos();
    }, []);

    async function registrarTratamientos() {
        if (isSubmitting) return;

        // 1. Validar que no haya fechas vacías
        const missingDates = fechas.some(f => !f.date || !f.time);
        if (missingDates) {
            alert('Por favor, selecciona una fecha y hora para todas las sesiones antes de guardar.');
            return;
        }

        // 2. Validar que no haya DUPLICADOS EXACTOS dentro del mismo formulario (misma fecha y misma hora)
        const selectedDateTimes = fechas.map(f => `${f.date}T${f.time}`);
        const uniqueDateTimes = new Set(selectedDateTimes);
        if (uniqueDateTimes.size !== selectedDateTimes.length) {
            alert('Error: Has seleccionado la misma fecha y hora más de una vez en el formulario.');
            return;
        }

        // 3. Validar que el paciente no tenga ya un tratamiento de láser agendado en ese MISMO DÍA (regla de negocio 1 al día)
        const existingDatesForPatient = events
            .filter(e => e.paciente_dni === String(id))
            .map(e => e.start.split('T')[0]);

        const selectedDatesOnly = fechas.map(f => f.date);
        const conflictDate = selectedDatesOnly.find(date => existingDatesForPatient.includes(date));
        if (conflictDate) {
            alert(`Error: El paciente ya tiene una sesión de láser agendada el día ${conflictDate.split('-').reverse().join('/')}. Solo se permite una por día.`);
            return;
        }

        // 4. Validar que la FECHA Y HORA exactas no estén ya ocupadas por OTRO paciente (o el mismo)
        // Pedimos TODO a la DB. Supabase nos devuelve "2026-03-13T09:00:00" o "2026-03-13T09:00:00+00:00"
        const { data: allTratamientos } = await supabase
            .from('tratamientos')
            .select('fecha_hora');
        
        if (allTratamientos) {
            for (const f of fechas) {
                // Generamos la version local (ej: "2026-03-13T09:00")
                const proposedDateTime = `${f.date}T${f.time}`;
                
                // Normalizamos lo que viene de la DB (le quitamos la Z y el timezone para compararlo como string crudo)
                const isOccupied = allTratamientos.some((t: any) => {
                    if (!t.fecha_hora) return false;
                    const dbDateTimeNormalized = t.fecha_hora.replace('Z', '').split('+')[0].substring(0, 16);
                    return dbDateTimeNormalized === proposedDateTime;
                });

                if (isOccupied) {
                    alert(`Error: Ya existe un paciente con turno reservado el día ${f.date.split('-').reverse().join('/')} a las ${f.time}. Por favor, elige otro horario.`);
                    return;
                }
            }
        }

        setIsSubmitting(true);
        const insertData = fechas.map(f => ({
            paciente_dni: id,
            tipo: 'laser',
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
            <h1 className="text-2xl font-bold mb-4">Láser para Paciente {id}</h1>
            <div className="md:bg-slate-900 md:p-6 md:rounded-xl md:shadow-lg md:border md:border-slate-800">
                <Agenda events={events} view="dayGridMonth" />
            </div>
            <div className="mt-6 space-y-4 md:bg-slate-900 md:p-6 md:rounded-xl md:shadow-lg md:border md:border-slate-800">
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
                <button onClick={registrarTratamientos} disabled={isSubmitting} className={`w-full md:w-auto bg-cyan-400 text-slate-950 font-bold p-3 rounded hover:bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {isSubmitting ? 'Guardando...' : 'Guardar 2 Fechas'}
                </button>
            </div>
        </div>
    );
}
export default Laser;
