import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { UserCheck, ShieldCheck, GraduationCap, PlusCircle, Radio, LogOut, Bell, Camera } from 'lucide-react';
import { TableDensityToggle } from '../common/TableDensityToggle.jsx';
import { NotificationCenterModal } from '../notifications/NotificationCenterModal.jsx';

export const Header = ({ onOpenRegisterStudent, onOpenAddCourse }) => {
  const { 
    role, 
    setRole, 
    activeTab, 
    setActiveTab, 
    liveSession, 
    currentStudent,
    notifications,
    setIsStudentPhotoModalOpen,
    logout 
  } = useCollege();

  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);
  const unreadCount = notifications ? notifications.filter((n) => n.unread).length : 0;

  return (
    <header className="flex items-center justify-between gap-4 px-6 py-3 bg-white border-b border-slate-200 shrink-0 sticky top-0 z-30">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-3">
        <a 
          href="#dashboard" 
          onClick={(e) => { e.preventDefault(); setActiveTab('dashboard'); }}
          className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <div className="w-7 h-7 rounded-md bg-slate-900 flex items-center justify-center text-white font-mono text-xs font-semibold">
            U
          </div>
          <span>Unity College</span>
        </a>
        <span className="hidden sm:inline-block text-xs text-slate-400 font-mono">
          · Fall Term 2026
        </span>
      </div>

      {/* Zone 2: Navigation Links (Single-line concise labels) */}
      <nav className="hidden xl:flex items-center gap-4 text-xs font-medium text-slate-600">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
            activeTab === 'dashboard' ? 'text-slate-900 font-bold' : 'hover:text-slate-900'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('timetable')}
          className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
            activeTab === 'timetable' ? 'text-slate-900 font-bold' : 'hover:text-slate-900'
          }`}
        >
          Class Schedule
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
            activeTab === 'attendance' ? 'text-slate-900 font-bold' : 'hover:text-slate-900'
          }`}
        >
          Attendance
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
            activeTab === 'courses' ? 'text-slate-900 font-bold' : 'hover:text-slate-900'
          }`}
        >
          Course Catalogue
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
            activeTab === 'events' ? 'text-slate-900 font-bold' : 'hover:text-slate-900'
          }`}
        >
          Events
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
            activeTab === 'notifications' ? 'text-slate-900 font-bold' : 'hover:text-slate-900'
          }`}
        >
          Notifications
        </button>
        <button
          onClick={() => setActiveTab('clubs')}
          className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
            activeTab === 'clubs' ? 'text-slate-900 font-bold' : 'hover:text-slate-900'
          }`}
        >
          Students Club
        </button>
        <button
          onClick={() => setActiveTab('materials')}
          className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
            activeTab === 'materials' ? 'text-slate-900 font-bold' : 'hover:text-slate-900'
          }`}
        >
          Study Materials
        </button>
      </nav>

      {/* Zone 3: Role Switcher & Table Density & Primary Action */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Table Density Controller for clean, smaller tables */}
        <TableDensityToggle className="hidden md:inline-flex" />

        {/* Role Switcher & Student Photo Profile Badge */}
        {role === 'student' && currentStudent ? (
          <button
            onClick={() => setIsStudentPhotoModalOpen(true)}
            title={`Active Student: ${currentStudent.firstName} ${currentStudent.lastName} (${currentStudent.studentId}) — Click to change picture`}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200 hover:border-indigo-300 transition-all shadow-2xs group cursor-pointer"
          >
            <div className="relative">
              {currentStudent.avatarUrl ? (
                <img
                  src={currentStudent.avatarUrl}
                  alt={currentStudent.firstName}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/80 shrink-0 group-hover:scale-105 transition-transform"
                />
              ) : (
                <div
                  className={`w-7 h-7 rounded-full bg-gradient-to-br ${currentStudent.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-slate-300`}
                >
                  {currentStudent.firstName[0]}
                </div>
              )}
              {/* Camera icon badge to indicate they can put their picture */}
              <div 
                className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xs ring-1 ring-white"
                title="Put / change photo"
              >
                <Camera className="w-2 h-2 text-indigo-300" />
              </div>
            </div>
            <div className="flex flex-col text-left leading-tight">
              <span className="font-semibold text-slate-800 text-xs group-hover:text-indigo-600 transition-colors truncate max-w-[120px]">
                {currentStudent.firstName} {currentStudent.lastName}
              </span>
              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <span>{currentStudent.studentId}</span>
                <span className="text-indigo-600 font-bold hidden sm:inline">· Photo</span>
              </span>
            </div>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            {/* Quick access to student avatar even in faculty/admin mode */}
            {currentStudent && (
              <button
                onClick={() => setIsStudentPhotoModalOpen(true)}
                title={`Student Profile (${currentStudent.firstName}) — Click to put/change picture`}
                className="relative flex items-center justify-center p-1 rounded-full hover:ring-2 hover:ring-indigo-400 transition-all cursor-pointer"
              >
                {currentStudent.avatarUrl ? (
                  <img
                    src={currentStudent.avatarUrl}
                    alt={currentStudent.firstName}
                    className="w-6 h-6 rounded-full object-cover shrink-0 ring-1 ring-slate-300"
                  />
                ) : (
                  <div
                    className={`w-6 h-6 rounded-full bg-gradient-to-br ${currentStudent.avatarBg} text-white flex items-center justify-center font-bold text-[10px] shrink-0`}
                  >
                    {currentStudent.firstName[0]}
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-slate-900 text-white flex items-center justify-center ring-1 ring-white">
                  <Camera className="w-1.5 h-1.5 text-indigo-300" />
                </div>
              </button>
            )}

            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setRole('professor')}
                title="Professor View: Focus on real-time attendance roll-call and grading"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  role === 'professor'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden md:inline">Professor</span>
              </button>
              <button
                onClick={() => setRole('admin')}
                title="Administrator View: Full access to add/edit courses, registrations, and settings"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  role === 'admin'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden md:inline">Admin</span>
              </button>
            </div>
          </div>
        )}

        {/* Primary Action Button depending on Role */}
        {role === 'admin' ? (
          <button
            onClick={activeTab === 'courses' ? onOpenAddCourse : onOpenRegisterStudent}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{activeTab === 'courses' ? 'New Course' : 'Register Student'}</span>
          </button>
        ) : role === 'professor' ? (
          <button
            onClick={() => setActiveTab('attendance')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors whitespace-nowrap shrink-0 shadow-xs"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Live Attendance</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('courses')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap shrink-0 shadow-xs"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Browse Catalog</span>
          </button>
        )}

        {/* Notification Center Trigger Bell Icon */}
        <button
          onClick={() => setIsNotificationCenterOpen(true)}
          title="Notification Center (Deadlines, Schedule Changes & Announcements)"
          className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-150 cursor-pointer group"
          aria-label="Open notifications"
        >
          <Bell className="w-4 h-4 group-hover:scale-110 transition-transform text-slate-700" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
            </span>
          )}
        </button>

        {/* Student Logout button */}
        <button
          onClick={logout}
          title="Sign Out / Switch User"
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors shrink-0 cursor-pointer"
          aria-label="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Notification Center Modal */}
      <NotificationCenterModal
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
      />
    </header>
  );
};
