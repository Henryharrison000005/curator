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
  { name: "Departments", href: "/InstructorDepartmentManagement", icon: UserGroupIcon },
  { name: "Applications", href: "/InstructorApplications", icon: DocumentCheckIcon },
  { name: "Settings", href: "/InstructorSettings", icon: Cog6ToothIcon },
];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Logo = () => (
  <div className="flex items-center gap-3">
    <div className="relative flex h-10 w-10 items-center justify-center rounded-none bg-[#ccff00] text-[#0a0a0a] font-display font-black text-lg border-2 border-[#ccff00]">
      F
      <span className="absolute -top-1.5 -right-1.5 h-2 w-2 rounded-full bg-[#ccff00] ring-2 ring-[#141414]" />
    </div>
    <div className="leading-tight">
      <span className="font-display font-black text-[#f5f0e8] text-lg tracking-tight block">FMS</span>
      <span className="font-mono-label text-[9px] text-[#6b6560] uppercase tracking-[0.28em]">Surveyor</span>
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

  const isCurrent = (itemHref) => location.pathname === itemHref;

  const renderNav = (extraClasses) =>
    navigation.map((item, idx) => {
      const active = isCurrent(item.href);
      const num = String(idx + 1).padStart(2, "0");
      return (
        <Link
          key={item.name}
          to={item.href}
          onClick={() => setSidebarOpen(false)}
          className={cn(
            "group relative flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all",
            active
              ? "text-[#ccff00] bg-[#ccff00]/[0.06]"
              : "text-[#9a938a] hover:text-[#f5f0e8] hover:bg-[#1e1e1e]",
            extraClasses
          )}
        >
          {active && (
            <span className="absolute left-0 top-1 bottom-1 w-[3px] bg-[#ccff00]" />
          )}
          <item.icon
            className={cn(
              "h-[18px] w-[18px] flex-shrink-0 transition-colors",
              active ? "text-[#ccff00]" : "text-[#6b6560] group-hover:text-[#9a938a]"
            )}
          />
          <span className="flex-1">{item.name}</span>
          <span
            className={cn(
              "font-mono-label text-[10px] tracking-[0.18em]",
              active ? "text-[#ccff00]/70" : "text-[#3a3a3a]"
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
      className={cn(
        "group flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-[#ff4d4d] hover:text-[#ff4d4d] hover:bg-[#ff4d4d]/[0.06] transition-colors",
        extraClasses
      )}
    >
      <ArrowLeftOnRectangleIcon className="h-[18px] w-[18px] text-[#ff4d4d]/60 group-hover:text-[#ff4d4d]" />
      <span>Log Out</span>
    </button>
  );

  const sidebarBg = "flex flex-col bg-[#0e0e0e] border-r border-[#1e1e1e]";

  const footerUser = (
    <div className="px-5 py-4 border-t border-[#1e1e1e]">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center bg-[#1e1e1e] text-[#ccff00] font-mono-label text-xs font-bold uppercase border border-[#2a2a2a]">
          {(user?.name || "U").slice(0, 2)}
        </div>
        <div className="leading-tight min-w-0">
          <p className="text-[#f5f0e8] text-sm font-medium truncate">
            {user?.name || "User"}
          </p>
          <p className="font-mono-label text-[9px] text-[#6b6560] uppercase tracking-[0.2em]">
            {role}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <MainHeader
        onMenuClick={() => setSidebarOpen(true)}
        sidebarOpen={sidebarOpen}
        onCloseMenu={() => setSidebarOpen(false)}
      />

      <div className="flex">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile sidebar */}
        <aside
          className={cn(
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            "fixed inset-y-0 z-40 w-72 transform transition-transform duration-250 ease-in-out lg:hidden",
            sidebarBg
          )}
        >
          <div className="relative flex items-center justify-between px-6 py-5 border-b border-[#1e1e1e]">
            <Logo />
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 text-[#6b6560] hover:text-[#f5f0e8] hover:bg-[#1e1e1e] transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
            {renderNav()}
          </nav>
          <div>{footerUser}</div>
          <div className="px-4 py-4">{renderLogout("w-full")}</div>
        </aside>

        {/* Desktop sidebar */}
        <aside
          className={cn(
            "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-30 lg:w-64 lg:pt-[62px]",
            sidebarBg
          )}
        >
          <div className="relative z-10 px-5 py-5">
            <Logo />
          </div>
          <nav className="relative z-10 flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
            {renderNav()}
          </nav>
          <div className="relative z-10">{footerUser}</div>
          <div className="relative z-10 px-4 py-4">{renderLogout("w-full")}</div>
        </aside>

        <main className="flex-1 lg:ml-64">
          <div className="px-4 sm:px-6 lg:px-8 py-5 max-w-[1200px] mx-auto">
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
