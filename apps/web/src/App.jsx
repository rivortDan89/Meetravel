import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Maps from "./pages/Maps";
import MapsBack from "./pages/MapsBack";

export default function App() {
  return (
    <BrowserRouter>
<<<<<<< HEAD
      <div className="appShell">
        <Header />

        <main className="appMain">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/maps" element={<Maps />} />
          </Routes>
        </main>

        <Footer />
      </div>
=======
      < Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/maps" element={<Maps />} />
        <Route path="/maps-back" element={<MapsBack />} /> {/* prueba/equipo */}
      </Routes>
      < Footer />
>>>>>>> 48b3bc1d54da60e2233aeb1f8c34196a16c5b867
    </BrowserRouter>
  );
}
