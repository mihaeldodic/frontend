import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./nav.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

const Nav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [name, setName] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("username");
    if (user) setName(user);
  }, []);

  // Scroll efekt
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (location.pathname === "/signin") return null;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setName(null);
    navigate("/");
  };

  return (
    <nav
      className={`navbar navbar-expand-lg fixed-top ${
        scrolled ? "navbar-scrolled" : ""
      }`}
    >
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img src="./img/logo-4.png" alt="logo" />
        </Link>

        {/* Mobile toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="navbar-collapse collapse" id="mainNavbar">
          {/* Left menu */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 text-uppercase">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Naslovnica
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/o-nama">
                O nama
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/kategorije">
                Kategorije
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/putovanje">
                Putovanja
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/blog">
                Blog
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/kontakt">
                Kontakt
              </Link>
            </li>

            {name && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">
                  Admin
                </Link>
              </li>
            )}
          </ul>

          {/* Right side */}
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              {name ? (
                <button onClick={logout} className="btn btn-primary">
                  Dobrodošli, {name}
                </button>
              ) : (
                <Link className="nav-link" to="/signin">
                  <img
                    src="/img/header/user.svg"
                    alt="Sign in"
                    className="icon-sm"
                  />
                </Link>
              )}
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/cart">
                <FontAwesomeIcon icon={faShoppingCart} size="lg" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
