import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  Bell, 
  CheckCheck, 
  Clock, 
  AlertTriangle, 
  CalendarClock, 
  Megaphone, 
  Calendar,
  Check,
  ArrowRight
} from 'lucide-react';

export const NotificationsView = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, setActiveTab } = useCollege();
  const [filter, setFilter] = useState('all'); // 'all', 'deadline', 'schedule', 'announcement', 'unread'

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return n.unread;
    if (filter === 'deadline') return n.type === 'deadline';
    if (filter === 'schedule') return n.type === 'schedule';
    if (filter === 'announcement') return n.type === 'announcement';
    return true;
  });

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <span className="font-semibold text-slate-800">Unity College</span>
            <span>·</span>
            <span>Academic Bulletin</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-sky-600" />
            <span>Campus Notification Center</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time feed of upcoming assignment deadlines, lecture schedule changes, and official college announcements.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
            filter === 'all'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('deadline')}
          className={`px-3 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
            filter === 'deadline'
              ? 'bg-rose-600 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CalendarClock className="w-3.5 h-3.5" />
          <span>Deadlines</span>
        </button>
        <button
          onClick={() => setFilter('schedule')}
          className={`px-3 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
            filter === 'schedule'
              ? 'bg-amber-600 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Schedule Changes</span>
        </button>
        <button
          onClick={() => setFilter('announcement')}
          className={`px-3 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
            filter === 'announcement'
              ? 'bg-indigo-600 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Megaphone className="w-3.5 h-3.5" />
          <span>Announcements</span>
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
            filter === 'unread'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-400 text-xs italic">
            No notices found in this filter category.
          </div>
        ) : (
          filtered.map((item) => {
            const isDeadline = item.type === 'deadline';
            const isSchedule = item.type === 'schedule';

            return (
              <div
                key={item.id}
                onClick={() => {
                  markNotificationRead(item.id);
                  if (item.linkTab) setActiveTab(item.linkTab);
                }}
                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-start justify-between gap-4 group hover:-translate-y-0.5 hover:shadow-sm ${
                  item.unread
                    ? 'bg-white border-slate-300 shadow-2xs'
                    : 'bg-white/80 border-slate-200/80 hover:bg-white'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                    isDeadline
                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                      : isSchedule
                      ? 'bg-amber-50 text-amber-600 border border-amber-200'
                      : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                  }`}>
                    {isDeadline ? (
                      <CalendarClock className="w-4 h-4" />
                    ) : isSchedule ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <Megaphone className="w-4 h-4" />
                    )}
                  </div>

                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        {item.courseCode}
                      </span>
                      <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {item.title}
                      </span>
                      {item.urgent && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 uppercase tracking-wider font-mono">
                          Urgent
                        </span>
                      )}
                      {item.unread && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                      )}
                    </div>
                    
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 pt-0.5">
                      {item.dueDate && (
                        <span className="text-rose-600 font-semibold flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Due: {item.dueDate}</span>
                        </span>
                      )}
                      {item.effectiveDate && (
                        <span className="text-amber-700 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{item.effectiveDate}</span>
                        </span>
                      )}
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pt-1">
                  {item.unread && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markNotificationRead(item.id);
                      }}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 whitespace-nowrap cursor-pointer"
                    >
                      Mark read
                    </button>
                  )}
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
