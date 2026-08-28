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
    <div className="flex h-9 w-9 items-center justify-center bg-[#c4622d] text-white font-display font-bold text-base">
      F
    </div>
    <div className="leading-tight">
      <span className="font-display font-bold text-[#2d2a24] text-base tracking-tight block">FMS</span>
      <span className="font-mono-label text-[9px] text-[#a6a199] uppercase tracking-[0.18em]">Field Station</span>
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
            "group relative flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium transition-all",
            active
              ? "text-[#c4622d] bg-[#c4622d]/[0.06]"
              : "text-[#7a756d] hover:text-[#2d2a24] hover:bg-[#f4f1ec]/60",
            extraClasses
          )}
        >
          {active && (
            <span className="absolute left-0 top-1 bottom-1 w-[2px] bg-[#c4622d]" />
          )}
          <item.icon
            className={cn(
              "h-[18px] w-[18px] flex-shrink-0 transition-colors",
              active ? "text-[#c4622d]" : "text-[#a6a199] group-hover:text-[#7a756d]"
            )}
          />
          <span className="flex-1">{item.name}</span>
          <span
            className={cn(
              "font-mono-label text-[10px] tracking-[0.12em]",
              active ? "text-[#c4622d]/60" : "text-[#d4cfc6]"
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
        "group flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-[#b83a2a] hover:bg-[#b83a2a]/[0.04] transition-colors",
        extraClasses
      )}
    >
      <ArrowLeftOnRectangleIcon className="h-[18px] w-[18px] text-[#b83a2a]/50 group-hover:text-[#b83a2a]" />
      <span>Log Out</span>
    </button>
  );

  const footerUser = (
    <div className="px-5 py-4 border-t border-[#e5e0d8]">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center bg-[#f4f1ec] text-[#c4622d] font-mono-label text-[10px] font-semibold uppercase">
          {(user?.name || "U").slice(0, 2)}
        </div>
        <div className="leading-tight min-w-0">
          <p className="text-[#2d2a24] text-[13px] font-medium truncate">
            {user?.name || "User"}
          </p>
          <p className="font-mono-label text-[9px] text-[#a6a199] uppercase tracking-[0.18em]">
            {role}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      <MainHeader
        onMenuClick={() => setSidebarOpen(true)}
        sidebarOpen={sidebarOpen}
        onCloseMenu={() => setSidebarOpen(false)}
      />

      <div className="flex">
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-[#2d2a24]/20 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile sidebar */}
        <aside
          className={cn(
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
            "fixed inset-y-0 z-40 w-64 transform transition-transform duration-250 ease-in-out lg:hidden",
            "flex flex-col bg-white border-r border-[#e5e0d8]"
          )}
        >
          <div className="flex items-center justify-between px-5 py-5 border-b border-[#e5e0d8]">
            <Logo />
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 text-[#a6a199] hover:text-[#2d2a24] transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
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
            "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-30 lg:w-60 lg:pt-[60px]",
            "bg-white border-r border-[#e5e0d8]"
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

        <main className="flex-1 lg:ml-60">
          <div className="px-4 sm:px-6 lg:px-8 py-5 max-w-[1100px] mx-auto">
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
