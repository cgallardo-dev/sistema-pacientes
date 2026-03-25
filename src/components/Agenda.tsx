import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useRef, useEffect } from 'react';

interface AgendaProps {
    events: any[];
    onDateClick?: (info: any) => void;
    view?: 'dayGridMonth' | 'dayGridWeek';
    initialDate?: string;
}

function Agenda({ events, onDateClick, view = 'dayGridWeek', initialDate }: AgendaProps) {
    const calendarRef = useRef<FullCalendar>(null);

    useEffect(() => {
        if (calendarRef.current && initialDate) {
            calendarRef.current.getApi().gotoDate(initialDate);
        }
    }, [initialDate]);

    return (
        <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={view}
            events={events}
            dateClick={onDateClick}
            headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,dayGridWeek'
            }}
            timeZone="local"
            height="auto"
            locale="es"
            dayMaxEvents={true}
            eventDisplay="block"
            eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                meridiem: false,
                hour12: false
            }}
        />

    );
}

export default Agenda;
