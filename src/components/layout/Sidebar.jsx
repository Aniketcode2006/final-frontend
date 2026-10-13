import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  LayoutDashboard, 
  CalendarDays, 
  CalendarCheck2, 
  BookOpen, 
  Sparkles, 
  Bell, 
  Users2, 
  FolderOpen, 
  FileSpreadsheet, 
  GraduationCap, 
  RotateCcw, 
  LogOut,
  School,
  Pin,
  PinOff,
  Camera
} from 'lucide-react';

export const Sidebar = () => {
  const { 
    activeTab, 
    setActiveTab, 
    role, 
    courses, 
    notifications, 
    studentClubs, 
    resetToDefaults, 
    currentStudent,
    isSidebarCollapsed, 
    setIsSidebarCollapsed,
    setIsStudentPhotoModalOpen, 
    logout 
  } = useCollege();

  // Automatic open/close on hover
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const unreadNotifCount = notifications.filter((n) => n.unread).length;

  // The sidebar is open if pinned OR hovered
  const isExpanded = isPinned || isHovered;

  // Navigation Items - Each with a distinctive royal color and attendance icon updated to CalendarCheck2
  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
      colorClass: 'text-blue-600 bg-blue-50/90 border border-blue-200/50',
      activeColor: 'bg-blue-600 text-white',
    },
    { 
      id: 'timetable', 
      label: 'Schedule', 
      fullName: 'Class Schedule',
      icon: <CalendarDays className="w-4 h-4 shrink-0" />,
      colorClass: 'text-indigo-600 bg-indigo-50/90 border border-indigo-200/50',
      activeColor: 'bg-indigo-600 text-white',
      badge: 'Mon–Sat'
    },
    { 
      id: 'attendance', 
      label: 'Attendance', 
      fullName: 'Attendance',
      // Updated attendance icon as requested: CalendarCheck2 (royal calendar with checkmark)
      icon: <CalendarCheck2 className="w-4 h-4 shrink-0" />,
      colorClass: 'text-emerald-600 bg-emerald-50/90 border border-emerald-200/50',
      activeColor: 'bg-emerald-600 text-white',
    },
    { 
      id: 'courses', 
      label: 'Courses', 
      fullName: 'Course Catalogue',
      icon: <BookOpen className="w-4 h-4 shrink-0" />, 
      colorClass: 'text-rose-600 bg-rose-50/90 border border-rose-200/50',
      activeColor: 'bg-rose-600 text-white',
      badge: `${courses.length}` 
    },
    { 
      id: 'events', 
      label: 'Events', 
      fullName: 'Upcoming Events',
      icon: <Sparkles className="w-4 h-4 shrink-0" />,
      colorClass: 'text-amber-500 bg-amber-50/90 border border-amber-200/50',
      activeColor: 'bg-amber-500 text-white',
    },
    { 
      id: 'notifications', 
      label: 'Notices', 
      fullName: 'Notifications',
      icon: <Bell className="w-4 h-4 shrink-0" />,
      colorClass: 'text-sky-600 bg-sky-50/90 border border-sky-200/50',
      activeColor: 'bg-sky-600 text-white',
      badge: unreadNotifCount > 0 ? `${unreadNotifCount}` : undefined
    },
    { 
      id: 'clubs', 
      label: 'Clubs', 
      fullName: 'Students Club',
      icon: <Users2 className="w-4 h-4 shrink-0" />,
      colorClass: 'text-purple-600 bg-purple-50/90 border border-purple-200/50',
      activeColor: 'bg-purple-600 text-white',
      badge: `${studentClubs.length}`
    },
    { 
      id: 'materials', 
      label: 'Materials', 
      fullName: 'Study Materials',
      icon: <FolderOpen className="w-4 h-4 shrink-0" />,
      colorClass: 'text-teal-600 bg-teal-50/90 border border-teal-200/50',
      activeColor: 'bg-teal-600 text-white',
    },
    { 
      id: 'grading', 
      label: role === 'student' ? 'Transcripts' : 'Gradebook', 
      fullName: role === 'student' ? 'My Transcripts' : 'Gradebook',
      icon: <FileSpreadsheet className="w-4 h-4 shrink-0" />,
      colorClass: 'text-violet-600 bg-violet-50/90 border border-violet-200/50',
      activeColor: 'bg-violet-600 text-white',
    },
    ...(role !== 'student' ? [
      { 
        id: 'students', 
        label: 'Directory', 
        fullName: 'Student Directory',
        icon: <GraduationCap className="w-4 h-4 shrink-0" />,
        colorClass: 'text-slate-700 bg-slate-100 border border-slate-200/50',
        activeColor: 'bg-slate-800 text-white',
      }
    ] : [])
  ];

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`${
        isExpanded ? 'w-56' : 'w-20'
      } bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-57px)] transition-all duration-300 ease-in-out select-none z-20 shadow-xs relative`}
    >
      {/* Sidebar Header */}
      <div className="p-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
            <School className="w-4 h-4 text-indigo-400" />
          </div>
          {isExpanded && (
            <div className="min-w-0 transition-opacity duration-200">
              <div className="text-xs font-bold text-slate-900 truncate">Unity College</div>
              <div className="text-[10px] text-slate-500 truncate capitalize font-medium">{role} Portal</div>
            </div>
          )}
        </div>

        {/* Pin lock button when hovered */}
        {isExpanded && (
          <button
            onClick={() => setIsPinned(!isPinned)}
            title={isPinned ? 'Unpin auto-collapse' : 'Pin sidebar open'}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              isPinned ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            {isPinned ? <Pin className="w-3.5 h-3.5 fill-indigo-600" /> : <PinOff className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Main Navigation: Icon on top with its specific name in small fonts below */}
      <nav className="p-2 flex-1 flex flex-col gap-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={item.fullName || item.label}
              className={`w-full flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-150 cursor-pointer group relative ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs font-semibold ring-1 ring-slate-800'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 hover:shadow-2xs'
              }`}
            >
              {/* Royal-colored icon container */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 duration-150 ${
                isActive ? 'bg-white/15 text-white' : item.colorClass
              }`}>
                {item.icon}
              </div>

              {/* Specific Name in small font below icon */}
              <span className={`text-[10px] font-medium leading-tight mt-1 text-center truncate max-w-full px-0.5 tracking-tight ${
                isActive ? 'text-white font-semibold' : 'text-slate-600 group-hover:text-slate-900'
              }`}>
                {isExpanded ? (item.fullName || item.label) : item.label}
              </span>

              {/* Subtle badge counter if applicable */}
              {item.badge && (
                <span className={`absolute top-1.5 right-1.5 text-[9px] font-mono font-bold px-1 py-0.2 rounded-full ${
                  isActive ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Utility & Sign Out */}
      <div className="p-2 border-t border-slate-100 flex flex-col gap-1.5 text-xs text-slate-500">
        {/* Student Photo Profile Trigger */}
        {currentStudent && (
          <button
            onClick={() => setIsStudentPhotoModalOpen(true)}
            title="Student picture (Click to put or change photo)"
            className="w-full flex items-center gap-2 py-1.5 px-2 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/80 hover:border-indigo-300 transition-all cursor-pointer group"
          >
            <div className="relative shrink-0">
              {currentStudent.avatarUrl ? (
                <img
                  src={currentStudent.avatarUrl}
                  alt={currentStudent.firstName}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-indigo-400 group-hover:scale-105 transition-transform"
                />
              ) : (
                <div
                  className={`w-6 h-6 rounded-full bg-gradient-to-br ${currentStudent.avatarBg} text-white flex items-center justify-center font-bold text-[10px]`}
                >
                  {currentStudent.firstName[0]}
                </div>
              )}
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-slate-900 text-white flex items-center justify-center ring-1 ring-white">
                <Camera className="w-1.5 h-1.5 text-indigo-300" />
              </div>
            </div>

            {isExpanded && (
              <div className="flex flex-col text-left truncate leading-tight">
                <span className="text-[11px] font-bold text-slate-800 group-hover:text-indigo-600 truncate">
                  {currentStudent.firstName} {currentStudent.lastName}
                </span>
                <span className="text-[9px] text-indigo-600 font-medium">Put / Change Photo</span>
              </div>
            )}
          </button>
        )}

        <button
          onClick={resetToDefaults}
          title="Reset sample college database"
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer text-[11px]"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          {isExpanded && <span>Reset Demo Data</span>}
        </button>
        {isExpanded && (
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors cursor-pointer text-[11px] font-medium"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
};
