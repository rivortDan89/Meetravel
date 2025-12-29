import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Maps from "./pages/Maps";

export default function App() {
  return (
    <BrowserRouter>
      < Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/maps" element={<Maps />} />
      </Routes>
      < Footer />
    </BrowserRouter>
  );
}
