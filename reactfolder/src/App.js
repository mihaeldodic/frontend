import { BrowserRouter, Routes, Route } from "react-router";

import "./App.css";

import Footer from "./components/Footer";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import Profil from "./components/zadaci/Profil";
import Korisnici from "./components/zadaci/Korisnici";
import Vjezbadva from "./components/Vjezbadva"; 
import Tecaj from "./components/zadaci/Tecaj";

function App() {
  return (
    <BrowserRouter>
      <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/korisnici" element={<Korisnici />} />
          <Route path="/vjezbadva" element={<Vjezbadva />} />
          <Route path="/tecaj" element={<Tecaj />} />

        </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
