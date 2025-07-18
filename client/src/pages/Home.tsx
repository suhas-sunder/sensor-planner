
export default function Home() {

  return (
    <div className="w-full h-screen flex items-center justify-center relative overflow-hidden">
     <div className="flex flex-col gap-8">
       <a href="dashboard" className="grid relative grid-cols-4 gap-4 group cursor-pointer">
        <div className="flex absolute left-1/2 -top-1/3 transform -translate-x-1/2  text-slate-400">Floor 1</div>
        <div className="group-hover:bg-slate-400 flex border-2 border-slate-500 w-full h-full min-w-40 min-h-25 rounded-md h-full"></div>
        <div className="group-hover:bg-slate-400 flex border-2 border-slate-500 w-full h-full min-w-40 min-h-25 rounded-md h-full"></div>
        <div className="group-hover:bg-slate-400 flex border-2 border-slate-500 w-full h-full min-w-40 min-h-25 rounded-md h-full"></div>
        <div className="group-hover:bg-slate-400 flex border-2 border-slate-500 w-full h-full min-w-40 min-h-25 rounded-md h-full"></div>
      </a>
     </div>
      
    </div>
  );
}
