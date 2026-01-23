import { BrowserRouter, Routes, Route } from "react-router";

import "./pages/Gutenberg.css";
import "./App.css";

import Footer from "./components/Footer";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import BlogSingle from "./pages/BlogSingle";
import Profil from "./components/zadaci/Profil";
import Korisnici from "./components/zadaci/Korisnici";
import Vjezbadva from "./components/Vjezbadva"; 
import Tecaj from "./components/zadaci/Tecaj";
import Naslovna from "./pages/Naslovna";

function App() {
  return (
    <BrowserRouter>
      <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blogsingle" element={<BlogSingle />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/korisnici" element={<Korisnici />} />
          <Route path="/vjezbadva" element={<Vjezbadva />} />
          <Route path="/tecaj" element={<Tecaj />} />
          <Route path="/naslovna" element={<Naslovna />} />

        </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
