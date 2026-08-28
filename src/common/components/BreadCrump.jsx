import { Link, useLocation } from "react-router-dom";
import { HomeIcon } from "@heroicons/react/20/solid";

const BreadCrump = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="w-full">
      <ol className="flex items-center gap-0 border border-[#e5e0d8] bg-white px-4 py-2">
        <li className="pr-3 mr-1 border-r border-[#e5e0d8]">
          <span className="font-mono-label text-[9px] font-semibold uppercase tracking-[0.2em] text-[#c4622d]">
            FMS
          </span>
        </li>
        <li>
          <Link
            to="/"
            className="flex items-center text-[#a6a199] hover:text-[#c4622d] transition-colors"
          >
            <HomeIcon className="h-4 w-4" />
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const to = "/" + pathnames.slice(0, index + 1).join("/");
          return (
            <li key={to} className="flex items-center">
              <svg
                className="h-4 w-4 text-[#d4cfc6] mx-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M7 5l5 5-5 5" />
              </svg>
              <Link
                to={to}
                className="font-mono-label text-[10px] font-medium uppercase tracking-[0.06em] text-[#7a756d] hover:text-[#c4622d] transition-colors"
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
