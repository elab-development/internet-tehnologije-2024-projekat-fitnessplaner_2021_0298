import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Lokalizacija
const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function WorkoutCalendar({ workouts }) {
  // Kontrolisani state za datum i view
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month");

  // Prebaci podatke u format za kalendar
  const events = workouts.map(workout => {
    const startDate = new Date(workout.workout_date);
    return {
      id: workout.id,
      title: workout.title,
      start: startDate,
      end: new Date(startDate.getTime() + 60 * 60 * 1000), // +1 sat
    };
  });

  console.log("Workout events:", events);

  return (
    <div style={{ height: 600 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ margin: "20px" }}
        views={['month', 'week', 'day', 'agenda']}
        view={currentView}                // kontrolisani view
        date={currentDate}                // kontrolisani datum
        onNavigate={date => setCurrentDate(date)}
        onView={view => setCurrentView(view)}
      />
    </div>
  );
}
