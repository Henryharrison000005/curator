import { Link, useLocation } from "react-router-dom";
import { HomeIcon } from "@heroicons/react/20/solid";

const BreadCrump = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="w-full">
      <ol className="flex items-center gap-0 border border-[#2a2a2a] bg-[#141414] px-4 py-2">
        <li className="pr-3 mr-1 border-r border-[#2a2a2a]">
          <span className="font-mono-label text-[10px] font-bold uppercase tracking-[0.28em] text-[#ccff00]">
            FMS
          </span>
        </li>
        <li>
          <Link
            to="/"
            className="flex items-center text-[#6b6560] hover:text-[#ccff00] transition-colors"
          >
            <HomeIcon className="h-4 w-4" />
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const to = "/" + pathnames.slice(0, index + 1).join("/");
          return (
            <li key={to} className="flex items-center">
              <svg
                className="h-4 w-4 text-[#2a2a2a] mx-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M7 5l5 5-5 5" />
              </svg>
              <Link
                to={to}
                className="font-mono-label text-[10px] font-medium uppercase tracking-[0.08em] text-[#9a938a] hover:text-[#ccff00] transition-colors"
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
