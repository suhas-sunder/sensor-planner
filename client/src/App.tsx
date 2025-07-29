import "./App.css";
import { EventsProvider } from "./components/context/EventsProvider";
import { SensorDeviceProvider } from "./components/context/SensorDeviceProvider";
import useLocalStorage from "./components/hooks/useLocalStorage";
import Footer from "./components/navigation/Footer";
import NavBar from "./components/navigation/NavBar";
import AllRoutes from "./components/utils/routing/AllRoutes";

export default function App() {
  useLocalStorage({ actionType: "user-update" });

  return (
    <EventsProvider>
      <SensorDeviceProvider>
        <div className="flex flex-col min-h-screen bg-slate-200">
          <NavBar />
          <AllRoutes />
          <Footer />
        </div>
      </SensorDeviceProvider>
    </EventsProvider>
  );
}
