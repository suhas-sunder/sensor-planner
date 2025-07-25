import { useState } from "react";
import AddDeviceModal from "../ui/AddDeviceModal";
// import Searchbar from "../ui/Searchbar";
import AddSensorModal from "../ui/AddSensorModal";
import NodeController from "../ui/EditNodeMenu";

export default function SidebarMenu() {
  const [showSensorModal, setShowSensorModal] = useState(false);
  const [showDeviceModal, setShowDeviceModal] = useState(false);

  return (
    <>
      {showSensorModal && (
        <AddSensorModal setShowSensorModal={setShowSensorModal} />
      )}
      {showDeviceModal && (
        <AddDeviceModal setShowDeviceModal={setShowDeviceModal} />
      )}
      <div className="flex flex-col min-w-60 items-center bg-slate-800 gap-5 text-white">
        <h1 className="flex font-bold text-2xl mt-4 "> 4th Floor </h1>
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
          <button className="flex min-w-[12em] justify-center items-center cursor-pointer hover:bg-white hover:fill-slate-900 fill-white font-semibold hover:text-slate-900 border-2 border-white rounded-md p-2">
            <svg
              className="flex w-6 h-6 mr-2"
              focusable="false"
              aria-hidden="true"
              viewBox="0 0 24 24"
            >
              <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7M2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2m4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3z"></path>
            </svg>{" "}
            <span>Hide All Sensors</span>
          </button>
          <button className="flex min-w-[12em] justify-center items-center cursor-pointer hover:bg-white hover:fill-slate-900 fill-white font-semibold hover:text-slate-900 border-2 border-white rounded-md p-2">
            <svg
              className="flex w-6 h-6 mr-2 "
              focusable="false"
              aria-hidden="true"
              viewBox="0 0 24 24"
            >
              <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7M2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2m4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3z"></path>
            </svg>{" "}
            <span>Hide All Devices</span>
          </button>
        </div>
      </div>
    </>
  );
}
