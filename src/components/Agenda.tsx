import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

interface AgendaProps {
    events: any[];
    onDateClick?: (info: any) => void;
    view?: 'dayGridMonth' | 'timeGridWeek';
}

function Agenda({ events, onDateClick, view = 'timeGridWeek' }: AgendaProps) {
    return (
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={view}
            events={events}
            dateClick={onDateClick}
            headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek'
            }}
            height="auto"
            locale="es"
        />
    );
}

export default Agenda;
