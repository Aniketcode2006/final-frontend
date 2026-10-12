import React from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  LayoutDashboard, 
  CalendarDays, 
  CheckCircle2, 
  BookOpen, 
  Sparkles, 
  Bell, 
  Users2, 
  FolderOpen, 
  FileSpreadsheet, 
  GraduationCap, 
  RotateCcw, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  School
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
    logout
  } = useCollege();

  const unreadNotifCount = notifications.filter(n => n.unread).length;

  // Navigation Items required by user - each with a unique, separate icon
  const primaryNavItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" /> 
    },
    { 
      id: 'timetable', 
      label: 'Class Schedule', 
      icon: <CalendarDays className="w-4 h-4 shrink-0" />,
      badge: 'Mon–Sat'
    },
    { 
      id: 'attendance', 
      label: 'Attendance', 
      icon: <CheckCircle2 className="w-4 h-4 shrink-0" />
    },
    { 
      id: 'courses', 
      label: 'Course Catalogue', 
      icon: <BookOpen className="w-4 h-4 shrink-0" />, 
      badge: `${courses.length}` 
    },
    { 
      id: 'events', 
      label: 'Upcoming Events', 
      icon: <Sparkles className="w-4 h-4 shrink-0" />,
      badge: 'Fall 26'
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: <Bell className="w-4 h-4 shrink-0" />,
      badge: unreadNotifCount > 0 ? `${unreadNotifCount}` : undefined,
      badgeColor: 'bg-indigo-600 text-white'
    },
    { 
      id: 'clubs', 
      label: 'Students Club', 
      icon: <Users2 className="w-4 h-4 shrink-0" />,
      badge: `${studentClubs.length}`
    },
    { 
      id: 'materials', 
      label: 'Study Materials', 
      icon: <FolderOpen className="w-4 h-4 shrink-0" /> 
    },
  ];

  // Secondary academic items (Gradebook & Student Directory)
  const academicNavItems = [
    { 
      id: 'grading', 
      label: role === 'student' ? 'My Transcripts' : 'Gradebook', 
      icon: <FileSpreadsheet className="w-4 h-4 shrink-0" /> 
    },
    ...(role !== 'student' ? [
      { 
        id: 'students', 
        label: 'Student Directory', 
        icon: <GraduationCap className="w-4 h-4 shrink-0" /> 
      }
    ] : [])
  ];

  const renderNavButton = (item) => {
    const isActive = activeTab === item.id;
    return (
      <button
        key={item.id}
        onClick={() => setActiveTab(item.id)}
        title={isSidebarCollapsed ? item.label : undefined}
        className={`w-full flex items-center ${
          isSidebarCollapsed ? 'justify-center px-2 py-2.5' : 'justify-between px-3 py-2'
        } rounded-lg text-xs font-medium transition-colors cursor-pointer ${
          isActive
            ? 'bg-slate-900 text-white shadow-xs font-semibold'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
      >
        <div className={`flex items-center ${isSidebarCollapsed ? '' : 'gap-2.5 truncate'}`}>
          <span className={isActive ? 'text-indigo-400' : 'text-slate-500'}>
            {item.icon}
          </span>
          {!isSidebarCollapsed && (
            <span className="truncate">{item.label}</span>
          )}
        </div>

        {!isSidebarCollapsed && item.badge && (
          <span
            className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${
              item.badgeColor || (isActive ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600')
            }`}
          >
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside
      className={`${
        isSidebarCollapsed ? 'w-16' : 'w-60'
      } bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-[calc(100vh-57px)] transition-all duration-150 select-none z-20`}
    >
      {/* Sidebar Header & Toggle */}
      <div className={`border-b border-slate-100 ${isSidebarCollapsed ? 'p-2.5' : 'p-3'} flex items-center justify-between`}>
        {!isSidebarCollapsed ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
              <School className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">Unity College</div>
              <div className="text-[10px] text-slate-500 truncate capitalize font-medium">{role} Portal</div>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              <School className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
        )}

        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className={`p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer ${
            isSidebarCollapsed ? 'hidden' : 'block'
          }`}
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Profile quick summary for student */}
      {role === 'student' && currentStudent && !isSidebarCollapsed && (
        <div className="mx-3 mt-3 p-2 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${currentStudent.avatarBg} text-white flex items-center justify-center font-bold text-[11px] shrink-0`}>
            {currentStudent.firstName[0]}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-semibold text-slate-800 truncate">
              {currentStudent.firstName} {currentStudent.lastName}
            </div>
            <div className="text-[10px] text-slate-500 font-mono truncate">
              {currentStudent.studentId} · {currentStudent.year}
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Links */}
      <nav className={`${isSidebarCollapsed ? 'p-2' : 'p-3'} flex-1 flex flex-col gap-1 overflow-y-auto`}>
        {!isSidebarCollapsed && (
          <div className="px-3 pt-1 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Main Menu
          </div>
        )}
        
        {primaryNavItems.map(renderNavButton)}

        <div className="my-2 border-t border-slate-100" />

        {!isSidebarCollapsed && (
          <div className="px-3 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Academic Records
          </div>
        )}

        {academicNavItems.map(renderNavButton)}
      </nav>

      {/* Toggle button when collapsed */}
      {isSidebarCollapsed && (
        <div className="p-2 border-t border-slate-100 flex justify-center">
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Footer Controls */}
      <div className={`border-t border-slate-100 ${isSidebarCollapsed ? 'p-2 justify-center' : 'p-3 justify-between'} flex items-center text-xs text-slate-500`}>
        <button
          onClick={resetToDefaults}
          title="Reset database to initial state"
          className="flex items-center gap-1.5 hover:text-slate-900 transition-colors p-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          {!isSidebarCollapsed && <span className="text-[11px]">Reset Data</span>}
        </button>
        {!isSidebarCollapsed && (
          <button
            onClick={logout}
            className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-rose-600 transition-colors font-medium cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
};
