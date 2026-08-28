import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  BookOpenIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  DocumentCheckIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const ROLE_ACTIONS = {
  student: [
    { title: "My Assigned Tasks", description: "View tasks assigned to you by your supervisor.", href: "/StudentTask", icon: ClipboardDocumentListIcon },
    { title: "My Logbook", description: "Fill in and download your field attendance logbook.", href: "/StudentLogbook", icon: BookOpenIcon },
    { title: "Settings", description: "Manage your profile and account preferences.", href: "/StudentSettings", icon: Cog6ToothIcon },
  ],
  supervisor: [
    { title: "Approve Attendance", description: "Review and approve your students' logbook entries.", href: "/SupervisorAttendance", icon: CalendarDaysIcon },
    { title: "Manage Tasks", description: "Create and edit tasks for your student groups.", href: "/SupervisorTasks", icon: ClipboardDocumentListIcon },
    { title: "Settings", description: "Manage your profile and account preferences.", href: "/SupervisorSettings", icon: Cog6ToothIcon },
  ],
  instructor: [
    { title: "Attendance Overview", description: "Monitor attendance across all supervisors.", href: "/InstructorAttendance", icon: CalendarDaysIcon },
    { title: "Department Management", description: "Assign students to departments and supervisors.", href: "/InstructorDepartmentManagement", icon: UserGroupIcon },
    { title: "Field Applications", description: "Review, accept, and activate student field applications.", href: "/InstructorApplications", icon: DocumentCheckIcon },
    { title: "Settings", description: "Manage your profile and account preferences.", href: "/InstructorSettings", icon: Cog6ToothIcon },
  ],
};

const ROLE_LABEL = {
  student: "Student",
  supervisor: "Supervisor",
  instructor: "Instructor",
};

function RoleHome() {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role || "student";
  const actions = ROLE_ACTIONS[role] || ROLE_ACTIONS.student;
  const badge = ROLE_LABEL[role] || "Member";
  const displayName = user?.username || "there";

  return (
    <div className="w-full space-y-8">
      {/* Hero band */}
      <section className="relative overflow-hidden bg-[#141414] border-2 border-[#2a2a2a] px-7 md:px-10 py-9 md:py-11">
        <div className="pointer-events-none absolute inset-0 topogrid-invert opacity-30" />
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#ccff00]/[0.06] blur-[100px]" />

        <div className="relative">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="relative flex h-2.5 w-2.5">
              <span className="live-dot absolute inline-flex h-full w-full rounded-full bg-[#ccff00]" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ccff00]" />
            </span>
            <span className="font-mono-label text-[9px] text-[#6b6560] uppercase tracking-[0.28em]">
              {badge} Dashboard
            </span>
          </div>

          <h1 className="font-display font-black text-3xl md:text-[2.5rem] text-[#f5f0e8] tracking-tight leading-[1.1]">
            Welcome back,
            <br />
            <span className="text-[#ccff00]">{displayName}</span>
          </h1>
          <p className="mt-4 text-[#6b6560] text-sm md:text-base max-w-lg leading-relaxed">
            Everything you need to run your part of the field program — from tasks
            to attendance — is one step away.
          </p>

          <div className="mt-7 flex items-center gap-6 font-mono-label text-[9px] text-[#3a3a3a] uppercase tracking-[0.22em]">
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ccff00]" />
              Module {actions.length}
            </span>
            <span className="hidden sm:flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff4d4d]" /> Access Granted
            </span>
            <span className="hidden md:flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ccff00]" /> Live Sync
            </span>
          </div>
        </div>
      </section>

      {/* Action grid */}
      <section>
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-display font-black text-xl text-[#f5f0e8]">
            Your workbench
          </h2>
          <span className="font-mono-label text-[9px] text-[#6b6560] uppercase tracking-[0.22em]">
            {actions.length} modules
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {actions.map((action, i) => (
            <Link
              key={action.title}
              to={action.href}
              className="fms-card group p-6"
              style={{ "--reveal-delay": `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center bg-[#ccff00]/[0.08] text-[#ccff00] border border-[#ccff00]/20 group-hover:bg-[#ccff00] group-hover:text-[#0a0a0a] group-hover:border-[#ccff00] transition-all duration-200">
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="font-mono-label text-[10px] text-[#3a3a3a] tracking-[0.18em]">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-5 font-bold text-[15px] text-[#f5f0e8] group-hover:text-[#ccff00] transition-colors">
                {action.title}
              </h3>
              <p className="mt-1.5 text-sm text-[#9a938a] leading-relaxed">
                {action.description}
              </p>
              <div className="mt-4 flex items-center gap-1.5 font-mono-label text-[10px] text-[#ccff00] uppercase tracking-[0.14em] opacity-0 group-hover:opacity-100 transition-opacity">
                Open <ArrowRightIcon className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default RoleHome;
