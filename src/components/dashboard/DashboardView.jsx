import React from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  Users, 
  BookOpen, 
  CalendarCheck2, 
  Award, 
  CalendarDays, 
  Clock, 
  MapPin, 
  User, 
  ArrowRight,
  ChevronRight,
  Camera
} from 'lucide-react';
import { SUBJECT_ATTENDANCE_DATA } from '../../data/mockData.js';
import { DashboardScheduleDeck } from './DashboardScheduleDeck.jsx';

export const DashboardView = () => {
  const { 
    students, 
    courses, 
    setActiveTab, 
    role,
    currentStudent,
    setIsStudentPhotoModalOpen,
    setSelectedCourseId
  } = useCollege();

  // Metrics computation
  const totalStudents = students.length;
  const activeCoursesCount = courses.length;

  const totalGpa = students.reduce((acc, s) => acc + s.gpa, 0);
  const avgCampusGpa = totalStudents > 0 ? (totalGpa / totalStudents).toFixed(2) : '3.60';

  const totalAttendance = students.reduce((acc, s) => acc + s.attendanceRate, 0);
  const avgCampusAttendance = totalStudents > 0 ? Math.round(totalAttendance / totalStudents) : 92;

  // Attendance subjects preview
  const subjectList = Object.values(SUBJECT_ATTENDANCE_DATA).slice(0, 4);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Clean Header & Navigation Shortcuts */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3.5">
          {role === 'student' && currentStudent && (
            <div 
              onClick={() => setIsStudentPhotoModalOpen(true)}
              className="relative cursor-pointer group shrink-0"
              title="Click to put or change student photo"
            >
              {currentStudent.avatarUrl ? (
                <img
                  src={currentStudent.avatarUrl}
                  alt={currentStudent.firstName}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500 shadow-xs group-hover:scale-105 transition-all"
                />
              ) : (
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentStudent.avatarBg} text-white flex items-center justify-center font-bold text-lg ring-2 ring-indigo-500/40 shadow-xs group-hover:scale-105 transition-all`}
                >
                  {currentStudent.firstName[0]}
                </div>
              )}
              <div 
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md ring-1 ring-white group-hover:bg-indigo-600 transition-colors"
                title="Put / change picture"
              >
                <Camera className="w-2.5 h-2.5 text-indigo-200" />
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-0.5">
              <span className="font-semibold text-slate-800">Unity College</span>
              <span>·</span>
              <span>Fall 2026</span>
              {role === 'student' && currentStudent && (
                <>
                  <span>·</span>
                  <span className="text-indigo-600 font-semibold">{currentStudent.studentId}</span>
                </>
              )}
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {role === 'student' && currentStudent 
                ? `Welcome, ${currentStudent.firstName}` 
                : 'Campus Academic Dashboard'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {role === 'student' && currentStudent 
                ? `${currentStudent.department} · Advisor: ${currentStudent.advisor}`
                : 'Overview of current semester classes, attendance rates, and academic schedule.'}
            </p>
          </div>
        </div>

        {/* Quick Nav Switches between Dashboard, Attendance, and Class Schedule */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('attendance')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:shadow-2xs hover:border-slate-300 transition-all cursor-pointer"
          >
            <CalendarCheck2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Attendance</span>
          </button>
          <button
            onClick={() => setActiveTab('timetable')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 hover:shadow-xs transition-all cursor-pointer"
          >
            <CalendarDays className="w-3.5 h-3.5 text-indigo-400" />
            <span>Class Schedule</span>
          </button>
        </div>
      </div>

      {/* 4 Clean Minimalist Stat Cards with Hover Lift */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Enrolled Students / My Courses */}
        <div 
          onClick={() => setActiveTab(role === 'student' ? 'courses' : 'students')}
          className="p-4 bg-white rounded-xl border border-slate-200/90 hover:border-blue-300 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer group shadow-2xs relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              {role === 'student' ? 'My Courses' : 'Enrolled Students'}
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {role === 'student' && currentStudent 
              ? currentStudent.enrolledCourseIds.length 
              : totalStudents}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>{role === 'student' ? '14 Credit Hours' : '5 Departments'}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        {/* Active Subjects */}
        <div 
          onClick={() => setActiveTab('courses')}
          className="p-4 bg-white rounded-xl border border-slate-200/90 hover:border-rose-300 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer group shadow-2xs relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              Active Subjects
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {activeCoursesCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>Fall 2026 Term</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        {/* Attendance Percentage */}
        <div 
          onClick={() => setActiveTab('attendance')}
          className="p-4 bg-white rounded-xl border border-slate-200/90 hover:border-emerald-300 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer group shadow-2xs relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              {role === 'student' ? 'My Attendance' : 'Campus Attendance'}
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {role === 'student' && currentStudent 
              ? `${Math.round(currentStudent.attendanceRate)}%` 
              : `${avgCampusAttendance}%`}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span className="text-emerald-700 font-semibold font-mono">Policy &ge; 75% met</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        {/* Average GPA */}
        <div 
          onClick={() => setActiveTab('grading')}
          className="p-4 bg-white rounded-xl border border-slate-200/90 hover:border-amber-300 hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer group shadow-2xs relative overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              {role === 'student' ? 'Cumulative GPA' : 'Mean Term GPA'}
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-2">
            {role === 'student' && currentStudent ? currentStudent.gpa.toFixed(2) : avgCampusGpa}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>4.00 Max Scale</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>

      {/* 3D Deck Perspective Class Schedule & Daily Routine in the Dashboard */}
      <DashboardScheduleDeck />

      {/* Subject Attendance Overview */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CalendarCheck2 className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-900">Subject Attendance Overview</h2>
            <span className="text-xs font-mono text-slate-400">· Minimum requirement &ge; 75%</span>
          </div>
          <button
            onClick={() => setActiveTab('attendance')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Full Attendance Tracker</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {subjectList.map((sub) => {
            const isGood = sub.attendanceRate >= 75;
            return (
              <div 
                key={sub.courseId}
                onClick={() => {
                  setSelectedCourseId(sub.courseId);
                  setActiveTab('attendance');
                }}
                className="p-3.5 rounded-xl border border-slate-100 hover:border-emerald-300 hover:bg-slate-50/80 hover:shadow-2xs hover:-translate-y-0.5 transition-all duration-150 cursor-pointer group bg-slate-50/40"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-slate-900">
                    {sub.subjectCode}
                  </span>
                  <span className={`text-xs font-bold font-mono ${isGood ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {sub.attendanceRate}%
                  </span>
                </div>
                <div className="text-xs text-slate-600 truncate font-medium mb-2" title={sub.subjectName}>
                  {sub.subjectName}
                </div>

                {/* Clean progress bar */}
                <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      isGood ? 'bg-emerald-600' : 'bg-rose-500'
                    }`}
                    style={{ width: `${Math.min(sub.attendanceRate, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-mono">
                  <span>{sub.classesAttended}/{sub.totalClasses} classes</span>
                  <span>{sub.classesMissed} missed</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
