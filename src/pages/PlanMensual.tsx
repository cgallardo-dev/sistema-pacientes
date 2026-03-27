import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabase";

function PlanMensual() {
    const { id } = useParams();
    const [paciente, setPaciente] = useState<any>(null);
    const [tratamientos, setTratamientos] = useState<any[]>([]);

    // Fechas actuales
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    useEffect(() => {
        async function fetchData() {
            // 1. Traer datos del paciente
            const { data: dataPaciente } = await supabase
                .from('pacientes')
                .select('*')
                .eq('dni', id)
                .single();
            if (dataPaciente) setPaciente(dataPaciente);

            // 2. Traer tratamientos desde el mes actual en adelante (para incluir la próxima sesión incluso si cae en el mes siguiente)
            const pad = (n: number) => String(n).padStart(2, '0');
            const startOfMonthLocal = `${currentYear}-${pad(currentMonth + 1)}-01T00:00:00`;

            const { data: dataTrats } = await supabase
                .from('tratamientos')
                .select('*')
                .eq('paciente_dni', id)
                .gte('fecha_hora', startOfMonthLocal)
                .order('fecha_hora', { ascending: true });

            if (dataTrats) setTratamientos(dataTrats);
        }
        fetchData();
    }, [id, currentMonth, currentYear]);

    // Función auxiliar para separar los del mes actual, completadas y detectar la próxima sesión
    const getTratsData = (tipo: string) => {
        const pad = (n: number) => String(n).padStart(2, '0');
        const currentMonthPrefix = `${currentYear}-${pad(currentMonth + 1)}-`;
        
        // Obtenemos hora local exacta para comparar fecha futura (próxima sesión)
        const nowLocal = new Date();
        const nowLocalStr = `${nowLocal.getFullYear()}-${pad(nowLocal.getMonth() + 1)}-${pad(nowLocal.getDate())}T${pad(nowLocal.getHours())}:${pad(nowLocal.getMinutes())}`;
        
        // Sesiones estrictamente de este mes
        const mesActual = tratamientos.filter(t => t.tipo === tipo && t.fecha_hora.startsWith(currentMonthPrefix));
        
        // De las de este mes, cuáles fueron marcadas manualmente como completadas
        const completadas = mesActual.filter(t => t.completado === true);
        
        // Próxima sesión general (la primera que sea en el futuro y que NO esté completada)
        // Como vienen ordenadas por fecha_hora ascendente, buscamos la primera mayor a la fecha/hora actual
        const proxima = tratamientos.find(t => t.tipo === tipo && t.fecha_hora.replace('Z', '').split('+')[0] > nowLocalStr && !t.completado);

        return { mesActual, completadas, proxima };
    };

    const laserData = getTratsData('laser');
    const ozonoData = getTratsData('ozonoterapia');

    const maxLaser = 3;
    const maxOzono = 8;

    const [isLaserStarted, setIsLaserStarted] = useState(false);
    const [isOzonoStarted, setIsOzonoStarted] = useState(false);

    // Renderizador de un ítem de sesión para que el código quede limpio
    const renderSesionItem = (t: any, index: number, isProxima: boolean) => {
        const datePart = t.fecha_hora.replace('Z', '').split('+')[0].split('T')[0];
        const timePart = t.fecha_hora.replace('Z', '').split('+')[0].split('T')[1].substring(0, 5);
        const timeEndPart = t.fecha_hora_fin ? t.fecha_hora_fin.replace('Z', '').split('+')[0].split('T')[1].substring(0, 5) : '';
        const [year, month, day] = datePart.split('-');
        
        const isCompletado = t.completado === true;

        return (
            <li key={t.id || index} className={`px-4 py-3 rounded-lg text-sm flex flex-col md:flex-row md:items-center justify-between gap-3 ${isProxima ? 'bg-cyan-900/40 border-l-4 border-cyan-400' : (isCompletado ? 'bg-emerald-900/20 border-l-4 border-emerald-500 opacity-90' : 'bg-slate-800')}`}>
                <div className="flex flex-col">
                    <span className={isProxima ? 'text-cyan-400 font-bold uppercase tracking-wider text-xs' : 'text-slate-300'}>
                        {isProxima ? '⭐ Próxima Sesión' : `Sesión ${index + 1}`}
                    </span>
                    <label className="flex items-center gap-2 mt-2 cursor-pointer w-max">
                        <input 
                            type="checkbox" 
                            checked={isCompletado}
                            onChange={async () => {
                                const { error } = await supabase.from('tratamientos').update({ completado: !isCompletado }).eq('id', t.id);
                                if (!error) window.location.reload();
                            }}
                            className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                        />
                        <span className={`text-xs font-semibold ${isCompletado ? 'text-emerald-400' : 'text-slate-400'}`}>
                            {isCompletado ? '✓ Completada' : 'Marcar completada'}
                        </span>
                    </label>
                </div>
                <strong className={`px-3 py-1.5 rounded-md border whitespace-nowrap shrink-0 ${isProxima ? 'text-cyan-100 bg-cyan-950/50 border-cyan-800' : (isCompletado ? 'text-emerald-100 bg-emerald-950/50 border-emerald-800' : 'text-white bg-slate-900 border-slate-700')}`}>
                    {day}/{month}/{year} | {timePart} {timeEndPart ? `a ${timeEndPart}` : ''} hs
                </strong>
            </li>
        );
    };

    return (
        <div className="p-6 min-h-screen bg-slate-950 text-slate-100">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800">
                    <h1 className="text-3xl font-bold text-cyan-400 mb-2">Plan Mensual - {monthNames[currentMonth]} {currentYear}</h1>
                    <p className="text-lg text-slate-300">Paciente: <strong className="text-white">{paciente?.nombre} {paciente?.apellido}</strong></p>
                    <p className="text-lg text-slate-300">DNI: <strong className="text-white">{id}</strong></p>
                    <p className="text-lg text-slate-300">Afección: <strong className="text-rose-400">{paciente?.diagnostico}</strong></p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* SECCIÓN LÁSER */}
                    <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800 flex flex-col">
                        <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700 pb-2 flex justify-between items-center">
                            <span>Láser</span>
                            {laserData.mesActual.length > 0 && <span className="text-sm bg-cyan-900 text-cyan-400 px-2 py-1 rounded">Activo</span>}
                        </h2>

                        {laserData.mesActual.length === 0 && !isLaserStarted ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-700 rounded-xl bg-slate-800/50 mt-4">
                                <p className="text-slate-400 mb-6">No hay un plan de Láser iniciado para este mes.</p>
                                <button 
                                    onClick={() => setIsLaserStarted(true)} 
                                    className="bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded-xl hover:bg-cyan-300 transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                                >
                                    Empezar Plan Láser
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-6 bg-slate-800 p-4 rounded-lg">
                                    <div className="flex flex-col">
                                        <span className="text-lg text-slate-300">Sesiones Láser (Completadas):</span>
                                        <span className="text-sm text-slate-400">Restantes: {maxLaser - laserData.completadas.length}</span>
                                    </div>
                                    <span className="text-2xl font-bold text-cyan-400 whitespace-nowrap shrink-0">{laserData.completadas.length} / {maxLaser}</span>
                                </div>
                                <div className="flex-1">
                                    {laserData.mesActual.length > 0 && (
                                        <ul className="space-y-3 mb-6">
                                            {laserData.mesActual.map((t, i) => {
                                                const isProxima = laserData.proxima && laserData.proxima.id === t.id;
                                                return renderSesionItem(t, i, Boolean(isProxima));
                                            })}
                                        </ul>
                                    )}
                                    {laserData.completadas.length >= maxLaser ? (
                                        <div className="p-4 bg-emerald-900/50 border border-emerald-500 rounded-lg text-emerald-400 text-center font-bold">
                                            ¡Plan de Láser completado este mes!
                                        </div>
                                    ) : (
                                        <FormularioRegistro 
                                            tipo="laser" 
                                            pacienteId={id!} 
                                            count={laserData.mesActual.length} 
                                            onSuccess={() => window.location.reload()} 
                                            onCancel={() => setIsLaserStarted(false)}
                                        />
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* SECCIÓN OZONOTERAPIA */}
                    <div className="bg-slate-900 p-6 rounded-xl shadow-lg border border-slate-800 flex flex-col">
                        <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700 pb-2 flex justify-between items-center">
                            <span>Ozonoterapia</span>
                            {ozonoData.mesActual.length > 0 && <span className="text-sm bg-cyan-900 text-cyan-400 px-2 py-1 rounded">Activo</span>}
                        </h2>

                        {ozonoData.mesActual.length === 0 && !isOzonoStarted ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-slate-700 rounded-xl bg-slate-800/50 mt-4">
                                <p className="text-slate-400 mb-6">No hay un plan de Ozonoterapia iniciado para este mes.</p>
                                <button 
                                    onClick={() => setIsOzonoStarted(true)} 
                                    className="bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded-xl hover:bg-cyan-300 transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                                >
                                    Empezar Plan Ozonoterapia
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-6 bg-slate-800 p-4 rounded-lg">
                                    <div className="flex flex-col">
                                        <span className="text-lg text-slate-300">Sesiones Ozonoterapia (Completadas):</span>
                                        <span className="text-sm text-slate-400">Restantes: {maxOzono - ozonoData.completadas.length}</span>
                                    </div>
                                    <span className="text-2xl font-bold text-cyan-400 whitespace-nowrap shrink-0">{ozonoData.completadas.length} / {maxOzono}</span>
                                </div>
                                <div className="flex-1">
                                    {ozonoData.mesActual.length > 0 && (
                                        <ul className="space-y-3 mb-6">
                                            {ozonoData.mesActual.map((t, i) => {
                                                const isProxima = ozonoData.proxima && ozonoData.proxima.id === t.id;
                                                return renderSesionItem(t, i, Boolean(isProxima));
                                            })}
                                        </ul>
                                    )}
                                    {ozonoData.completadas.length >= maxOzono ? (
                                        <div className="p-4 bg-emerald-900/50 border border-emerald-500 rounded-lg text-emerald-400 text-center font-bold">
                                            ¡Plan de Ozonoterapia completado este mes!
                                        </div>
                                    ) : (
                                        <FormularioRegistro 
                                            tipo="ozonoterapia" 
                                            pacienteId={id!} 
                                            count={ozonoData.mesActual.length} 
                                            onSuccess={() => window.location.reload()} 
                                            onCancel={() => setIsOzonoStarted(false)}
                                        />
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function FormularioRegistro({ tipo, pacienteId, count, onSuccess, onCancel }: { tipo: 'laser' | 'ozonoterapia', pacienteId: string, count: number, onSuccess: () => void, onCancel?: () => void }) {
    // Si es la primera sesión (0), mostramos 2 inputs. Si no, solo 1.
    const fieldsRequired = count === 0 ? 2 : 1;
    const initialFechas = Array.from({ length: fieldsRequired }, () => ({ date: '', time: '09:00', timeEnd: '10:00' }));
    const [fechas, setFechas] = useState(initialFechas);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit() {
        if (isSubmitting) return;

        // Limite
        const maxLimit = tipo === 'laser' ? 3 : 8;
        if (count + fechas.length > maxLimit) {
            alert(`No puedes registrar más de ${maxLimit} sesiones de ${tipo} en un mes.`);
            return;
        }

        // 1. Validar campos vacíos
        const missingDates = fechas.some(f => !f.date || !f.time || !f.timeEnd);
        if (missingDates) {
            alert('Completa todos los campos (Fecha, Hora Inicio y Hora Fin).');
            return;
        }

        // 2. Validar fechas en el pasado
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        for (const f of fechas) {
            const [year, month, day] = f.date.split('-');
            const selectedDate = new Date(Number(year), Number(month) - 1, Number(day));
            if (selectedDate < today) {
                alert(`Error: No puedes registrar un tratamiento en una fecha pasada (${f.date.split('-').reverse().join('/')}).`);
                return;
            }
        }

        // 3. Validar duplicados de fecha dentro del formulario
        const selectedDatesOnly = fechas.map(f => f.date);
        const uniqueDates = new Set(selectedDatesOnly);
        if (uniqueDates.size !== selectedDatesOnly.length) {
            alert('Has seleccionado la misma fecha más de una vez. Solo 1 por día.');
            return;
        }

        // 4. Validar límite de 1 turno por día para el paciente (revisando la DB actual)
        const { data: patientTrats } = await supabase
            .from('tratamientos')
            .select('fecha_hora')
            .eq('paciente_dni', pacienteId)
            .eq('tipo', tipo);
        
        if (patientTrats) {
            const existingDates = patientTrats.map((t: any) => t.fecha_hora.split('T')[0]);
            const conflictDate = selectedDatesOnly.find(d => existingDates.includes(d));
            if (conflictDate) {
                alert(`El paciente ya tiene ${tipo === 'laser' ? 'Láser' : 'Ozonoterapia'} el día ${conflictDate.split('-').reverse().join('/')}. Solo 1 por día.`);
                return;
            }
        }

        // 5. Validar solapamiento con otros pacientes
        const { data: allTratamientos } = await supabase
            .from('tratamientos')
            .select('fecha_hora, fecha_hora_fin');

        if (allTratamientos) {
            for (const f of fechas) {
                const proposedStart = new Date(`${f.date}T${f.time}`);
                const proposedEnd = new Date(`${f.date}T${f.timeEnd}`);

                if (proposedStart >= proposedEnd) {
                    alert(`Error: La hora de inicio no puede ser mayor o igual a la de fin en la fecha ${f.date.split('-').reverse().join('/')}.`);
                    return;
                }

                const isOccupied = allTratamientos.some((t: any) => {
                    if (!t.fecha_hora) return false;
                    const dbStart = new Date(t.fecha_hora.replace('Z', '').split('+')[0].substring(0, 16));
                    let dbEnd = new Date(dbStart.getTime() + 60 * 60 * 1000);
                    if (t.fecha_hora_fin) {
                        dbEnd = new Date(t.fecha_hora_fin.replace('Z', '').split('+')[0].substring(0, 16));
                    }
                    return (proposedStart < dbEnd) && (proposedEnd > dbStart);
                });

                if (isOccupied) {
                    alert(`El horario del día ${f.date.split('-').reverse().join('/')} se superpone con un turno ya reservado.`);
                    return;
                }
            }
        }

        // 6. Insertar en DB
        setIsSubmitting(true);
        const insertData = fechas.map(f => {
            return {
                paciente_dni: pacienteId,
                tipo: tipo,
                fecha_hora: `${f.date}T${f.time}:00`,
                fecha_hora_fin: `${f.date}T${f.timeEnd}:00`,
                completado: false
            };
        });

        const { error } = await supabase.from('tratamientos').insert(insertData);
        setIsSubmitting(false);
        if (error) {
            alert('Error al registrar');
            console.error(error);
        } else {
            alert('¡Turnos registrados exitosamente!');
            onSuccess();
        }
    }

    return (
        <div className="bg-slate-950/50 p-4 rounded-lg border border-slate-700">
            <h3 className="text-cyan-400 font-bold mb-4">
                {count === 0 ? 'Registrar 1ra sesión y Próxima Sesión' : 'Agendar Próxima Sesión'}
            </h3>
            
            <div className="space-y-4">
                {fechas.map((f, i) => (
                    <div key={i} className="flex flex-col gap-2 p-3 bg-slate-900 border border-slate-600 rounded">
                        <span className="text-sm text-slate-400 font-semibold">{count === 0 ? (i === 0 ? 'Sesión Actual' : 'Siguiente Sesión') : 'Nueva Sesión'}</span>
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-2">
                            <div className="flex flex-col">
                                <label className="text-xs text-slate-400 mb-1">Día</label>
                                <input type="date" className="p-2 border border-slate-700 bg-slate-800 rounded text-sm text-slate-100" value={f.date} onChange={(e) => {
                                    const newFechas = [...fechas];
                                    newFechas[i].date = e.target.value;
                                    setFechas(newFechas);
                                }} />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs text-slate-400 mb-1">Hora Inicio</label>
                                <input type="time" className="p-2 border border-slate-700 bg-slate-800 rounded text-sm text-slate-100" value={f.time} onChange={(e) => {
                                    const newFechas = [...fechas];
                                    newFechas[i].time = e.target.value;
                                    setFechas(newFechas);
                                }} />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-xs text-slate-400 mb-1">Hora Fin</label>
                                <input type="time" className="p-2 border border-slate-700 bg-slate-800 rounded text-sm text-slate-100" value={f.timeEnd} onChange={(e) => {
                                    const newFechas = [...fechas];
                                    newFechas[i].timeEnd = e.target.value;
                                    setFechas(newFechas);
                                }} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button 
                onClick={handleSubmit} 
                disabled={isSubmitting} 
                className={`mt-4 w-full bg-cyan-400 text-slate-950 font-bold p-3 rounded hover:bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all ${isSubmitting ? 'opacity-50' : ''}`}
            >
                {isSubmitting ? 'Guardando...' : 'Guardar Tratamiento'}
            </button>
            
            {onCancel && count === 0 && (
                <button 
                    onClick={onCancel} 
                    disabled={isSubmitting}
                    className="mt-2 w-full bg-transparent border border-slate-600 text-slate-400 font-bold p-3 rounded hover:bg-slate-800 transition-all"
                >
                    Cancelar
                </button>
            )}
        </div>
    );
}

export default PlanMensual;