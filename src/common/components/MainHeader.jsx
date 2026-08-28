import { useSelector } from "react-redux";

const ROLE_BADGE = {
  student: "text-moss bg-moss/15 ring-moss/30",
  supervisor: "text-signal bg-signal/15 ring-signal/30",
  instructor: "text-leaf bg-leaf/15 ring-leaf/30",
};

const MainHeader = ({ onMenuClick, sidebarOpen = false, onCloseMenu }) => {
  const { user } = useSelector((state) => state.auth);

  const displayName = user?.username || "Guest";
  const role = user?.role || "student";
  const roleLabel = (role[0]?.toUpperCase() || "") + role.slice(1);
  const roleBadge = ROLE_BADGE[role] || ROLE_BADGE.student;

  return (
    <header className="sticky top-0 z-50 w-full bg-ink-2/95 backdrop-blur-md border-b border-white/10 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 topogrid-invert opacity-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-moss/10 to-transparent" />

      <div className="relative flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 absolute left-4 sm:left-6 lg:left-8">
          {!sidebarOpen ? (
            <button
              onClick={onMenuClick}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          ) : (
            <button
              onClick={onCloseMenu}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          <div className="flex items-center gap-3.5">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-moss-2 to-moss text-white shadow-[0_8px_20px_-8px_rgba(15,181,174,0.9)] font-display font-black text-lg">
              F
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-signal ring-2 ring-ink-2" />
            </div>
            <div className="hidden sm:block leading-tight">
              <h1 className="text-base font-bold text-white tracking-tight">
                Field Management System
              </h1>
              <p className="font-mono-label text-[10px] text-white/45 uppercase tracking-[0.2em]">
                Placement · Supervision · Reporting
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto" />
        <div className="ml-auto">
          <div
            className="flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.06] py-1.5 pl-4 pr-1.5 backdrop-blur-sm"
            role="status"
            aria-label={`${displayName} logged in as ${roleLabel}`}
          >
            <div className="hidden sm:flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="live-dot absolute inline-flex h-full w-full rounded-full bg-leaf" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-leaf" />
              </span>
              <span className="font-mono-label text-[10px] text-white/50 uppercase tracking-[0.18em]">
                Active
              </span>
            </div>
            <div className="h-5 w-px bg-white/15 hidden sm:block" />
            <span className="text-sm font-semibold text-white">{displayName}</span>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ring-1 ${roleBadge} uppercase tracking-wide`}
            >
              {roleLabel}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
