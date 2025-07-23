import "./App.css";
import { SensorDeviceProvider } from "./components/context/SensorDeviceContext";
import Footer from "./components/navigation/Footer";
import NavBar from "./components/navigation/NavBar";
import AllRoutes from "./components/utils/routing/AllRoutes";

export default function App() {
  return (
    <SensorDeviceProvider>
      <div className="flex flex-col min-h-screen bg-slate-200">
        <NavBar />
        <AllRoutes />
        <Footer />
      </div>
    </SensorDeviceProvider>
  );
}
