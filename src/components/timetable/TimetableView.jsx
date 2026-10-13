import React, { useState, useMemo } from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  User, 
  Filter, 
  Download, 
  Printer, 
  BookOpen, 
  CheckCircle2,
  Calendar,
  Sparkles,
  Layers,
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { WEEKLY_SCHEDULE_ITEMS } from '../../data/mockData.js';
import { TableDensityToggle } from '../common/TableDensityToggle.jsx';

const DAYS_OF_WEEK = [
  { id: 'Monday', label: 'Monday', short: 'Mon', num: '01', accent: 'from-blue-600 to-indigo-600' },
  { id: 'Tuesday', label: 'Tuesday', short: 'Tue', num: '02', accent: 'from-indigo-600 to-violet-600' },
  { id: 'Wednesday', label: 'Wednesday', short: 'Wed', num: '03', accent: 'from-violet-600 to-purple-600' },
  { id: 'Thursday', label: 'Thursday', short: 'Thu', num: '04', accent: 'from-sky-600 to-blue-600' },
  { id: 'Friday', label: 'Friday', short: 'Fri', num: '05', accent: 'from-emerald-600 to-teal-600' },
  { id: 'Saturday', label: 'Saturday', short: 'Sat', num: '06', accent: 'from-amber-600 to-orange-600' },
];

export const TimetableView = () => {
  const { 
    courses, 
    role, 
    currentStudent, 
    showToast, 
    isCompactMode,
    setActiveTab,
    setSelectedCourseId
  } = useCollege();

  // Selected day of the week ('Monday', 'Tuesday', ..., 'Saturday')
  const [selectedDay, setSelectedDay] = useState('Monday');

  // Hovered day for depth layering
  const [hoveredDay, setHoveredDay] = useState(null);

  // Subject filter dropdown: 'all' or specific courseCode
  const [subjectFilter, setSubjectFilter] = useState('all');

  // Filter and sort classes chronologically by start time
  const filteredClasses = useMemo(() => {
    let items = [...WEEKLY_SCHEDULE_ITEMS];

    // Filter by Day if in day mode
    if (selectedDay !== 'all') {
      items = items.filter((c) => c.day === selectedDay);
    }

    // Filter by Subject
    if (subjectFilter !== 'all') {
      items = items.filter((c) => c.courseCode === subjectFilter);
    }

    // Sort classes chronologically by startMinutes (e.g. 08:30 AM = 510, 10:00 AM = 600)
    items.sort((a, b) => a.startMinutes - b.startMinutes);

    return items;
  }, [selectedDay, subjectFilter]);

  // Distinct subjects list for dropdown
  const uniqueSubjects = useMemo(() => {
    const map = new Map();
    WEEKLY_SCHEDULE_ITEMS.forEach((item) => {
      if (!map.has(item.courseCode)) {
        map.set(item.courseCode, item.subjectName);
      }
    });
    return Array.from(map.entries()).map(([code, name]) => ({ code, name }));
  }, []);

  // Compute summary metrics per day for card badges
  const dayStats = useMemo(() => {
    const stats = {};
    DAYS_OF_WEEK.forEach((d) => {
      const classesForDay = WEEKLY_SCHEDULE_ITEMS.filter((c) => c.day === d.id);
      stats[d.id] = {
        count: classesForDay.length,
        firstTime: classesForDay[0]?.startTime || '9:00 AM',
        lastTime: classesForDay[classesForDay.length - 1]?.endTime || '4:00 PM',
      };
    });
    return stats;
  }, []);

  // Export timetable
  const handleExportSchedule = () => {
    let icsData = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Unity College//Class Schedule//EN\n";
    filteredClasses.forEach((c) => {
      icsData += "BEGIN:VEVENT\n";
      icsData += `SUMMARY:${c.courseCode} - ${c.subjectName}\n`;
      icsData += `DESCRIPTION:Instructor: ${c.faculty} | Room: ${c.room} | Type: ${c.type}\n`;
      icsData += `LOCATION:${c.room}\n`;
      icsData += `DTSTART;TZID=America/New_York:20261012T${c.startTime.replace(/[^0-9]/g, '')}00\n`;
      icsData += "END:VEVENT\n";
    });
    icsData += "END:VCALENDAR";

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Unity_College_Class_Schedule_${selectedDay}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`Class routine for ${selectedDay} exported to calendar format (.ics).`, 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <span className="font-semibold text-slate-800">Unity College</span>
            <span>·</span>
            <span>Weekly Academic Timetable</span>
            <span>·</span>
            <span>Monday – Saturday</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-indigo-600" />
            <span>Class Schedule</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Select a day from the deck below. Hover over Tuesday or any day to inspect it in depth; select it to reveal the day's full routine.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <TableDensityToggle />
          <button
            onClick={handleExportSchedule}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export .ics</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Layered 3D Day Deck Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Weekly Day Selector (Hover for depth, click to reveal routine)</span>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {selectedDay === 'all' ? 'All 6 Days' : `${selectedDay} Selected`}
          </span>
        </div>

        {/* 3D Perspective Day Deck Container:
            Monday in front, Tuesday slightly layered behind, Wednesday etc.
            Hovering Tuesday lifts it up into the front with smooth 3D elevation.
            Clicking Tuesday brings it fully to front and the routine for Tuesday comes out! */}
        <div className="schedule-perspective-container">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 pb-4">
            {DAYS_OF_WEEK.map((d, index) => {
              const isSelected = selectedDay === d.id;
              const isHovered = hoveredDay === d.id;
              const stats = dayStats[d.id] || { count: 3, firstTime: '9:00 AM', lastTime: '3:00 PM' };

              // Dynamic layering calculation:
              // Selected card gets highest z-index.
              // Natural stack: Monday has initial front presence (z-10, z-9, z-8...).
              // When hovered, card elevates to z-35.
              const baseZ = 20 - index;
              const zIndex = isHovered ? 40 : isSelected ? 30 : baseZ;

              return (
                <div
                  key={d.id}
                  onMouseEnter={() => setHoveredDay(d.id)}
                  onMouseLeave={() => setHoveredDay(null)}
                  onClick={() => setSelectedDay(d.id)}
                  style={{ zIndex }}
                  className={`day-deck-card relative rounded-2xl p-4 cursor-pointer select-none border transition-all duration-300 ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-800 shadow-xl ring-2 ring-indigo-500/80 -translate-y-2 scale-[1.03]'
                      : 'bg-white text-slate-800 border-slate-200/90 hover:border-indigo-300 shadow-xs'
                  }`}
                >
                  {/* Top glowing accent line when active or hovered */}
                  <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${d.accent} ${
                    isSelected ? 'opacity-100' : 'opacity-40 hover:opacity-100'
                  }`} />

                  {/* Day Header */}
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[11px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-white/15 text-indigo-200' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {d.short}
                    </span>
                    <span className={`text-[10px] font-mono ${
                      isSelected ? 'text-slate-300' : 'text-slate-400'
                    }`}>
                      Day {d.num}
                    </span>
                  </div>

                  {/* Full Day Name */}
                  <div className="text-base font-bold tracking-tight">
                    {d.label}
                  </div>

                  {/* Class Count Badge */}
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className={`font-semibold font-mono text-xs ${
                      isSelected ? 'text-indigo-300' : 'text-indigo-600'
                    }`}>
                      {stats.count} Classes
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Active Day" />
                    )}
                  </div>

                  {/* Schedule time span */}
                  <div className={`text-[10px] mt-1 font-mono truncate ${
                    isSelected ? 'text-slate-300' : 'text-slate-400'
                  }`}>
                    {stats.firstTime} – {stats.lastTime}
                  </div>

                  {/* Interactive hint on hover */}
                  <div className={`mt-2.5 pt-2 border-t text-[10px] font-medium flex items-center justify-between transition-opacity ${
                    isSelected 
                      ? 'border-white/10 text-indigo-200' 
                      : 'border-slate-100 text-slate-500'
                  }`}>
                    <span>{isSelected ? 'Routine Active' : 'Click to View'}</span>
                    <ArrowRight className={`w-3 h-3 transition-transform ${isHovered ? 'translate-x-1' : ''}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter Bar: Subject Dropdown Filter & View Toggles */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3">
          <label htmlFor="schedule-subject-filter" className="text-xs font-bold text-slate-700 whitespace-nowrap flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Filter by Subject:</span>
          </label>
          <select
            id="schedule-subject-filter"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all cursor-pointer max-w-sm"
          >
            <option value="all">All Subjects ({uniqueSubjects.length} courses)</option>
            {uniqueSubjects.map((sub) => (
              <option key={sub.code} value={sub.code}>
                {sub.code} — {sub.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {subjectFilter !== 'all' && (
            <button
              onClick={() => setSubjectFilter('all')}
              className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
            >
              Clear Subject Filter
            </button>
          )}

          <button
            onClick={() => setSelectedDay(selectedDay === 'all' ? 'Monday' : 'all')}
            className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
              selectedDay === 'all'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {selectedDay === 'all' ? 'Showing All Days' : 'View Full Week'}
          </button>
        </div>
      </div>

      {/* THE ROUTINE FOR THE DAY COMES OUT
          When user selects Tuesday (or any day), this section smoothly animates into view
          displaying all the classes, timings, venues, and faculty instructors sorted by time */}
      <div key={`${selectedDay}-${subjectFilter}`} className="routine-reveal space-y-4">
        {/* Routine Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl shadow-md border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs text-white flex items-center justify-center font-bold text-sm shrink-0 border border-white/10">
              <CalendarDays className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold uppercase text-indigo-300">
                  Daily Academic Schedule
                </span>
                <span className="text-white/40">·</span>
                <span className="text-xs font-semibold px-2 py-0.2 bg-indigo-500/30 text-indigo-200 rounded-full border border-indigo-400/30">
                  {filteredClasses.length} {filteredClasses.length === 1 ? 'Class' : 'Classes'}
                </span>
              </div>
              <h2 className="text-lg font-bold tracking-tight text-white mt-0.5">
                {selectedDay === 'all' ? 'Weekly Class Schedule (Monday to Saturday)' : `${selectedDay}'s Class Routine`}
              </h2>
            </div>
          </div>

          <div className="text-xs text-slate-300 font-mono flex items-center gap-3">
            <span>Sorted Chronologically by Time</span>
            <span className="hidden sm:inline">·</span>
            <span className="text-emerald-400 font-semibold">Attendance Tracked</span>
          </div>
        </div>

        {/* Classes List or Empty State */}
        {filteredClasses.length === 0 ? (
          <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No classes scheduled</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              There are no classes found for {selectedDay} matching the current filters. Select another day from the deck above or clear the subject filter.
            </p>
            <button
              onClick={() => { setSelectedDay('Monday'); setSubjectFilter('all'); }}
              className="mt-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Back to Monday Routine
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredClasses.map((item, idx) => (
              <div
                key={item.id}
                style={{ animationDelay: `${idx * 0.06}s` }}
                className="routine-item bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-400 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-200 p-5 shadow-xs space-y-3.5 group cursor-pointer relative overflow-hidden"
              >
                {/* Left Royal Accent Bar */}
                <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b from-indigo-500 to-blue-600 group-hover:w-2 transition-all" />

                {/* Top Row: Course Code, Day Badge, Type & Time Pill */}
                <div className="flex items-start justify-between gap-3 pl-1">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="px-2 py-0.5 text-xs font-mono font-bold bg-slate-900 text-white rounded-md shadow-2xs">
                        {item.courseCode}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100">
                        {item.day}
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {item.type}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                      {item.subjectName}
                    </h3>
                  </div>

                  {/* Time Duration Badge */}
                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                      90 min
                    </span>
                  </div>
                </div>

                {/* Middle Row: Schedule Details (Start Time, End Time, Classroom/Venue, Faculty) */}
                <div className="pl-1 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Time */}
                  <div className="flex items-start gap-2.5 text-slate-700">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Start & End Time</div>
                      <div className="font-mono font-bold text-slate-900 text-xs mt-0.5">
                        {item.startTime} – {item.endTime}
                      </div>
                    </div>
                  </div>

                  {/* Venue / Classroom */}
                  <div className="flex items-start gap-2.5 text-slate-700">
                    <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Classroom / Venue</div>
                      <div className="font-semibold text-slate-900 text-xs mt-0.5 truncate">
                        {item.room}
                      </div>
                    </div>
                  </div>

                  {/* Faculty Member */}
                  <div className="flex items-start gap-2.5 text-slate-700 sm:col-span-2 mt-0.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Faculty Instructor</div>
                      <div className="font-semibold text-slate-900 text-xs mt-0.5">
                        {item.faculty}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Actions */}
                <div className="pl-1 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-emerald-700 font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>In-Person Campus Session</span>
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const course = courses.find((c) => c.code === item.courseCode);
                      if (course) setSelectedCourseId(course.id);
                      setActiveTab('attendance');
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer text-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Subject Attendance</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
