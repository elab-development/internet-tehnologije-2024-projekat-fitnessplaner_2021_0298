import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { enUS } from "date-fns/locale";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function TestCalendar() {
  const events = [
    {
      id: 1,
      title: "Test Event",
      start: new Date(2025, 8, 18, 10, 0), // 18. Septembar 2025
      end: new Date(2025, 8, 18, 12, 0),
    },
  ];

  return (
    <div style={{ height: 600 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        defaultDate={new Date()}
      />
    </div>
  );
}
