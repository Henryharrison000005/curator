import { useSelector } from "react-redux";

const ROLE_BADGE = {
  student: "text-[#ccff00] bg-[#ccff00]/[0.08] border-[#ccff00]/20",
  supervisor: "text-[#f5a524] bg-[#f5a524]/[0.08] border-[#f5a524]/20",
  instructor: "text-[#dfff50] bg-[#dfff50]/[0.08] border-[#dfff50]/20",
};

const MainHeader = ({ onMenuClick, sidebarOpen = false, onCloseMenu }) => {
  const { user } = useSelector((state) => state.auth);

  const displayName = user?.username || "Guest";
  const role = user?.role || "student";
  const roleLabel = (role[0]?.toUpperCase() || "") + role.slice(1);
  const roleBadge = ROLE_BADGE[role] || ROLE_BADGE.student;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0e0e0e]/95 backdrop-blur-md border-b border-[#1e1e1e]">
      <div className="relative flex h-[62px] items-center px-4 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <div className="absolute left-4 sm:left-6 lg:left-8">
          {!sidebarOpen ? (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 text-[#6b6560] hover:text-[#f5f0e8] hover:bg-[#1e1e1e] transition-colors"
              aria-label="Open menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          ) : (
            <button
              onClick={onCloseMenu}
              className="lg:hidden p-2 text-[#6b6560] hover:text-[#f5f0e8] hover:bg-[#1e1e1e] transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Title */}
        <div className="mx-auto text-center">
          <h1 className="font-display font-bold text-sm text-[#f5f0e8] tracking-tight">
            Field Management System
          </h1>
        </div>

        {/* Right: user pill */}
        <div className="ml-auto">
          <div className="flex items-center gap-3 border border-[#2a2a2a] bg-[#141414] py-1.5 pl-4 pr-1.5">
            <div className="hidden sm:flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="live-dot absolute inline-flex h-full w-full rounded-full bg-[#ccff00]" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ccff00]" />
              </span>
              <span className="font-mono-label text-[9px] text-[#6b6560] uppercase tracking-[0.2em]">
                Live
              </span>
            </div>
            <div className="h-5 w-px bg-[#2a2a2a] hidden sm:block" />
            <span className="text-sm font-semibold text-[#f5f0e8]">{displayName}</span>
            <span className={`text-[10px] font-bold px-2.5 py-1 uppercase tracking-[0.1em] border ${roleBadge}`}>
              {roleLabel}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
