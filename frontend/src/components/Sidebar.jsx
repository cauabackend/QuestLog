import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  {
    to: "/",
    label: "Home",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    to: "/search",
    label: "Buscar",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    to: "/library",
    label: "Biblioteca",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-1.013.67-1.871 1.593-2.154" />
      </svg>
    ),
  },
];

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const initial = user?.username?.charAt(0).toUpperCase() || "?";

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-16 bg-[#0A0A0A] border-r border-[#1A1A1A] flex flex-col items-center py-5 z-50">
      <NavLink to="/" className="w-9 h-9 bg-[#DC2626] rounded-lg flex items-center justify-center text-[11px] font-extrabold text-white mb-8 hover:bg-[#B91C1C] transition-colors">
        QL
      </NavLink>

      <nav className="flex flex-col items-center gap-1 flex-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 group relative ${
                isActive
                  ? "bg-[#DC2626]/15 text-[#DC2626]"
                  : "text-[#525252] hover:text-[#A3A3A3] hover:bg-[#141414]"
              }`
            }
          >
            {item.icon}
            <span className="absolute left-14 px-2 py-1 bg-[#141414] border border-[#262626] rounded text-xs text-[#A3A3A3] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
              {item.label}
            </span>
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="w-8 h-8 rounded-full bg-[#141414] border border-[#262626] flex items-center justify-center text-[10px] font-bold text-[#525252] hover:border-[#DC2626]/30 hover:text-[#DC2626] transition-all group relative"
      >
        {initial}
        <span className="absolute left-14 px-2 py-1 bg-[#141414] border border-[#262626] rounded text-xs text-[#A3A3A3] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
          Sair ({user?.username})
        </span>
      </button>
    </aside>
  );
}

export default Sidebar;