export default function SidebarMenu() {
  return (
    <div className="flex flex-col w-60 items-center bg-slate-600 gap-5 text-white">
      <h1 className="flex font-bold text-2xl mt-4 mb-2">Floor 1 Menu</h1>
      <div className="flex flex-col gap-3 border-2 border-white rounded-md p-2 px-4">
        <div>Motion Sensor 1</div>
        <div className="w-40 h-40 bg-slate-400 rounded-md">
          SENSOR PREVIEW IMG
        </div>
        <div>Status: Active </div>
        <div>Setting 1</div>
        <div>Setting 2</div>
        <div>Setting 3</div>
        <div>Setting 4</div>
      </div>
      <div>
        <button className="border-2 border-white rounded-md p-2">
          Hide Sensors
        </button>
        <button className="border-2 border-white rounded-md p-2">
          Hide Applicances
        </button>
      </div>
      <div className="flex flex-col gap-8 mt-auto -translate-y-25">
        <button className="border-2 border-white rounded-md p-2">
          Add Sensor
        </button>
        <button className="border-2 border-white rounded-md p-2">
          Add Sensor
        </button>
      </div>
    </div>
  );
}
