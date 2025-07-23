import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="w-full h-screen flex flex-col gap-12 items-center justify-center relative overflow-hidden">
      <div className="flex flex-col gap-8">
        <Link
          to="dashboard"
          className="grid relative grid-cols-4 gap-4 group cursor-pointer"
        >
          <div className="flex absolute left-1/2 -top-1/3 transform -translate-x-1/2  text-slate-400">
            Floor 4
          </div>
          <div className="group-hover:bg-slate-400 flex border-2 border-slate-500 w-full h-full min-w-40 min-h-25 rounded-md h-full"></div>
          <div className="group-hover:bg-slate-400 flex border-2 border-slate-500 w-full h-full min-w-40 min-h-25 rounded-md h-full"></div>
          <div className="group-hover:bg-slate-400 flex border-2 border-slate-500 w-full h-full min-w-40 min-h-25 rounded-md h-full"></div>
          <div className="group-hover:bg-slate-400 flex border-2 border-slate-500 w-full h-full min-w-40 min-h-25 rounded-md h-full"></div>
        </Link>
      </div>

      <div className="flex flex-col gap-8">
        <Link
          to="dashboard"
          className="grid relative grid-cols-4 gap-4 group cursor-pointer"
        >
          <div className="flex absolute left-1/2 -top-1/3 transform -translate-x-1/2  text-slate-400">
            Floor 3
          </div>
          <div className="group-hover:bg-slate-400 flex border-2 border-slate-500 w-full h-full min-w-40 min-h-25 rounded-md h-full"></div>
          <div className="group-hover:bg-slate-400 flex border-2 border-slate-500 w-full h-full min-w-40 min-h-25 rounded-md h-full"></div>
          <div className="group-hover:bg-slate-400 flex border-2 border-slate-500 w-full h-full min-w-40 min-h-25 rounded-md h-full"></div>
          <div className="group-hover:bg-slate-400 flex border-2 border-slate-500 w-full h-full min-w-40 min-h-25 rounded-md h-full"></div>
        </Link>
      </div>
      <div className="flex flex-col gap-8">
        <Link
          to="dashboard"
          className="grid relative grid-cols-4 gap-4 group cursor-pointer"
        >
          <div className="flex absolute left-1/2 -top-1/3 transform -translate-x-1/2  text-slate-400">
            Floor 2
          </div>
          <div className="group-hover:bg-slate-400 flex border-2 border-slate-500 w-full h-full min-w-40 min-h-25 rounded-md h-full"></div>
          <div className="group-hover:bg-slate-400 flex border-2 border-slate-500 w-full h-full min-w-40 min-h-25 rounded-md h-full"></div>
          <div className="group-hover:bg-slate-400 flex border-2 border-slate-500 w-full h-full min-w-40 min-h-25 rounded-md h-full"></div>
          <div className="group-hover:bg-slate-400 flex border-2 border-slate-500 w-full h-full min-w-40 min-h-25 rounded-md h-full"></div>
        </Link>
      </div>
      <div className="flex flex-col gap-8">
        <Link
          to="dashboard"
          className="grid relative grid-cols-4 gap-4 group cursor-pointer"
        >
          <div className="flex absolute left-1/2 -top-1/3 transform -translate-x-1/2  text-slate-400">
            Floor 1
          </div>
          <div className="group-hover:bg-slate-400 flex border-2 border-slate-500 w-full h-full min-w-40 min-h-25 rounded-md h-full"></div>
          <div className="group-hover:bg-slate-400 flex border-2 border-slate-500 w-full h-full min-w-40 min-h-25 rounded-md h-full"></div>
          <div className="group-hover:bg-slate-400 flex border-2 border-slate-500 w-full h-full min-w-40 min-h-25 rounded-md h-full"></div>
          <div className="group-hover:bg-slate-400 flex border-2 border-slate-500 w-full h-full min-w-40 min-h-25 rounded-md h-full"></div>
        </Link>
      </div>
    </div>
  );
}
