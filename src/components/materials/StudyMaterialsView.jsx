import React, { useState } from 'react';
import { useCollege } from '../../context/CollegeContext.jsx';
import { 
  FolderOpen, 
  Download, 
  Search, 
  FileText, 
  BookOpen, 
  Calendar, 
  User, 
  Check, 
  ExternalLink 
} from 'lucide-react';

export const StudyMaterialsView = () => {
  const { studyMaterials, courses, showToast } = useCollege();
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = studyMaterials.filter((m) => {
    const matchesCourse = selectedCourse === 'all' || m.courseCode === selectedCourse;
    const matchesQuery = 
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.courseName.toLowerCase().includes(search.toLowerCase()) ||
      m.category.toLowerCase().includes(search.toLowerCase());
    return matchesCourse && matchesQuery;
  });

  const handleDownload = (material) => {
    showToast(`Downloading "${material.title}" (${material.size})...`, 'success');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <span className="font-semibold text-slate-800">Unity College</span>
            <span>·</span>
            <span>Curriculum Resource Repository</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-indigo-600" />
            <span>Study Materials & Lecture Notes</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified course slides, past examination question sets, lab handouts, and dataset bundles.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label htmlFor="material-course" className="text-xs font-bold text-slate-700 whitespace-nowrap flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>Course:</span>
          </label>
          <select
            id="material-course"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
          >
            <option value="all">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.code}>
                {c.code} — {c.title}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Search documents by keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Materials Table / Card List */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200/70 text-[11px] text-slate-500 font-semibold uppercase tracking-wider font-mono">
              <tr>
                <th className="py-2.5 px-4">Subject</th>
                <th className="py-2.5 px-4">Document Title</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4">File Type & Size</th>
                <th className="py-2.5 px-4">Faculty</th>
                <th className="py-2.5 px-4">Uploaded</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                    No study materials found for this search.
                  </td>
                </tr>
              ) : (
                filtered.map((mat) => (
                  <tr key={mat.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-indigo-700 whitespace-nowrap">
                      {mat.courseCode}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs">
                      {mat.title}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium whitespace-nowrap">
                        {mat.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                      {mat.type} · {mat.size}
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {mat.instructor}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {mat.uploadedDate}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleDownload(mat)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
