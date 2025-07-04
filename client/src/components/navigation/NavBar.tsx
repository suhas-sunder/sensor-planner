import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav>
      <ul className="static top-0 bg-slate-300 flex-col items-center justify-center gap-4 w-full">
        <li>
          <NavLink
            to="/"
            className="relative flex items-center justify-center gap-2 py-2 tracking-[0.1em]"
          >
            Home
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
