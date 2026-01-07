import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Maps from "./pages/Maps";

export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}
