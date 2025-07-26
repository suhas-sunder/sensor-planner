import { useEffect, useState } from "react";
import AddDeviceModal from "../ui/AddDeviceModal";
// import Searchbar from "../ui/Searchbar";
import AddSensorModal from "../ui/AddSensorModal";
import NodeController from "../ui/EditNodeMenu";
import { useParams } from "react-router-dom";
import useSensorDeviceContext from "../hooks/useSensorDeviceContext";

export default function SidebarMenu() {
  const { floorId } = useParams(); // returns "1", "2", etc.
  const currentFloor = Number(floorId) || 1;

  const [showSensorModal, setShowSensorModal] = useState(false);
  const [showDeviceModal, setShowDeviceModal] = useState(false);

  const { sensors, devices, selectedNodeId, setSelectedNodeId } =
    useSensorDeviceContext();

  useEffect(() => {
    const selectedSensor = sensors.find((s) => s.id === selectedNodeId);
    const selectedDevice = devices.find((d) => d.id === selectedNodeId);
    const isSensorOnFloor = selectedSensor?.floor === currentFloor;
    const isDeviceOnFloor = selectedDevice?.floor === currentFloor;

    if (selectedNodeId && !isSensorOnFloor && !isDeviceOnFloor) {
      setSelectedNodeId(null);
    }
  }, [currentFloor, selectedNodeId, sensors, devices, setSelectedNodeId]);

  return (
    <>
      {showSensorModal && (
        <AddSensorModal setShowSensorModal={setShowSensorModal} />
      )}
      {showDeviceModal && (
        <AddDeviceModal setShowDeviceModal={setShowDeviceModal} />
      )}
      <div className="flex flex-col min-w-60 items-center bg-slate-800 gap-5 text-white">
        <h1 className="flex font-bold text-2xl mt-4 ">
          {" "}
          Floor #{currentFloor}{" "}
        </h1>
        {/* <Searchbar /> */}
        <NodeController />

        <div className="flex flex-col gap-4 mt-auto -translate-y-6">
          <button
            onClick={() => setShowSensorModal(true)}
            className="flex min-w-[12em] justify-center items-center cursor-pointer hover:bg-white hover:fill-slate-900 fill-white font-semibold hover:text-slate-900 border-2 border-white rounded-md p-2"
          >
            <svg
              className="flex w-6 h-6 mr-2"
              focusable="false"
              aria-hidden="true"
              viewBox="0 0 24 24"
            >
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"></path>
            </svg>
            <span>Add New Sensor</span>
          </button>
          <button
            onClick={() => setShowDeviceModal(true)}
            className="flex min-w-[12em] justify-center items-center cursor-pointer hover:bg-white hover:fill-slate-900 fill-white font-semibold hover:text-slate-900 border-2 border-white rounded-md p-2"
          >
            <svg
              className="flex w-6 h-6 mr-2"
              focusable="false"
              aria-hidden="true"
              viewBox="0 0 24 24"
            >
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"></path>
            </svg>
            <span>Add New Device</span>
          </button>
        </div>
      </div>
    </>
  );
}
