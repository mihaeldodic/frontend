import { BrowserRouter, Routes, Route } from "react-router-dom";

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
import Kontakt from "./components/Kontakt";
import SignIn from "./components/SignIn";
import SignUp from "./components/SingUp";
import AdminLayout from "./pages/admin/AdminLayout";

import MyDetails from "./pages/admin/MyDetails";
import MyPosts from "./pages/admin/MyPosts";
import Settings from "./pages/admin/Settings";

import Shop from "./pages/shop/Shop";
import Cart from "./pages/shop/Cart";
import Checkout from "./pages/shop/Checkout";

function App() {
  return (
    <BrowserRouter basename="">
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
          <Route path="/putovanje/:slug" element={<PutovanjeBlogSingle />} />
          <Route path="/kontakt" element={<Kontakt />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

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
