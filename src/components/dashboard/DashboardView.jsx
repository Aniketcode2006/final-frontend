import React from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  Users, 
  BookOpen, 
  CheckCircle2, 
  Award, 
  CalendarDays, 
  Clock, 
  MapPin, 
  User, 
  ArrowRight,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { TableDensityToggle } from '../common/TableDensityToggle.jsx';
import { WEEKLY_SCHEDULE_ITEMS, SUBJECT_ATTENDANCE_DATA } from '../../data/mockData.js';

export const DashboardView = () => {
  const { 
    students, 
    courses, 
    setActiveTab, 
    role,
    currentStudent,
    setSelectedCourseId
  } = useCollege();

  // Metrics computation
  const totalStudents = students.length;
  const activeCoursesCount = courses.length;

  const totalGpa = students.reduce((acc, s) => acc + s.gpa, 0);
  const avgCampusGpa = totalStudents > 0 ? (totalGpa / totalStudents).toFixed(2) : '3.60';

  const totalAttendance = students.reduce((acc, s) => acc + s.attendanceRate, 0);
  const avgCampusAttendance = totalStudents > 0 ? Math.round(totalAttendance / totalStudents) : 92;

  // Today's classes (Monday by default in demo, or current day)
  const todaysClasses = WEEKLY_SCHEDULE_ITEMS.filter((item) => item.day === 'Monday');

  // Attendance subjects preview
  const subjectList = Object.values(SUBJECT_ATTENDANCE_DATA).slice(0, 4);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Clean Header & Navigation Shortcuts */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <span className="font-semibold text-slate-800">Unity College</span>
            <span>·</span>
            <span>Fall 2026</span>
            <span>·</span>
            <span className="capitalize">{role} Overview</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {role === 'student' && currentStudent 
              ? `Welcome back, ${currentStudent.firstName}` 
              : 'Campus Academic Dashboard'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Overview of current semester classes, attendance rates, and academic schedule.
          </p>
        </div>

        {/* Quick Nav Switches between Dashboard, Attendance, and Class Schedule */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('attendance')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Attendance</span>
          </button>
          <button
            onClick={() => setActiveTab('timetable')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
          >
            <CalendarDays className="w-3.5 h-3.5 text-indigo-400" />
            <span>Class Schedule</span>
          </button>
        </div>
      </div>

      {/* 4 Clean Minimalist Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Enrolled Students / My Courses */}
        <div 
          onClick={() => setActiveTab(role === 'student' ? 'courses' : 'students')}
          className="p-4 bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 transition-all cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              {role === 'student' ? 'My Courses' : 'Enrolled Students'}
            </span>
            <Users className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {role === 'student' && currentStudent 
              ? currentStudent.enrolledCourseIds.length 
              : totalStudents}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>{role === 'student' ? '14 Credit Hours' : '5 Departments'}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        {/* Active Subjects */}
        <div 
          onClick={() => setActiveTab('courses')}
          className="p-4 bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 transition-all cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              Active Subjects
            </span>
            <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {activeCoursesCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>Fall 2026 Term</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        {/* Attendance Percentage */}
        <div 
          onClick={() => setActiveTab('attendance')}
          className="p-4 bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 transition-all cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              {role === 'student' ? 'My Attendance' : 'Campus Attendance'}
            </span>
            <CheckCircle2 className="w-4 h-4 text-indigo-600 transition-colors" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {role === 'student' && currentStudent 
              ? `${Math.round(currentStudent.attendanceRate)}%` 
              : `${avgCampusAttendance}%`}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span className="text-emerald-700 font-semibold font-mono">Policy &ge; 75% met</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>

        {/* Average GPA */}
        <div 
          onClick={() => setActiveTab('grading')}
          className="p-4 bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 transition-all cursor-pointer group shadow-2xs"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              {role === 'student' ? 'Cumulative GPA' : 'Mean Term GPA'}
            </span>
            <Award className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {role === 'student' && currentStudent ? currentStudent.gpa.toFixed(2) : avgCampusGpa}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>4.00 Max Scale</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>

      {/* Main Clean 2-Column Split: Today's Schedule & Subject Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Today's Class Schedule */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">Today's Class Schedule</h2>
              <span className="text-[11px] font-mono text-slate-400">· Monday</span>
            </div>
            <button
              onClick={() => setActiveTab('timetable')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Week</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {todaysClasses.map((item) => (
              <div 
                key={item.id}
                onClick={() => setActiveTab('timetable')}
                className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-slate-100 text-slate-700 rounded">
                        {item.courseCode}
                      </span>
                      <span className="text-xs font-semibold text-slate-900 truncate">
                        {item.subjectName}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-1.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{item.startTime} – {item.endTime}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{item.room}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>{item.faculty}</span>
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                    {item.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Attendance by Subject */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">Subject Attendance Overview</h2>
            </div>
            <button
              onClick={() => setActiveTab('attendance')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Subject Details</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {subjectList.map((sub) => {
              const isGood = sub.attendanceRate >= 75;
              return (
                <div 
                  key={sub.courseId}
                  onClick={() => {
                    setSelectedCourseId(sub.courseId);
                    setActiveTab('attendance');
                  }}
                  className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="min-w-0 flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {sub.subjectCode}
                      </span>
                      <span className="text-xs text-slate-600 truncate font-medium">
                        {sub.subjectName}
                      </span>
                    </div>
                    <span className={`text-xs font-bold font-mono ${isGood ? 'text-slate-900' : 'text-rose-600'}`}>
                      {sub.attendanceRate}%
                    </span>
                  </div>

                  {/* Clean progress bar */}
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        isGood ? 'bg-indigo-600' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(sub.attendanceRate, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 font-mono">
                    <span>Attended: {sub.classesAttended} / {sub.totalClasses} classes</span>
                    <span>Missed: {sub.classesMissed}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Quick Action Dock */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Need to register for upcoming courses or check study materials?</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('courses')}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Course Catalogue
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Study Materials
          </button>
        </div>
      </div>
    </div>
  );
};
