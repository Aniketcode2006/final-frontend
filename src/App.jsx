/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CollegeProvider, useCollege } from './context/CollegeContext.jsx';
import { Header } from './components/layout/Header.jsx';
import { Sidebar } from './components/layout/Sidebar.jsx';
import { DashboardView } from './components/dashboard/DashboardView.jsx';
import { CourseCatalogView } from './components/courses/CourseCatalogView.jsx';
import { AttendanceTrackerView } from './components/attendance/AttendanceTrackerView.jsx';
import { TimetableView } from './components/timetable/TimetableView.jsx';
import { UpcomingEventsView } from './components/events/UpcomingEventsView.jsx';
import { NotificationsView } from './components/notifications/NotificationsView.jsx';
import { StudentsClubView } from './components/clubs/StudentsClubView.jsx';
import { StudyMaterialsView } from './components/materials/StudyMaterialsView.jsx';
import { GradingView } from './components/grading/GradingView.jsx';
import { StudentRegistrationView } from './components/students/StudentRegistrationView.jsx';
import { AnalyticsView } from './components/analytics/AnalyticsView.jsx';
import { StudentPortalView } from './components/student/StudentPortalView.jsx';
import { LoginView } from './components/auth/LoginView.jsx';
import { ToastContainer } from './components/common/Toast.jsx';
import { CourseFormModal } from './components/courses/CourseFormModal.jsx';
import { StudentRegisterModal } from './components/students/StudentRegisterModal.jsx';

function MainApp() {
  const { 
    activeTab, 
    role, 
    isAuthenticated, 
  } = useCollege();
  const [isRegisterStudentOpen, setIsRegisterStudentOpen] = useState(false);
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);

  // If user is logged out, show the dedicated Student & Faculty Login Portal
  if (!isAuthenticated) {
    return (
      <>
        <LoginView />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 antialiased font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Bar Header */}
      <Header
        onOpenRegisterStudent={() => setIsRegisterStudentOpen(true)}
        onOpenAddCourse={() => setIsAddCourseOpen(true)}
      />

      {/* Main Viewport Split with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          onOpenRegisterStudent={() => setIsRegisterStudentOpen(true)}
          onOpenAddCourse={() => setIsAddCourseOpen(true)}
        />

        {/* Dynamic Content Surface */}
        <main className="flex-1 overflow-y-auto bg-slate-50 pb-16 transition-all">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'timetable' && <TimetableView />}
          {activeTab === 'attendance' && <AttendanceTrackerView />}
          {activeTab === 'courses' && <CourseCatalogView />}
          {activeTab === 'events' && <UpcomingEventsView />}
          {activeTab === 'notifications' && <NotificationsView />}
          {activeTab === 'clubs' && <StudentsClubView />}
          {activeTab === 'materials' && <StudyMaterialsView />}
          {activeTab === 'grading' && <GradingView />}
          
          {activeTab === 'students' && (
            <StudentRegistrationView
              isRegisterModalOpen={isRegisterStudentOpen}
              setIsRegisterModalOpen={setIsRegisterStudentOpen}
            />
          )}

          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'portal' && <StudentPortalView />}
        </main>
      </div>

      {/* Modals & Dialogs */}
      <StudentRegisterModal
        isOpen={isRegisterStudentOpen}
        onClose={() => setIsRegisterStudentOpen(false)}
      />

      <CourseFormModal
        isOpen={isAddCourseOpen}
        onClose={() => setIsAddCourseOpen(false)}
      />

      {/* Responsive Toast Feedback System */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <CollegeProvider>
      <MainApp />
    </CollegeProvider>
  );
}
