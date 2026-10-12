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
  Sparkles
} from 'lucide-react';
import { WEEKLY_SCHEDULE_ITEMS } from '../../data/mockData.js';
import { TableDensityToggle } from '../common/TableDensityToggle.jsx';

const DAYS_OF_WEEK = [
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
    role, 
    currentStudent, 
    showToast,
    isCompactMode,
    setActiveTab,
    setSelectedCourseId
  } = useCollege();

  // Selected day of the week: 'Monday', 'Tuesday', ..., 'Saturday', or 'all'
  const [selectedDay, setSelectedDay] = useState('Monday');

  // Subject filter dropdown: 'all' or specific courseCode
  const [subjectFilter, setSubjectFilter] = useState('all');

  // Layout view mode: 'day' (cards for selected day) or 'grid' (weekly overview)
  const [viewMode, setViewMode] = useState('day');

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

    // Sort classes chronologically by startMinutes (e.g. 08:30 AM = 510, 10:00 AM = 600, etc.)
    items.sort((a, b) => a.startMinutes - b.startMinutes);

    return items;
  }, [selectedDay, subjectFilter]);

  // Export timetable
  const handleExportSchedule = () => {
    let icsData = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Unity College//Class Schedule//EN\n";
    filteredClasses.forEach((c) => {
      icsData += "BEGIN:VEVENT\n";
      icsData += `SUMMARY:${c.courseCode} - ${c.subjectName}\n`;
      icsData += `DESCRIPTION:Instructor: ${c.faculty} | Type: ${c.type}\n`;
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
    showToast('Class schedule exported to calendar format (.ics).', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

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

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <span className="font-semibold text-slate-800">Unity College</span>
            <span>·</span>
            <span>Fall 2026 Academic Term</span>
            <span>·</span>
            <span>Timetable Roster</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-indigo-600" />
            <span>Class Schedule</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Weekly academic timetable from Monday to Saturday. Select a day or filter by subject.
          </p>
        </div>

        {/* Quick Actions & Navigation */}
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

      {/* Control Bar: Day Tabs (Mon-Sat) & Subject Filter Dropdown */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs space-y-3">
        {/* Row 1: Day of Week Tabs (Monday to Saturday) */}
        <div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Select Day of the Week:</span>
            <span className="font-mono text-indigo-600 text-xs lowercase">
              {filteredClasses.length} {filteredClasses.length === 1 ? 'class' : 'classes'} scheduled
            </span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
            {DAYS_OF_WEEK.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDay(d.id)}
                className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all text-center cursor-pointer border ${
                  selectedDay === d.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div>{d.label}</div>
              </button>
            ))}
            <button
              onClick={() => setSelectedDay('all')}
              className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all text-center cursor-pointer border ${
                selectedDay === 'all'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <div>All Days</div>
            </button>
          </div>
        </div>

        {/* Row 2: Subject Dropdown Filter */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
              <option value="all">All Subjects (Complete Timetable)</option>
              {uniqueSubjects.map((sub) => (
                <option key={sub.code} value={sub.code}>
                  {sub.code} — {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick reset filter */}
          {subjectFilter !== 'all' && (
            <button
              onClick={() => setSubjectFilter('all')}
              className="text-xs font-medium text-indigo-600 hover:underline cursor-pointer"
            >
              Clear subject filter
            </button>
          )}
        </div>
      </div>

      {/* Classes Display: Sorted chronologically by time in organized layout */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>{selectedDay === 'all' ? 'All Classes (Monday – Saturday)' : `${selectedDay}'s Classes`}</span>
            <span className="text-xs font-normal text-slate-500">
              · Sorted by Start Time
            </span>
          </h2>
        </div>

        {filteredClasses.length === 0 ? (
          <div className="p-12 bg-white rounded-xl border border-slate-200 text-center space-y-2">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-800">No classes found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are no classes scheduled for the selected day or subject filter. Try selecting another day or clearing the filter.
            </p>
            <button
              onClick={() => { setSelectedDay('all'); setSubjectFilter('all'); }}
              className="mt-3 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Reset Schedule View
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredClasses.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 transition-all p-4 shadow-2xs space-y-3"
              >
                {/* Header: Subject Code, Name & Type */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 text-xs font-mono font-bold bg-slate-900 text-white rounded">
                        {item.courseCode}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded border border-indigo-100">
                        {item.day}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {item.subjectName}
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 shrink-0">
                    {item.type}
                  </span>
                </div>

                {/* Details Grid: Time, Classroom/Venue, Faculty */}
                <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {/* Time Range */}
                  <div className="flex items-center gap-2 text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Time</div>
                      <div className="font-mono font-semibold">{item.startTime} – {item.endTime}</div>
                    </div>
                  </div>

                  {/* Classroom / Venue */}
                  <div className="flex items-center gap-2 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Classroom / Venue</div>
                      <div className="font-medium truncate">{item.room}</div>
                    </div>
                  </div>

                  {/* Faculty Name */}
                  <div className="flex items-center gap-2 text-slate-700 sm:col-span-2 mt-1">
                    <User className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Faculty Instructor</div>
                      <div className="font-medium">{item.faculty}</div>
                    </div>
                  </div>
                </div>

                {/* Bottom Quick Link to Attendance */}
                <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    Status: Scheduled
                  </span>
                  <button
                    onClick={() => {
                      const course = courses.find((c) => c.code === item.courseCode);
                      if (course) setSelectedCourseId(course.id);
                      setActiveTab('attendance');
                    }}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>View Attendance</span>
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
