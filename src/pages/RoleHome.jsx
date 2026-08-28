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
    {
      title: "My Assigned Tasks",
      description: "View tasks assigned to you by your supervisor.",
      href: "/StudentTask",
      icon: ClipboardDocumentListIcon,
    },
    {
      title: "My Logbook",
      description: "Fill in and download your field attendance logbook.",
      href: "/StudentLogbook",
      icon: BookOpenIcon,
    },
    {
      title: "Settings",
      description: "Manage your profile and account preferences.",
      href: "/StudentSettings",
      icon: Cog6ToothIcon,
    },
  ],
  supervisor: [
    {
      title: "Approve Attendance",
      description: "Review and approve your students' logbook entries.",
      href: "/SupervisorAttendance",
      icon: CalendarDaysIcon,
    },
    {
      title: "Manage Tasks",
      description: "Create and edit tasks for your student groups.",
      href: "/SupervisorTasks",
      icon: ClipboardDocumentListIcon,
    },
    {
      title: "Settings",
      description: "Manage your profile and account preferences.",
      href: "/SupervisorSettings",
      icon: Cog6ToothIcon,
    },
  ],
  instructor: [
    {
      title: "Attendance Overview",
      description: "Monitor attendance across all supervisors.",
      href: "/InstructorAttendance",
      icon: CalendarDaysIcon,
    },
    {
      title: "Department Management",
      description: "Assign students to departments and supervisors.",
      href: "/InstructorDepartmentManagement",
      icon: UserGroupIcon,
    },
    {
      title: "Field Applications",
      description: "Review, accept, and activate student field applications.",
      href: "/InstructorApplications",
      icon: DocumentCheckIcon,
    },
    {
      title: "Settings",
      description: "Manage your profile and account preferences.",
      href: "/InstructorSettings",
      icon: Cog6ToothIcon,
    },
  ],
};

const ROLE_BADGE = {
  student: "Student",
  supervisor: "Supervisor",
  instructor: "Instructor",
};

function RoleHome() {
  const { user } = useSelector((state) => state.auth);
  const role = user?.role || "student";
  const actions = ROLE_ACTIONS[role] || ROLE_ACTIONS.student;
  const badge = ROLE_BADGE[role] || "Member";
  const displayName = user?.username || "there";

  return (
    <div className="w-full space-y-7">
      {/* Hero band */}
      <section className="relative overflow-hidden rounded-2xl bg-ink-2 text-white px-6 md:px-9 py-8 md:py-10 shadow-[0_24px_50px_-30px_rgba(10,20,36,0.6)]">
        <div className="pointer-events-none absolute inset-0 topogrid-invert opacity-50" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-moss/20 via-transparent to-transparent" />
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-moss/25 blur-3xl" />
        <div className="pointer-events-none absolute right-12 bottom-4 hidden md:block font-mono-label text-white/15 text-[11px] tracking-widest">
          FMS · ACTIVE SESSION
        </div>

        <div className="relative">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="relative flex h-2.5 w-2.5">
              <span className="live-dot absolute inline-flex h-full w-full rounded-full bg-leaf" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-leaf" />
            </span>
            <span className="font-mono-label text-[10.5px] text-white/55 uppercase tracking-[0.24em]">
              {badge} Dashboard
            </span>
          </div>

          <h1 className="font-display font-semibold text-3xl md:text-4xl tracking-tight">
            Welcome back, <span className="text-moss">{displayName}</span>
          </h1>
          <p className="mt-3 text-white/65 text-sm md:text-base max-w-xl leading-relaxed">
            Everything you need to run your part of the field program — from tasks
            to attendance — is one step away.
          </p>

          <div className="mt-6 flex items-center gap-6 font-mono-label text-[10.5px] text-white/40 uppercase tracking-[0.18em]">
            <span className="flex items-center gap-2">
              <i className="not-italic h-1.5 w-1.5 rounded-full bg-moss" /> Module
              {actions.length}
            </span>
            <span className="hidden sm:flex items-center gap-2">
              <i className="not-italic h-1.5 w-1.5 rounded-full bg-signal" /> Access
              Granted
            </span>
            <span className="hidden md:flex items-center gap-2">
              <i className="not-italic h-1.5 w-1.5 rounded-full bg-moss" /> Live
              Sync
            </span>
          </div>
        </div>
      </section>

      {/* Action grid */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display font-semibold text-xl text-ink-text">
            Your workbench
          </h2>
          <span className="font-mono-label text-[10.5px] text-ink-2-text uppercase tracking-[0.18em]">
            {actions.length} modules
          </span>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {actions.map((action, i) => (
            <Link
              key={action.title}
              to={action.href}
              className="fms-card group p-6"
              style={{ "--reveal-delay": `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-moss/10 text-moss-2 ring-1 ring-moss/20 group-hover:bg-moss group-hover:text-white group-hover:ring-moss transition-all duration-300">
                  <action.icon className="h-6 w-6" />
                </div>
                <span className="font-mono-label text-[11px] text-ink-2-text/60 tracking-widest">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-5 font-semibold text-[15px] text-ink-text group-hover:text-moss-2 transition-colors">
                {action.title}
              </h3>
              <p className="mt-1.5 text-sm text-ink-2-text leading-relaxed">
                {action.description}
              </p>
              <div className="mt-4 flex items-center gap-1.5 font-mono-label text-[11px] text-moss-2 uppercase tracking-[0.14em] opacity-0 group-hover:opacity-100 transition-opacity">
                Open <ArrowRightIcon className="h-3.5 w-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default RoleHome;
