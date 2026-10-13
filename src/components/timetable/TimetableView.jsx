import React, { useState, useMemo } from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  User, 
  Download, 
  Printer, 
  CheckCircle2
} from 'lucide-react';
import { WEEKLY_SCHEDULE_ITEMS } from '../../data/mockData.js';

const DAYS = [
  { id: 'Monday', label: 'Monday', short: 'Mon' },
  { id: 'Tuesday', label: 'Tuesday', short: 'Tue' },
  { id: 'Wednesday', label: 'Wednesday', short: 'Wed' },
  { id: 'Thursday', label: 'Thursday', short: 'Thu' },
  { id: 'Friday', label: 'Friday', short: 'Fri' },
  { id: 'Saturday', label: 'Saturday', short: 'Sat' },
];

export const TimetableView = () => {
  const { 
    courses, 
    showToast, 
    setActiveTab,
    setSelectedCourseId
  } = useCollege();

  // Selected day: Monday by default
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [hoveredDay, setHoveredDay] = useState(null);

  // Filter classes for the selected day sorted by start time
  const dayClasses = useMemo(() => {
    return WEEKLY_SCHEDULE_ITEMS
      .filter((item) => item.day === selectedDay)
      .sort((a, b) => a.startMinutes - b.startMinutes);
  }, [selectedDay]);

  // Export schedule to .ics calendar
  const handleExport = () => {
    let ics = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Unity College//Class Schedule//EN\n";
    dayClasses.forEach((c) => {
      ics += `BEGIN:VEVENT\nSUMMARY:${c.courseCode} - ${c.subjectName}\nDESCRIPTION:Faculty: ${c.faculty} | Room: ${c.room}\nLOCATION:${c.room}\nEND:VEVENT\n`;
    });
    ics += "END:VCALENDAR";

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Schedule_${selectedDay}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`${selectedDay} routine exported to calendar.`, 'success');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Clean, Simple Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-indigo-600" />
            <span>Class Schedule</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Hover over any day to inspect; click to view the day's class routine.
          </p>
        </div>

        {/* Clean, Subtle Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Layered Day Deck:
          Monday in front (highest natural z-index), Tuesday behind it, Wednesday behind Tuesday...
          Hovering Tuesday lifts it up into the front.
          Clicking Tuesday selects it and brings out Tuesday's routine! */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Select Day
        </div>

        <div className="deck-stage py-2 overflow-x-auto pb-3">
          <div className="flex items-center min-w-[620px] justify-between gap-2.5 px-1">
            {DAYS.map((day, idx) => {
              const isSelected = selectedDay === day.id;
              const isHovered = hoveredDay === day.id;
              const count = WEEKLY_SCHEDULE_ITEMS.filter((c) => c.day === day.id).length;

              const naturalZ = 30 - idx * 4;
              const currentZ = isHovered ? 60 : isSelected ? 50 : naturalZ;
              const perspectiveTranslateY = isSelected ? '-8px' : isHovered ? '-12px' : `${idx * 2}px`;

              return (
                <div
                  key={day.id}
                  onMouseEnter={() => setHoveredDay(day.id)}
                  onMouseLeave={() => setHoveredDay(null)}
                  onClick={() => setSelectedDay(day.id)}
                  style={{
                    zIndex: currentZ,
                    transform: `translateY(${perspectiveTranslateY}) scale(${isSelected ? 1.04 : isHovered ? 1.05 : 0.98 - idx * 0.01})`,
                  }}
                  className={`deck-perspective-item flex-1 cursor-pointer rounded-xl p-3.5 border text-center select-none transition-all duration-200 ${
                    isSelected
                      ? 'bg-slate-900 text-white border-teal-500 shadow-xl ring-2 ring-teal-400/30'
                      : isHovered
                      ? 'bg-white text-slate-900 border-indigo-300 shadow-md'
                      : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-center mb-1">
                    {isSelected ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase bg-teal-500/20 text-teal-300 border border-teal-500/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
                        BROUGHT TO FRONT
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase">
                        {day.short}
                      </span>
                    )}
                  </div>
                  <div className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {day.label}
                  </div>
                  <div className={`text-[11px] font-mono mt-1 ${isSelected ? 'text-teal-300' : 'text-slate-500'}`}>
                    {count} {count === 1 ? 'class' : 'classes'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Routine Section: Sleek Midnight Deck per Image Reference */}
      <div key={selectedDay} className="routine-reveal bg-slate-950 text-white rounded-2xl p-5 sm:p-6 border border-slate-800/80 relative overflow-hidden space-y-4">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 relative z-10">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-bold text-white tracking-tight">
              {selectedDay}'s Daily Routine
            </h2>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
              {dayClasses.length} {dayClasses.length === 1 ? 'Class' : 'Classes'}
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Chronological Order
          </span>
        </div>

        {dayClasses.length === 0 ? (
          <div className="p-8 text-center bg-slate-900 rounded-xl border border-slate-800 text-slate-400 text-xs">
            No classes scheduled for {selectedDay}.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            {dayClasses.map((item, i) => (
              <div
                key={item.id}
                className="routine-card-glow bg-slate-900/90 border border-slate-800/90 hover:border-teal-400/50 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden group cursor-pointer transition-all duration-200"
                onClick={() => {
                  const course = courses.find((c) => c.code === item.courseCode);
                  if (course) setSelectedCourseId(course.id);
                  setActiveTab('attendance');
                }}
              >
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-teal-500/10 rounded-full blur-xl group-hover:bg-teal-500/20 transition-all pointer-events-none" />

                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold tracking-wider uppercase bg-teal-500/15 text-teal-300 border border-teal-500/30">
                      {item.courseCode}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-medium uppercase px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60">
                      {item.type}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-teal-400 font-semibold">
                    Session {i + 1}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-teal-200 transition-colors">
                  {item.subjectName}
                </h3>

                <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono">
                      <Clock className="w-3.5 h-3.5 text-teal-400" />
                      <span>{item.startTime} – {item.endTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-medium">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{item.room}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-300">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-[130px] font-medium">{item.faculty}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
