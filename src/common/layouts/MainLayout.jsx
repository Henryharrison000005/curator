import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import BreadCrump from "../components/BreadCrump";
import { UserLogout } from "../../store/reducers/auth";
import { Outlet } from "react-router-dom";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  ArrowLeftOnRectangleIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  HomeIcon,
  XMarkIcon,
  Cog6ToothIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  DocumentCheckIcon,
} from "@heroicons/react/24/outline";

import MainHeader from "../components/MainHeader";

const STUDENT_NAVIGATION = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Logbook", href: "/StudentLogbook", icon: BookOpenIcon },
  { name: "Tasks", href: "/StudentTask", icon: ClipboardDocumentListIcon },
  { name: "Settings", href: "/StudentSettings", icon: Cog6ToothIcon },
];

const SUPERVISOR_NAVIGATION = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Attendance", href: "/SupervisorAttendance", icon: CalendarDaysIcon },
  { name: "Tasks", href: "/SupervisorTasks", icon: ClipboardDocumentListIcon },
  { name: "Settings", href: "/SupervisorSettings", icon: Cog6ToothIcon },
];

const INSTRUCTOR_NAVIGATION = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Attendance", href: "/InstructorAttendance", icon: CalendarDaysIcon },
  {
    name: "Departments",
    href: "/InstructorDepartmentManagement",
    icon: UserGroupIcon,
  },
  {
    name: "Applications",
    href: "/InstructorApplications",
    icon: DocumentCheckIcon,
  },
  { name: "Settings", href: "/InstructorSettings", icon: Cog6ToothIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Logo = () => (
  <div className="flex items-center gap-3">
    <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-moss-2 to-moss text-white shadow-[0_8px_20px_-8px_rgba(15,181,174,0.8)]">
      <span className="font-display font-black text-lg leading-none">F</span>
      <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-signal ring-2 ring-ink-2" />
    </div>
    <div className="leading-tight">
      <span className="font-display font-bold text-white text-lg tracking-tight block">
        FMS
      </span>
      <span className="font-mono-label text-[9.5px] text-white/45 uppercase tracking-[0.22em]">
        Field Atlas
      </span>
    </div>
  </div>
);

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const role = user?.role || "student";
  const navigation =
    role === "supervisor"
      ? SUPERVISOR_NAVIGATION
      : role === "instructor"
      ? INSTRUCTOR_NAVIGATION
      : STUDENT_NAVIGATION;

  const handleLogout = async () => {
    await dispatch(UserLogout());
    navigate("/Login");
  };

  const isCurrent = (itemHref) => {
    return location.pathname === itemHref;
  };

  const renderNav = (extraClasses) =>
    navigation.map((item, idx) => {
      const active = isCurrent(item.href);
      const num = String(idx + 1).padStart(2, "0");
      return (
        <Link
          key={item.name}
          to={item.href}
          onClick={() => setSidebarOpen(false)}
          className={classNames(
            "group relative flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all text-sm",
            active
              ? "bg-white/[0.07] text-white border-l-2 border-moss"
              : "text-white/60 hover:bg-white/[0.04] hover:text-white border-l-2 border-transparent",
            extraClasses
          )}
        >
          <item.icon
            className={classNames(
              "h-5 w-5 flex-shrink-0 transition-colors",
              active
                ? "text-moss"
                : "text-white/40 group-hover:text-white/70"
            )}
          />
          <span className="flex-1">{item.name}</span>
          <span
            className={classNames(
              "font-mono-label text-[10px] tracking-widest",
              active ? "text-moss/80" : "text-white/25"
            )}
          >
            {num}
          </span>
        </Link>
      );
    });

  const renderLogout = (extraClasses) => (
    <button
      onClick={handleLogout}
      className={classNames(
        "group flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-signal/80 border-l-2 border-transparent hover:bg-white/[0.05] hover:text-signal transition-colors",
        extraClasses
      )}
    >
      <ArrowLeftOnRectangleIcon className="h-5 w-5 text-signal/60 group-hover:text-signal" />
      <span>Log Out</span>
    </button>
  );

  const sidebarClasses =
    "flex flex-col bg-ink-2 shadow-2xl relative overflow-hidden";
  const sidebarSurface = (
    <>
      <div className="pointer-events-none absolute inset-0 topogrid-invert opacity-60" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-3/60 via-transparent to-ink/60" />
      <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-moss/20 blur-3xl" />
    </>
  );

  const footerUser = (
    <div className="px-5 py-4 border-t border-white/10">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white font-mono-label text-xs uppercase">
          {(user?.name || "U").slice(0, 2)}
        </div>
        <div className="leading-tight min-w-0">
          <p className="text-white text-sm font-medium truncate">
            {user?.name || "User"}
          </p>
          <p className="font-mono-label text-[9.5px] text-white/40 uppercase tracking-widest">
            {role}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ivory crosshair">
      <MainHeader
        onMenuClick={() => setSidebarOpen(true)}
        sidebarOpen={sidebarOpen}
        onCloseMenu={() => setSidebarOpen(false)}
      />

      <div className="flex">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-ink/50 backdrop-blur-sm lg:hidden transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile sidebar */}
        <aside
          className={classNames(
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            "fixed inset-y-0 z-40 w-72 transform transition-transform duration-300 ease-in-out lg:hidden",
            sidebarClasses
          )}
        >
          {sidebarSurface}
          <div className="relative flex items-center justify-between px-6 py-5 border-b border-white/10">
            <Logo />
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="relative flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            {renderNav()}
          </nav>
          <div className="relative">{footerUser}</div>
          <div className="relative px-4 py-5">
            {renderLogout("w-full")}
          </div>
        </aside>

        {/* Desktop sidebar */}
        <aside
          className={classNames(
            "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-30 lg:w-72 lg:pt-[62px]",
            sidebarClasses
          )}
        >
          {sidebarSurface}
          <div className="relative z-10 flex items-center px-6 py-6">
            <Logo />
          </div>
          <nav className="relative z-10 flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
            {renderNav()}
          </nav>
          <div className="relative z-10">{footerUser}</div>
          <div className="relative z-10 px-4 py-5">
            {renderLogout("w-full")}
          </div>
        </aside>

        <main className="flex-1 lg:ml-72">
          <div className="px-4 sm:px-6 lg:px-8 py-5 max-w-7xl mx-auto">
            <div className="mb-4">
              <BreadCrump />
            </div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
