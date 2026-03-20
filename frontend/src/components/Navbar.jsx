import { NavLink } from "react-router-dom";

function Navbar() {
  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-indigo-600 text-white"
        : "text-slate-400 hover:text-white hover:bg-slate-800"
    }`;

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <NavLink to="/" className="text-xl font-bold text-white tracking-tight">
          Quest<span className="text-indigo-500">Log</span>
        </NavLink>

        <div className="flex items-center gap-2">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/search" className={linkClass}>
            Buscar
          </NavLink>
          <NavLink to="/library" className={linkClass}>
            Biblioteca
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;