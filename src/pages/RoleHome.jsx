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
      <section className="relative overflow-hidden bg-[#2d2a24] border border-[#3d3a33] px-7 md:px-10 py-9 md:py-11">
        <div className="pointer-events-none absolute inset-0 topogrid-invert opacity-20" />
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#c4622d]/[0.1] blur-[80px]" />

        <div className="relative">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="relative flex h-[6px] w-[6px]">
              <span className="live-dot absolute inline-flex h-full w-full rounded-full bg-[#5a8a3c]" />
              <span className="relative inline-flex rounded-full h-[6px] w-[6px] bg-[#5a8a3c]" />
            </span>
            <span className="font-mono-label text-[9px] text-white/40 uppercase tracking-[0.2em]">
              {badge} Dashboard
            </span>
          </div>

          <h1 className="font-display font-black text-3xl md:text-[2.4rem] text-white tracking-tight leading-[1.1]">
            Welcome back,
            <br />
            <span className="text-[#c4622d]">{displayName}</span>
          </h1>
          <p className="mt-4 text-white/45 text-sm md:text-base max-w-lg leading-relaxed">
            Everything you need to run your part of the field program — from tasks
            to attendance — is one step away.
          </p>

          <div className="mt-7 flex items-center gap-6 font-mono-label text-[9px] text-white/25 uppercase tracking-[0.18em]">
            <span className="flex items-center gap-2">
              <span className="h-[3px] w-[3px] rounded-full bg-[#c4622d]" />
              Module {actions.length}
            </span>
            <span className="hidden sm:flex items-center gap-2">
              <span className="h-[3px] w-[3px] rounded-full bg-[#5a8a3c]" /> Access Granted
            </span>
            <span className="hidden md:flex items-center gap-2">
              <span className="h-[3px] w-[3px] rounded-full bg-white/20" /> Live Sync
            </span>
          </div>
        </div>
      </section>

      {/* Action grid */}
      <section>
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-display font-bold text-xl text-[#2d2a24]">
            Your workbench
          </h2>
          <span className="font-mono-label text-[9px] text-[#a6a199] uppercase tracking-[0.18em]">
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
                <div className="flex h-10 w-10 items-center justify-center bg-[#c4622d]/[0.06] text-[#c4622d] border border-[#c4622d]/15 group-hover:bg-[#c4622d] group-hover:text-white group-hover:border-[#c4622d] transition-all duration-200">
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="font-mono-label text-[10px] text-[#d4cfc6] tracking-[0.12em]">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-4 font-semibold text-[15px] text-[#2d2a24] group-hover:text-[#c4622d] transition-colors">
                {action.title}
              </h3>
              <p className="mt-1.5 text-sm text-[#7a756d] leading-relaxed">
                {action.description}
              </p>
              <div className="mt-4 flex items-center gap-1.5 font-mono-label text-[10px] text-[#c4622d] uppercase tracking-[0.12em] opacity-0 group-hover:opacity-100 transition-opacity">
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
