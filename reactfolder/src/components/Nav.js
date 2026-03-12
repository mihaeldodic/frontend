import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./nav.css";
import SearchModal from "./SearchModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faInstagram, faFacebook } from "@fortawesome/free-brands-svg-icons";

const Nav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [name, setName] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("username");
    if (user) setName(user);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (location.pathname === "/signin") return null;

  const isActive = (path) => location.pathname === path;

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const handleExploreHover = (isHovering) => {
    if (window.innerWidth > 991) {
      if (hoverTimeout) clearTimeout(hoverTimeout);
      
      if (isHovering) {
        setExploreOpen(true);
      } else {
        const timeout = setTimeout(() => {
          setExploreOpen(false);
        }, 300);
        setHoverTimeout(timeout);
      }
    }
  };

  const handleExploreClick = (e) => {
    if (window.innerWidth > 991) {
      navigate("/putovanje");
      return;
    }
  };

  const handleExploreToggleMobile = (e) => {
    e.preventDefault();
    setExploreOpen(!exploreOpen);
  };

  const continents = [
    "Afika",
    "Azija",
    "Australija",
    "Europa",
    "Južna Amerika",
    "Sjeverna Amerika",
  ].sort();

  return (
    <>
      <nav
        className={`navbar navbar-expand-lg fixed-top ${
          scrolled ? "navbar-scrolled" : ""
        } ${menuOpen ? "navbar-menu-open" : ""}`}
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
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
            onClick={handleMenuToggle}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div 
            className={`navbar-collapse collapse ${menuOpen ? "show" : ""}`} 
            id="mainNavbar"
          >
            {/* Meni */}
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              {/* Istraži - Dropdown */}
              <li 
                className="nav-item dropdown"
                onMouseEnter={() => handleExploreHover(true)}
                onMouseLeave={() => handleExploreHover(false)}
              >
                <div className="explore-wrapper">
                  <Link 
                    className={`nav-link dropdown-toggle ${exploreOpen ? "active" : ""}`}
                    to="/putovanje"
                    onClick={handleExploreClick}
                    role="button"
                    aria-expanded={exploreOpen}
                  >
                    Istraži
                  </Link>
                  <button
                    className="explore-toggle-mobile"
                    onClick={handleExploreToggleMobile}
                    aria-label="Toggle explore menu"
                  >
                    <FontAwesomeIcon 
                      icon={faChevronDown}
                      className={`chevron-icon ${exploreOpen ? "open" : ""}`}
                    />
                  </button>
                </div>
                <ul className={`dropdown-menu ${exploreOpen ? "show" : ""}`}>
                  {continents.map((continent) => (
                    <li key={continent}>
                      <Link
                        className="dropdown-item"
                        to={`/putovanje/${continent.toLowerCase().replace(/\s+/g, "-")}`}
                        onClick={() => {
                          setExploreOpen(false);
                          handleMenuClose();
                        }}
                      >
                        {continent}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>

              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive("/blog") ? "active" : ""}`} 
                  to="/blog"
                  onClick={handleMenuClose}
                >
                  Blog
                </Link>
              </li>

              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive("/o-nama") ? "active" : ""}`} 
                  to="/o-nama"
                  onClick={handleMenuClose}
                >
                  O nama
                </Link>
              </li>

              <li className="nav-item">
                <Link 
                  className={`nav-link ${isActive("/kontakt") ? "active" : ""}`} 
                  to="/kontakt"
                  onClick={handleMenuClose}
                >
                  Kontakt
                </Link>
              </li>
            </ul>

            {/* Desna strana - Ikone */}
            <ul className="navbar-nav ms-auto align-items-center nav-icons">
              <li className="nav-item">
                <button 
                  className="nav-icon-btn" 
                  title="Pretraga"
                  onClick={() => setSearchModalOpen(true)}
                >
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </li>
              <li className="nav-item">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="nav-icon-btn"
                  title="Instagram"
                >
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
              </li>
              <li className="nav-item">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="nav-icon-btn"
                  title="Facebook"
                >
                  <FontAwesomeIcon icon={faFacebook} />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      <SearchModal 
        isOpen={searchModalOpen} 
        onClose={() => setSearchModalOpen(false)} 
      />
    </>
  );
};

export default Nav;