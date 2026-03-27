import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useRef, useEffect, useState } from 'react';

interface AgendaProps {
    events: any[];
    onDateClick?: (info: any) => void;
    view?: 'dayGridMonth' | 'dayGridWeek';
    initialDate?: string;
}

function Agenda({ events, onDateClick, view = 'dayGridWeek', initialDate }: AgendaProps) {
    const calendarRef = useRef<FullCalendar>(null);
    const [isMobile, setIsMobile] = useState(false);
    
    // Función auxiliar para obtener YYYY-MM-DD en hora local
    const getLocalDateString = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Función auxiliar para obtener Hoy, Ayer o Mañana
    const getRelativeDayLabel = (dateString: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const selected = new Date(dateString + 'T12:00:00');
        selected.setHours(0, 0, 0, 0);

        const diffTime = selected.getTime() - today.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Hoy';
        if (diffDays === 1) return 'Mañana';
        if (diffDays === -1) return 'Ayer';
        return null;
    };

    const [selectedDate, setSelectedDate] = useState<string>(getLocalDateString(new Date()));
    const [currentView, setCurrentView] = useState<string>(view);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        setIsMobile(mediaQuery.matches); // Set initial value

        const handleMediaChange = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches);
        };

        // Escuchar cambios de tamaño de pantalla
        mediaQuery.addEventListener('change', handleMediaChange);
        return () => mediaQuery.removeEventListener('change', handleMediaChange);
    }, []);

    useEffect(() => {
        if (calendarRef.current && initialDate) {
            calendarRef.current.getApi().gotoDate(initialDate);
        }
    }, [initialDate]);

    return (
        <div className={isMobile ? `mobile-calendar-view view-${currentView}` : ""}>
            {isMobile && (
                <style>{`
                    /* Quita el cuadro que cubre todo el calendario y bordes internos */
                    .mobile-calendar-view .fc-theme-standard .fc-scrollgrid {
                        border: none !important;
                    }
                    .mobile-calendar-view .fc-theme-standard td, 
                    .mobile-calendar-view .fc-theme-standard th {
                        border-color: transparent !important;
                    }
                    /* Flechas más chicas y botones sin fondo */
                    .mobile-calendar-view .fc .fc-button-primary {
                        padding: 0.15rem 0.3rem !important;
                        background-color: transparent !important;
                        border-color: transparent !important;
                        color: #cbd5e1 !important; /* slate-300 */
                    }
                    .mobile-calendar-view .fc .fc-button-primary:hover {
                        background-color: #334155 !important; /* slate-700 */
                    }
                    .mobile-calendar-view .fc .fc-button-active {
                        background-color: #1e293b !important; /* slate-800 */
                        color: #38bdf8 !important; /* sky-400 */
                    }
                    .mobile-calendar-view .fc .fc-icon {
                        font-size: 1.25rem !important;
                    }
                    /* Ajuste para que los textos en el header no se monten/pisen y ocupen el 100% de ancho */
                    .mobile-calendar-view .fc-col-header-cell-cushion {
                        display: block;
                        padding: 0 !important;
                        width: 100%;
                    }
                    
                    /* ESTRUCTURA DEL TOOLBAR (Mobile) */
                    .mobile-calendar-view .fc-toolbar {
                        display: flex;
                        flex-direction: column; /* Coloca titulo arriba y controles abajo */
                        align-items: flex-start;
                        gap: 1rem;
                        margin-bottom: 1.5rem !important;
                    }
                    /* Título como subtítulo superior */
                    .mobile-calendar-view .fc-toolbar-chunk:nth-child(1) {
                        width: 100%;
                    }
                    /* Título capitalizado y separado */
                    .mobile-calendar-view .fc-toolbar-title {
                        font-size: 1.15rem !important;
                        text-transform: capitalize;
                        color: #94a3b8 !important; /* slate-400 */
                        letter-spacing: 0.025em;
                    }
                    /* Controles: flechas izq, botones der */
                    .mobile-calendar-view .fc-toolbar-chunk:nth-child(3) {
                        width: 100%;
                        display: flex;
                        justify-content: space-between; /* Flechas a la izq, Mes/Semana a la der */
                        align-items: center;
                    }
                    
                    /* Quitar fondo gris del "hoy" en el cuerpo del calendario */
                    .mobile-calendar-view td.fc-day-today {
                        background-color: transparent !important;
                    }
                    .mobile-calendar-view th.fc-day-today {
                        background-color: transparent !important;
                    }
                    
                    /* CONFIGURACION ESPECÍFICA PARA LA VISTA SEMANAL (colapsar el body para dejar solo el header) */
                    .mobile-calendar-view.view-dayGridWeek .fc-daygrid-day-frame {
                        min-height: 0 !important;
                        height: 0 !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    .mobile-calendar-view.view-dayGridWeek .fc-daygrid-day-top,
                    .mobile-calendar-view.view-dayGridWeek .fc-daygrid-day-events,
                    .mobile-calendar-view.view-dayGridWeek .fc-daygrid-day-bg {
                        display: none !important; /* Oculta TODO el contenido del dia para que NO se duplique */
                    }

                    /* CONFIGURACION ESPECÍFICA PARA LA VISTA MENSUAL (mostrar grilla compacta de dias) */
                    .mobile-calendar-view.view-dayGridMonth .fc-daygrid-day-frame {
                        min-height: 2.5rem !important;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .mobile-calendar-view.view-dayGridMonth .fc-daygrid-day-top {
                        display: flex;
                        justify-content: center;
                        width: 100%;
                    }
                    .mobile-calendar-view.view-dayGridMonth .fc-daygrid-day-events,
                    .mobile-calendar-view.view-dayGridMonth .fc-daygrid-day-bg {
                        display: none !important; /* ocultamos eventos nativos */
                    }
                `}</style>
            )}
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={view}
                datesSet={(arg) => setCurrentView(arg.view.type)}
                // Si es móvil le pasamos un array vacío para que NO salgan los tratamientos
                events={isMobile ? [] : events}
                dateClick={onDateClick}
                headerToolbar={{
                    left: 'title',
                    center: '',
                    right: 'prev,next dayGridMonth,dayGridWeek'
                }}
                titleFormat={isMobile ? { year: 'numeric', month: 'long' } : undefined}
                // Usamos un locale custom para sobreescribir el titulo default (ej: de "marzo de 2026" a "marzo 2026")
                locale={{
                    code: 'es',
                    buttonText: { month: 'Mes', week: 'Semana', day: 'Día', list: 'Agenda', today: 'Hoy' },
                    weekText: 'Sm',
                    allDayText: 'Todo el día',
                    moreLinkText: 'más',
                    noEventsText: 'No hay eventos para mostrar'
                }}
                titleRangeSeparator=" - "
                dayHeaderContent={(args) => {
                    const date = args.date;
                    const dayName = new Intl.DateTimeFormat('es', { weekday: 'short' }).format(date);
                    const dayNumber = date.getDate();

                    if (isMobile) {
                        if (args.view.type === 'dayGridWeek') {
                            // En vista semanal móvil, el header contiene día y número colapsado
                            const dateString = getLocalDateString(date);
                            const isSelected = dateString === selectedDate;
                            const hasEvent = events.some(e => e.start && e.start.startsWith(dateString));

                            return (
                                <div 
                                    className={`flex flex-col items-center justify-center w-full cursor-pointer transition-colors ${isSelected ? 'bg-slate-800 rounded-t-lg' : ''}`}
                                    onClick={() => setSelectedDate(dateString)}
                                >
                                    <div className={`w-full border-b border-slate-600 pb-1 mb-1 ${isSelected ? 'bg-slate-800 rounded-t-lg' : 'bg-slate-900'}`}>
                                        <span className={`text-xs uppercase font-medium ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`}>{dayName.replace('.', '')}</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center pb-2">
                                        <span className={`text-base font-bold leading-tight ${isSelected ? 'text-cyan-400' : 'text-slate-100'}`}>{dayNumber}</span>
                                        {hasEvent ? (
                                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-1 shadow-[0_0_6px_rgba(34,211,238,0.8)]"></div>
                                        ) : (
                                            <div className="w-1.5 h-1.5 mt-1"></div>
                                        )}
                                    </div>
                                </div>
                            );
                        } else {
                            // En vista mensual móvil, el header SOLO tiene el nombre del día
                            return (
                                <div className="w-full border-b border-slate-600 pb-1 mb-1 bg-slate-900 flex justify-center">
                                    <span className="text-xs uppercase font-medium text-slate-400">{dayName.replace('.', '')}</span>
                                </div>
                            );
                        }
                    }
                    
                    // En PC muestra el formato "dom 12"
                    return (
                        <div className="flex flex-row items-center justify-center p-1 gap-1.5">
                            <span className="text-sm uppercase font-medium text-slate-400">{dayName.replace('.', '')}</span>
                            <span className="text-sm font-bold text-slate-100">{dayNumber}</span>
                        </div>
                    );
                }}
                dayCellContent={(args) => {
                    if (isMobile) {
                        if (args.view.type === 'dayGridMonth') {
                            // En vista mensual móvil, la celda (body) dibuja el número y el dot
                            const dateString = getLocalDateString(args.date);
                            const isSelected = dateString === selectedDate;
                            const hasEvent = events.some(e => e.start && e.start.startsWith(dateString));
                            // Quitamos el "el " que a veces inyecta FullCalendar en locale "es"
                            const numText = args.dayNumberText.replace('el ', '').trim();

                            return (
                                <div 
                                    className={`flex flex-col items-center justify-center p-1.5 rounded-lg cursor-pointer transition-colors mx-auto w-9 h-11 ${isSelected ? 'bg-slate-800 border border-slate-700' : ''}`}
                                    onClick={() => setSelectedDate(dateString)}
                                >
                                    <span className={`text-sm font-bold leading-none ${isSelected ? 'text-cyan-400' : (args.isOther ? 'text-slate-600' : 'text-slate-100')}`}>{numText}</span>
                                    {hasEvent ? (
                                        <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]' : 'bg-slate-500'}`}></div>
                                    ) : (
                                        <div className="w-1.5 h-1.5 mt-1"></div>
                                    )}
                                </div>
                            );
                        } else if (args.view.type === 'dayGridWeek') {
                            // CRÍTICO PARA EL BUG DE DUPLICACIÓN: en la vista semanal móvil,
                            // no renderizar NADA en la celda del día (solo usamos los encabezados).
                            return <></>;
                        }
                    }
                    return undefined; // Comportamiento por defecto
                }}
                dayMaxEvents={true}
                eventDisplay="block"
                eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    meridiem: false,
                    hour12: false
                }}
            />

            {/* Lista de tratamientos para el día seleccionado en móvil */}
            {isMobile && selectedDate && (
                <div className="mt-6 pt-4 border-t border-slate-800">
                    {(() => {
                        const relativeLabel = getRelativeDayLabel(selectedDate);
                        if (!relativeLabel) return null; // "Luego los demas dias que no salga nada"
                        return (
                            <h3 className="text-xl font-bold text-cyan-400 mb-4 capitalize text-center">
                                {relativeLabel}
                            </h3>
                        );
                    })()}
                    <div className="space-y-3">
                        {events.filter(e => e.start && e.start.startsWith(selectedDate)).length > 0 ? (
                            events.filter(e => e.start && e.start.startsWith(selectedDate)).map((ev, idx) => {
                                // Extraer hora de inicio y fin del string ISO (ej: 2026-03-22T09:00)
                                const timeMatch = ev.start.match(/T(\d{2}:\d{2})/);
                                const time = timeMatch ? timeMatch[1] : '';

                                const timeEndMatch = ev.end ? ev.end.match(/T(\d{2}:\d{2})/) : null;
                                const timeEnd = timeEndMatch ? timeEndMatch[1] : '';
                                
                                const timeDisplay = timeEnd ? `${time}-${timeEnd}` : time;

                                return (
                                    <div key={idx} className="bg-slate-800 p-3 rounded-lg shadow-md flex items-center justify-between border-l-4" style={{ borderLeftColor: ev.color || '#22d3ee' }}>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-100">{ev.title}</span>
                                        </div>
                                        {timeDisplay && (
                                            <span className="text-xs font-bold text-slate-300 bg-slate-900 px-2 py-1.5 rounded ml-4 whitespace-nowrap border border-slate-700">
                                                {timeDisplay}
                                            </span>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="bg-slate-900/50 rounded-lg p-6 text-center border border-slate-800 border-dashed">
                                <p className="text-slate-500 italic text-sm">No hay tratamientos agendados para este día.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Agenda;
