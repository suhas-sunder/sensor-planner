import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav>
      <ul className="static top-0 bg-slate-600 flex-col items-center justify-center text-lg gap-4 w-full px-40">
        <li>
          <NavLink
            to="/"
            className="relative flex text-blue-100 items-center justify-start gap-2 py-2 tracking-[0.1em] hover:text-blue-200"
          >
            SensorPlanner.com
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
