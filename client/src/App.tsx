import "./App.css";
import Footer from "./components/navigation/Footer";
import NavBar from "./components/navigation/NavBar";
import AllRoutes from "./components/utils/routing/AllRoutes";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-200">
      <NavBar />
      <AllRoutes />
      <Footer />
    </div>
  );
}

