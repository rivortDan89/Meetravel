import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Maps from "./pages/Maps";
import MapsBack from "./pages/MapsBack";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="appShell">
        <Header />

        <main className="appMain">
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Maps estático por pantallas */}
            <Route path="/maps" element={<Maps view="lista" />} />
            <Route path="/maps/vacio" element={<Maps view="vacio" />} />
            <Route path="/maps/detalle" element={<Maps view="detalle" />} />

            <Route path="/maps-back" element={<MapsBack />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
