import { Route, Routes } from "react-router-dom";

import Home from "../../../pages/Home";
import Dashboard from "../../../pages/Dashboard";
import Settings from "../../../pages/Settings";
import About from "../../../pages/About";

export default function AllRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}
