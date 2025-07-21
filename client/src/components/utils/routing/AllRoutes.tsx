import { Route, Routes } from "react-router-dom";

import Home from "../../../pages/Home";
import Dashboard from "../../../pages/Dashboard";
import Settings from "../../../pages/Settings";
import About from "../../../pages/About";
import { SensorDeviceProvider } from "../../context/SensorDeviceContext";

export default function AllRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/dashboard"
        element={
          <SensorDeviceProvider>
            <Dashboard />
          </SensorDeviceProvider>
        }
      />
      <Route
        path="/settings"
        element={
          <SensorDeviceProvider>
            <Settings />
          </SensorDeviceProvider>
        }
      />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}
