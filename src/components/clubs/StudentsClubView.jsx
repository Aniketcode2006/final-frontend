import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  Users2, 
  MapPin, 
  Clock, 
  User, 
  Check, 
  Plus, 
  Sparkles,
  Search
} from 'lucide-react';

export const StudentsClubView = () => {
  const { studentClubs, toggleClubJoin } = useCollege();
  const [search, setSearch] = useState('');

  const filtered = studentClubs.filter((c) => {
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <span className="font-semibold text-slate-800">Unity College</span>
            <span>·</span>
            <span>Student Life & Associations</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users2 className="w-6 h-6 text-indigo-600" />
            <span>Students Clubs & Societies</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Join academic guilds, technology chapters, debate societies, and inter-disciplinary project teams.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            placeholder="Search clubs & societies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 text-xs rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Clubs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((club) => (
          <div
            key={club.id}
            className="bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 transition-all p-5 shadow-2xs space-y-3.5 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 font-mono">
                  {club.category}
                </span>
                <span className="text-xs font-mono text-slate-500">
                  {club.members} active members
                </span>
              </div>

              <h2 className="text-base font-bold text-slate-900 leading-snug">
                {club.name}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed min-h-[40px]">
                {club.description}
              </p>

              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-700">Lead: {club.lead}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{club.meetingTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{club.venue}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className={`text-[11px] font-semibold flex items-center gap-1 ${
                club.joined ? 'text-emerald-700' : 'text-slate-400'
              }`}>
                {club.joined ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Member Active</span>
                  </>
                ) : (
                  <span>Open to Join</span>
                )}
              </span>

              <button
                onClick={() => toggleClubJoin(club.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  club.joined
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xs'
                }`}
              >
                {club.joined ? 'Leave Club' : 'Join Club'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
