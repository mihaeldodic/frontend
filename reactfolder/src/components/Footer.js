import ScrollToTop from "./ScrollToTop";
import "./footer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import CheckBox from "../components/CheckBox";
import { useState } from "react";
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  const [accepted, setAccepted] = useState(false);

  return (
    <>
      <footer className="footer-01">
        <div className="row row-subscribe justify-content-center align-items-center">
          <div className="subscribe-1 col-10 col-lg-6 col-md-6 col-sm-8">
            <div className="subscribe">
              <form action="/" className="subscribe-form">
                <div className="form-group d-flex">
                  <input
                    type="email"
                    aria-label="Email adresa"
                    className="form-control ps-5"
                    placeholder="Upišite svoju email adresu"
                    required
                  />
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="position-absolute top-50 start-10 translate-middle-y ms-3 text-muted"
                  />
                  <div className="subscribe-button d-flex">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={!accepted}
                    >
                      Pretplati se
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="row justify-content-center align-items-center">
            <div className="subscribe-2 col-10 col-lg-6 col-md-6 col-sm-8 d-flex justify-content-between">
              <p className="p-subscribe mb-0">
                Prijavite se na newsletter i primajte najnovije obavijesti
              </p>
              <CheckBox
                accepted={accepted}
                onChange={() => setAccepted(!accepted)}
              />
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row row-footer mt-5">
            <div className="col-md-4 col-lg-5">
              <div className="footer-brand">
                <h2 className="footer-heading">
                  <Link to="/" className="logo">
                    Explorersway.com
                  </Link>
                </h2>
                <p>
                  Explorers Wey je putnička agencija posvećena onima koji žele
                  više od običnog putovanja. Kreiramo autentična iskustva,
                  nezaboravne avanture i pažljivo osmišljene rute koje vode
                  izvan utabanih staza. Vaš put započinje ovdje.
                </p>
                <Link to="/" className="footer-link">
                  Pročitajte više
                  <span className="ion-ios-arrow-round-forward"></span>
                </Link>
              </div>
            </div>

            <div className="col-md-8 col-lg-7 d-flex justify-content-center">
              <div className="row">
                <div className="footer-sadrzaj-1 col-md-4 border-start ps-3">
                  <h2 className="footer-heading-01">Istraži</h2>
                  <nav aria-label="Footer navigacija"></nav>
                  <ul className="list-unstyled">
                    <li>
                      <Link to="/" className="py-1 footer-link-item">
                        Europu
                      </Link>
                    </li>
                    <li>
                      <Link to="/" className="py-1 footer-link-item">
                        Aziju
                      </Link>
                    </li>
                    <li>
                      <Link to="/" className="py-1 footer-link-item">
                        Afriku
                      </Link>
                    </li>
                    <li>
                      <Link to="/" className="py-1 footer-link-item" style={{ whiteSpace: 'nowrap' }}>
                        Sjevernu Ameriku
                      </Link>
                    </li>
                    <li>
                      <Link to="/" className="py-1 footer-link-item">
                        Južnu Ameriku
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="footer-sadrzaj-2 col-md-4 border-start ps-3">
                  <h2 className="footer-heading-02">Sadržaj</h2>
                  <nav aria-label="Footer navigacija"></nav>
                  <ul className="list-unstyled">
                    <li>
                      <Link to="/" className="py-1 footer-link-item">
                        Naslovna
                      </Link>
                    </li>
                    <li>
                      <Link to="/" className="py-1 footer-link-item">
                        O nama
                      </Link>
                    </li>
                    <li>
                      <Link to="/" className="py-1 footer-link-item">
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link to="/" className="py-1 footer-link-item">
                        Kontakt
                      </Link>
                    </li>
                    <li>
                      <Link to="/" className="py-1 footer-link-item" style={{ whiteSpace: 'nowrap' }}>
                        Zaštita privatnosti
                      </Link>
                    </li>
                    <li>
                      <Link to="/" className="py-1 footer-link-item">
                        Opći uvjeti
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="footer-sadrzaj-3 col-md-4 border-start ps-3">
                  <h2 className="footer-heading-03">Zaprati nas</h2>
                  <nav aria-label="Footer navigacija"></nav>
                  <ul className="list-unstyled">
                    <li>
                      <Link to="/" className="py-1 footer-link-item">
                        <FontAwesomeIcon
                          icon={faFacebookF}
                          className="me-2 social-icon"
                        />
                        Facebook
                      </Link>
                    </li>
                    <li>
                      <Link to="/" className="py-1 footer-link-item">
                        <FontAwesomeIcon
                          icon={faInstagram}
                          className="me-2 social-icon"
                        />
                        Instagram
                      </Link>
                    </li>
                    <li>
                      <Link to="/" className="py-1 footer-link-item">
                        <FontAwesomeIcon
                          icon={faTiktok}
                          className="me-2 social-icon"
                        />
                        TikTok
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <button className="btn btn-danger" onClick={ScrollToTop}>
            TOP
          </button>
        </div>
        <div className="copyright">
          <div className="row justify-content-center">
            <div className="col-auto">
              <p>
                Copyright © 2025 - 2026 Explorers Way. Frontend edukacija IZM. |
                Made by{" "}
                <Link to="/" target="_blank">
                  Mihael Dodić
                </Link>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
