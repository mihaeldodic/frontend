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
import { useState, useRef } from "react";
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import emailjs from "@emailjs/browser";

const Footer = () => {
  const form = useRef();
  const [accepted, setAccepted] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputStatus, setInputStatus] = useState(""); // "success" ili "error"
  const [displayText, setDisplayText] = useState(""); // Tekst u inputu

  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();

    // Validacija
    if (!email.trim()) {
      setInputStatus("error");
      setDisplayText("Email je obavezan");
      setTimeout(() => {
        setInputStatus("");
        setDisplayText("");
      }, 3000);
      return;
    }

    if (!accepted) {
      setInputStatus("error");
      setDisplayText("Prihvatite uvjete");
      setTimeout(() => {
        setInputStatus("");
        setDisplayText("");
      }, 3000);
      return;
    }

    // Email validacija
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setInputStatus("error");
      setDisplayText("Email nije validan");
      setTimeout(() => {
        setInputStatus("");
        setDisplayText("");
      }, 3000);
      return;
    }

    setLoading(true);
    setInputStatus("");
    setDisplayText("");

    const templateParams = {
      user_name: "Newsletter Subscriber",
      user_email: email,
      message: `Novi pretplatnik na newsletter: ${email}\nDatum: ${new Date().toLocaleString()}`
    };

    emailjs
      .send(
        "service_97u9bj7",
        "template_dc4l4ga",
        templateParams,
        {
          publicKey: "hYTEnnh516nSj-76R",
        }
      )
      .then(
        () => {
          console.log("SUCCESS!");
          setInputStatus("success");
          setDisplayText("✓ Uspješno poslano!");
          setEmail("");
          setAccepted(false);
          setLoading(false);

          setTimeout(() => {
            setInputStatus("");
            setDisplayText("");
          }, 4000);
        },
        (error) => {
          console.error("FAILED...", error.text);
          setInputStatus("error");
          setDisplayText("Greška pri slanju");
          setLoading(false);

          setTimeout(() => {
            setInputStatus("");
            setDisplayText("");
          }, 3000);
        }
      );
  };

  return (
    <>
      <ScrollToTop />
      
      <footer className="footer-01">
        <div className="row row-subscribe justify-content-center align-items-center">
          <div className="subscribe-1 col-10 col-lg-6 col-md-6 col-sm-8">
            <form className="subscribe-form" onSubmit={handleSubscribe}>
              <div className={`subscribe ${inputStatus ? `subscribe-${inputStatus}` : ''}`}>
                <input
                  type="text"
                  aria-label="Email adresa"
                  className="form-control"
                  placeholder={displayText || "Upišite svoju email adresu"}
                  value={displayText || email}
                  onChange={(e) => !displayText && setEmail(e.target.value)}
                  disabled={loading || !!displayText}
                  readOnly={!!displayText}
                />
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="email-icon"
                />
                <button
                  type="submit"
                  className="btn btn-primary subscribe-btn"
                  disabled={!accepted || loading || !!displayText}
                >
                  {loading ? "Slanje..." : "Pretplati se"}
                </button>
              </div>
            </form>
          </div>

          <div className="row justify-content-center align-items-center">
            <div className="col-12">
              <div className="subscribe-2 d-flex justify-content-center align-items-center flex-wrap gap-3">
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
        </div>

        <div className="container">
          <div className="row row-footer mt-5">
            <div className="col-md-4 col-lg-5">
              <div className="footer-brand">
                <h2 className="footer-heading">
                  <Link to="/" className="logo" onClick={handleLinkClick}>
                    Explorersway.com
                  </Link>
                </h2>
                <p>
                  Explorers Wey je putnička agencija posvećena onima koji žele
                  više od običnog putovanja. Kreiramo autentična iskustva,
                  nezaboravne avanture i pažljivo osmišljene rute koje vode
                  izvan utabanih staza. Vaš put započinje ovdje.
                </p>
                <Link to="/" className="footer-link" onClick={handleLinkClick}>
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
                      <Link to="/putovanje/kontinent/afrika" className="py-1 footer-link-item" onClick={handleLinkClick}>
                        Afrika
                      </Link>
                    </li>
                    <li>
                      <Link to="/putovanje/kontinent/australija" className="py-1 footer-link-item" onClick={handleLinkClick}>
                        Australija
                      </Link>
                    </li>
                    <li>
                      <Link to="/putovanje/kontinent/azija" className="py-1 footer-link-item" onClick={handleLinkClick}>
                        Azija
                      </Link>
                    </li>
                    <li>
                      <Link to="/putovanje/kontinent/europa" className="py-1 footer-link-item" onClick={handleLinkClick}>
                        Europa
                      </Link>
                    </li>
                    <li>
                      <Link to="/putovanje/kontinent/juzna-amerika" className="py-1 footer-link-item" onClick={handleLinkClick}>
                        Južna Amerika
                      </Link>
                    </li>
                    <li>
                      <Link to="/putovanje/kontinent/sjeverna-amerika" className="py-1 footer-link-item" style={{ whiteSpace: 'nowrap' }} onClick={handleLinkClick}>
                        Sjeverna Amerika
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="footer-sadrzaj-2 col-md-4 border-start ps-3">
                  <h2 className="footer-heading-02">Sadržaj</h2>
                  <nav aria-label="Footer navigacija"></nav>
                  <ul className="list-unstyled">
                    <li>
                      <Link to="/" className="py-1 footer-link-item" onClick={handleLinkClick}>
                        Naslovna
                      </Link>
                    </li>
                    <li>
                      <Link to="/blog" className="py-1 footer-link-item" onClick={handleLinkClick}>
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link to="/o-nama" className="py-1 footer-link-item" onClick={handleLinkClick}>
                        O nama
                      </Link>
                    </li>
                    <li>
                      <Link to="/kontakt" className="py-1 footer-link-item" onClick={handleLinkClick}>
                        Kontakt
                      </Link>
                    </li>
                    <li>
                      <Link to="/" className="py-1 footer-link-item" style={{ whiteSpace: 'nowrap' }} onClick={handleLinkClick}>
                        Zaštita privatnosti
                      </Link>
                    </li>
                    <li>
                      <Link to="/" className="py-1 footer-link-item" onClick={handleLinkClick}>
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
                      <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="py-1 footer-link-item">
                        <FontAwesomeIcon
                          icon={faFacebookF}
                          className="me-2 social-icon"
                        />
                        Facebook
                      </a>
                    </li>
                    <li>
                      <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="py-1 footer-link-item">
                        <FontAwesomeIcon
                          icon={faInstagram}
                          className="me-2 social-icon"
                        />
                        Instagram
                      </a>
                    </li>
                    <li>
                      <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="py-1 footer-link-item">
                        <FontAwesomeIcon
                          icon={faTiktok}
                          className="me-2 social-icon"
                        />
                        TikTok
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container copyright">
          <div className="row justify-content-center">
            <div className="col-auto">
              <p>
                Copyright © 2025 - 2026 Explorers Way. Frontend edukacija IZM. |
                Made by{" "}
                <Link to="/" onClick={handleLinkClick}>
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