import { Link } from "react-router-dom";

const Nav = () => {
  return (
     <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img src="img/header/logo.svg" alt="logo" height="12" />
          </Link>
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
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 text-uppercase">
              <li className="nav-item">
                <Link className="nav-link text-end" to="/">
                  Naslovnica
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-end" to="/o-nama">
                  O nama
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-end" to="/kategorije">
                  Kategorije
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-end" to="/putovanje">
                  Putovanja
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-end" to="/blog">
                  Blog
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-end" to="/kontakt">
                  Kontakt
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <Link className="nav-link" to="/signin" title="Sign in">
                  <img
                    src="img/header/user.svg"
                    alt="Sign in"
                    className="icon-sm"
                  />
                </Link>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/cart" title="Cart">
                  <img src="img/header/cart.svg" alt="Cart" className="icon-lg" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
  )
}
export default Nav