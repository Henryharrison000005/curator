import { Link, useLocation } from "react-router-dom";
import { HomeIcon } from "@heroicons/react/20/solid";

const BreadCrump = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="w-full">
      <ol className="flex items-center gap-0 rounded-lg border border-bone bg-paper px-4 py-2.5 shadow-sm">
        {/* FMS marker */}
        <li className="pr-3 mr-1 border-r border-bone">
          <span className="font-mono-label text-[10px] font-semibold uppercase tracking-[0.2em] text-moss-2">
            FMS
          </span>
        </li>

        {/* Home */}
        <li>
          <Link
            to="/"
            className="flex items-center text-ink-2-text hover:text-moss-2 transition"
          >
            <HomeIcon className="h-4 w-4" />
          </Link>
        </li>

        {/* Dynamic Paths */}
        {pathnames.map((value, index) => {
          const to = "/" + pathnames.slice(0, index + 1).join("/");

          return (
            <li key={to} className="flex items-center">
              <svg
                className="h-4 w-4 text-ink-2-text/40 mx-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M7 5l5 5-5 5" />
              </svg>

              <Link
                to={to}
                className="font-mono-label text-[11px] font-medium uppercase tracking-[0.08em] text-ink-2-text hover:text-moss-2 transition"
              >
                {value}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadCrump;
