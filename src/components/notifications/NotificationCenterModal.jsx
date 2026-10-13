import React, { useState, useMemo } from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  Bell, 
  CalendarClock, 
  AlertTriangle, 
  Megaphone, 
  X, 
  Check, 
  CheckCheck, 
  Clock, 
  Calendar, 
  ArrowRight,
  Filter
} from 'lucide-react';

export const NotificationCenterModal = ({ isOpen, onClose }) => {
  const { 
    notifications, 
    markNotificationRead, 
    markAllNotificationsRead, 
    setActiveTab,
    setSelectedCourseId
  } = useCollege();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'deadline', 'schedule', 'announcement'

  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'all') return notifications;
    return notifications.filter((n) => n.type === activeFilter);
  }, [notifications, activeFilter]);

  const unreadCount = notifications.filter((n) => n.unread).length;
  const deadlineCount = notifications.filter((n) => n.type === 'deadline').length;
  const scheduleCount = notifications.filter((n) => n.type === 'schedule').length;
  const announcementCount = notifications.filter((n) => n.type === 'announcement').length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 overflow-y-auto bg-slate-900/40 backdrop-blur-xs modal-backdrop-animate">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-auto sm:my-8 modal-content-animate"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Bell className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  Notification Center
                </h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white font-mono">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Upcoming deadlines, schedule changes & campus announcements
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                title="Mark all as read"
                className="p-1.5 text-xs text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer font-medium"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Mark read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="px-4 py-2 border-b border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer shrink-0 ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setActiveFilter('deadline')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeFilter === 'deadline'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CalendarClock className="w-3.5 h-3.5" />
            <span>Deadlines ({deadlineCount})</span>
          </button>
          <button
            onClick={() => setActiveFilter('schedule')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeFilter === 'schedule'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Schedule ({scheduleCount})</span>
          </button>
          <button
            onClick={() => setActiveFilter('announcement')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeFilter === 'announcement'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Announcements ({announcementCount})</span>
          </button>
        </div>

        {/* Notification Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 divide-y-0">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs italic">
              No notifications in this category.
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const isDeadline = notif.type === 'deadline';
              const isSchedule = notif.type === 'schedule';
              const isAnnouncement = notif.type === 'announcement';

              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    markNotificationRead(notif.id);
                    if (notif.linkTab) {
                      setActiveTab(notif.linkTab);
                      onClose();
                    }
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer group hover:shadow-xs ${
                    notif.unread
                      ? 'bg-slate-50/80 border-slate-200'
                      : 'bg-white border-slate-100 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5 min-w-0">
                      {/* Icon */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isDeadline
                          ? 'bg-rose-50 text-rose-600'
                          : isSchedule
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-indigo-50 text-indigo-600'
                      }`}>
                        {isDeadline && <CalendarClock className="w-4 h-4" />}
                        {isSchedule && <AlertTriangle className="w-4 h-4" />}
                        {isAnnouncement && <Megaphone className="w-4 h-4" />}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                            {notif.courseCode}
                          </span>
                          <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {notif.title}
                          </span>
                          {notif.urgent && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 uppercase tracking-wider font-mono">
                              Urgent
                            </span>
                          )}
                          {notif.unread && (
                            <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                          )}
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {notif.description}
                        </p>

                        {/* Metadata row */}
                        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 pt-1">
                          {notif.dueDate && (
                            <span className="text-rose-600 font-semibold flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>Due: {notif.dueDate}</span>
                            </span>
                          )}
                          {notif.effectiveDate && (
                            <span className="text-amber-700 font-semibold flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{notif.effectiveDate}</span>
                            </span>
                          )}
                          <span>{notif.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Arrow */}
                    <div className="shrink-0 pt-1">
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="font-mono text-[11px]">Real-time Academic Dispatch</span>
          <button
            onClick={() => {
              setActiveTab('notifications');
              onClose();
            }}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
          >
            View Full Notification Board &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
