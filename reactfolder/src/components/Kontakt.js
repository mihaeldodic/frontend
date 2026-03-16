import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import "./checkbox.css";
import "./kontakt.css";
import {
  faFacebookF,
  faInstagram,
  faLinkedin,
  faTiktok,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

const Kontakt = () => {
  const form = useRef();
  const [isSent, setIsSent] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    if (!termsAccepted) {
      return;
    }

    emailjs
      .sendForm("service_97u9bj7", "template_dc4l4ga", form.current, {
        publicKey: "hYTEnnh516nSj-76R",
      })
      .then(
        () => {
          console.log("SUCCESS!");
          setIsSent(true);
          setTermsAccepted(false);
          if (form.current) {
            form.current.reset();
          }
          setTimeout(() => setIsSent(false), 3000);
        },
        (error) => {
          console.log("FAILED...", error.text);
        },
      );
  };

  return (
    <>
      <div className="container kontakt-page" style={{ marginTop: "50px" }}>
        <div className="row my-4">
          <h1 className="text-center mt-3">Kontakt</h1>
          <p className="text-center subtitle">
            Imajte li neko pitanje? Samo nam napišite poruku!
          </p>
          
          <div className="col-md-4 contact-left">
            <div>
              <h2>Kontakt Informacije</h2>
              <p>Slobodno nam se javite za sve detalje!</p>
            </div>
            
            <div className="contact-info">
              <a href="tel:+3851234567" className="contact-link d-flex gap-3 align-items-start">
                <FontAwesomeIcon icon={faPhone} className="contact-icon" /> 
                <span>+385 123 4567</span>
              </a>
              <a href="mailto:exploroers-way@gmail.com" className="contact-link d-flex gap-3 align-items-start">
                <FontAwesomeIcon icon={faEnvelope} className="contact-icon" />
                <span>exploroers-way@gmail.com</span>
              </a>
              <a href="#" className="contact-link d-flex gap-3 align-items-start">
                <FontAwesomeIcon icon={faLocationDot} className="contact-icon" />
                <span>Avenija Zagreb, 10000 Zagreb Hrvatska</span>
              </a>
            </div>
            
            <div className="socials">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FontAwesomeIcon icon={faTiktok} />
              </a>
              <a href="https://www.x.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FontAwesomeIcon icon={faXTwitter} />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
            </div>
          </div>
          
          <div className="col-md-8 contact-right">
            <div className="d-flex flex-column contact-inputs">
              <form ref={form} onSubmit={sendEmail}>
                <div className="form-group">
                  <label htmlFor="user_name">Ime</label>
                  <input 
                    type="text" 
                    id="user_name"
                    name="user_name" 
                    className="inputform" 
                    placeholder="Unesite vaše ime"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="user_email">Email</label>
                  <input 
                    type="email" 
                    id="user_email"
                    name="user_email" 
                    className="inputform"
                    placeholder="Unesite vaš email"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Poruka</label>
                  <textarea 
                    rows={4} 
                    id="message"
                    name="message" 
                    className="inputform"
                    placeholder="Unesite vašu poruku"
                    required
                  />
                </div>

                <div className="form-group contact-terms-row">
                  <input
                    className="checkbox-input-1"
                    type="checkbox"
                    id="kontakt-terms"
                    checked={termsAccepted}
                    onChange={(event) => setTermsAccepted(event.target.checked)}
                    required
                    style={{ marginTop: 0 }}
                  />
                  <label htmlFor="kontakt-terms" className="contact-terms-label">
                    Prihvaćam {" "}
                    <Link
                      to="/opci-uvjeti"
                      onClick={(event) => event.stopPropagation()}
                      className="contact-terms-link"
                    >
                      uvjete korištenja
                    </Link>{" "}
                    i {" "}
                    <Link
                      to="/zastita-podataka"
                      onClick={(event) => event.stopPropagation()}
                      className="contact-terms-link"
                    >
                      politiku privatnosti
                    </Link>{" "}
                    *
                  </label>
                </div>

                <button
                  type="submit"
                  className="contact-button mt-4"
                  disabled={isSent || !termsAccepted}
                >
                  {isSent ? "✓ Poruka poslana" : "Pošalji poruku"}
                </button>

                {isSent && (
                  <div className="success-message mt-3">
                    Hvala! Vaša poruka je uspješno poslana.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Kontakt;