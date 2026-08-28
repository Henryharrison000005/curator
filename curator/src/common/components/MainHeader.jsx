import { useSelector } from "react-redux";

const ROLE_BADGE = {
  student: "text-[#c4622d] bg-[#c4622d]/[0.06] border-[#c4622d]/20",
  supervisor: "text-[#c49a2d] bg-[#c49a2d]/[0.06] border-[#c49a2d]/20",
  instructor: "text-[#5a8a3c] bg-[#5a8a3c]/[0.06] border-[#5a8a3c]/20",
};

const MainHeader = ({ onMenuClick, sidebarOpen = false, onCloseMenu }) => {
  const { user } = useSelector((state) => state.auth);

  const displayName = user?.username || "Guest";
  const role = user?.role || "student";
  const roleLabel = (role[0]?.toUpperCase() || "") + role.slice(1);
  const roleBadge = ROLE_BADGE[role] || ROLE_BADGE.student;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-[#e5e0d8]">
      <div className="relative flex h-[60px] items-center px-4 sm:px-6 lg:px-8">
        <div className="absolute left-4 sm:left-6 lg:left-8">
          {!sidebarOpen ? (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 text-[#a6a199] hover:text-[#2d2a24] hover:bg-[#f4f1ec] transition-colors"
              aria-label="Open menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          ) : (
            <button
              onClick={onCloseMenu}
              className="lg:hidden p-2 text-[#a6a199] hover:text-[#2d2a24] hover:bg-[#f4f1ec] transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="mx-auto text-center">
          <h1 className="font-display font-semibold text-sm text-[#2d2a24] tracking-tight">
            Field Management System
          </h1>
        </div>

        <div className="ml-auto">
          <div className="flex items-center gap-3 border border-[#e5e0d8] bg-white py-1.5 pl-4 pr-1.5">
            <div className="hidden sm:flex items-center gap-2">
              <span className="relative flex h-[6px] w-[6px]">
                <span className="live-dot absolute inline-flex h-full w-full rounded-full bg-[#5a8a3c]" />
                <span className="relative inline-flex rounded-full h-[6px] w-[6px] bg-[#5a8a3c]" />
              </span>
              <span className="font-mono-label text-[9px] text-[#a6a199] uppercase tracking-[0.16em]">
                Active
              </span>
            </div>
            <div className="h-4 w-px bg-[#e5e0d8] hidden sm:block" />
            <span className="text-[13px] font-semibold text-[#2d2a24]">{displayName}</span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 uppercase tracking-[0.08em] border ${roleBadge}`}>
              {roleLabel}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
