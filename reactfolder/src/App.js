import { BrowserRouter, Routes, Route } from "react-router";

import "./App.css";

import Footer from "./components/Footer";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import Blog from "./pages/Blog";

function App() {
  return (
    <BrowserRouter>
      <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
        </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
