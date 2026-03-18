import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import "./pages/Gutenberg.css";
import "./App.css";

import Footer from "./components/Footer";
import Nav from "./components/Nav";
import Blog from "./pages/Blog";
import BlogSingle from "./pages/BlogSingle";
import Profil from "./components/zadaci/Profil";
import Korisnici from "./components/zadaci/Korisnici";
import Vjezbadva from "./components/Vjezbadva"; 
import Tecaj from "./components/zadaci/Tecaj";
import Naslovna from "./pages/Naslovna";
import Kategorije from "./components/Kategorije";
import Putovanje from "./pages/Putovanje";
import PutovanjeBlogSingle from "./pages/PutovanjeBlogSingle";
import PutovanjeKontinent from "./pages/PutovanjeKontinent";
import PutovanjeSva from "./pages/PutovanjeSva";
import Kontakt from "./components/Kontakt";
import SignIn from "./components/SignIn";
import SignUp from "./components/SingUp";
import AdminLayout from "./pages/admin/AdminLayout";
import Onama from "./pages/Onama";
import ZastitaPodataka from "./pages/ZastitaPodataka";
import OpciUvjeti from "./pages/OpciUvjeti";

import MyDetails from "./pages/admin/MyDetails";
import MyPosts from "./pages/admin/MyPosts";
import Settings from "./pages/admin/Settings";

import Shop from "./pages/shop/Shop";
import Cart from "./pages/shop/Cart";
import Checkout from "./pages/shop/Checkout";

function ScrollToTopOnLoad() {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const scrollTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    // Initial load and mobile browser cache restore.
    scrollTop();
    const rafId = window.requestAnimationFrame(scrollTop);
    window.addEventListener("load", scrollTop);
    window.addEventListener("pageshow", scrollTop);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("load", scrollTop);
      window.removeEventListener("pageshow", scrollTop);
    };
  }, []);

  return null;
}

function ScrollToTopOnRouteChange() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

function RouteMeta() {
  const { pathname } = useLocation();

  const getPageTitle = () => {
    if (pathname === "/") return "Naslovna | Explorers Way";
    if (pathname === "/blog") return "Blog | Explorers Way";
    if (pathname.startsWith("/blog/")) return "Blog članak | Explorers Way";
    if (pathname === "/putovanje") return "Putovanja | Explorers Way";
    if (pathname === "/putovanje/sva-putovanja") return "Sva putovanja | Explorers Way";
    if (pathname.startsWith("/putovanje/kontinent/")) return "Putovanja po kontinentu | Explorers Way";
    if (pathname.startsWith("/putovanje/")) return "Detalji putovanja | Explorers Way";
    if (pathname === "/kontakt") return "Kontakt | Explorers Way";
    if (pathname === "/o-nama") return "O nama | Explorers Way";
    if (pathname === "/zastita-podataka") return "Zaštita podataka | Explorers Way";
    if (pathname === "/opci-uvjeti") return "Opći uvjeti | Explorers Way";
    if (pathname === "/signin") return "Prijava | Explorers Way";
    if (pathname === "/signup") return "Registracija | Explorers Way";
    if (pathname === "/shop") return "Shop | Explorers Way";
    if (pathname === "/cart") return "Košarica | Explorers Way";
    if (pathname === "/checkout") return "Naplatna stranica | Explorers Way";
    if (pathname.startsWith("/admin")) return "Admin | Explorers Way";

    return "Explorers Way";
  };

  return (
    <Helmet>
      <title>{getPageTitle()}</title>
    </Helmet>
  );
}

function App() {
  return (
    <BrowserRouter basename="mdodic">
      <RouteMeta />
      <ScrollToTopOnLoad />
      <ScrollToTopOnRouteChange />
      <Nav />
        <Routes>
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogSingle />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/korisnici" element={<Korisnici />} />
          <Route path="/vjezbadva" element={<Vjezbadva />} />
          <Route path="/tecaj" element={<Tecaj />} />
          <Route path="/" element={<Naslovna />} />
          <Route path="/kategorije" element={<Kategorije />} />
          <Route path="/putovanje" element={<Putovanje />} />
          <Route path="/putovanje/sva-putovanja" element={<PutovanjeSva />} />
          <Route path="/putovanje/kontinent/:continentSlug" element={<PutovanjeKontinent />} />
          <Route path="/putovanje/kontinent/:continentSlug/:slug" element={<PutovanjeBlogSingle />} />
          <Route path="/putovanje/:slug" element={<PutovanjeBlogSingle />} />
          <Route path="/kontakt" element={<Kontakt />} />
          <Route path="/zastita-podataka" element={<ZastitaPodataka />} />
          <Route path="/opci-uvjeti" element={<OpciUvjeti />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/o-nama" element={<Onama />} />

            <Route path="/admin" element={<AdminLayout />}>
              <Route path="mydetails" element={<MyDetails />} />
              <Route path="myposts" element={<MyPosts />} />
              <Route path="settings" element={<Settings />} />
            </Route>

          <Route path="/shop" element={<Shop/>} />
          <Route path="/cart" element={<Cart/>} />
          <Route path="/checkout" element={<Checkout/>} />

        </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
