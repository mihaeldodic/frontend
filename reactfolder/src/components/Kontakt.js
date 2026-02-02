import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import "./kontakt.css"
import { faInstagram, faLinkedin, faXTwitter } from "@fortawesome/free-brands-svg-icons";
const Kontakt = () => {
  return (
    <>
      <div className="container">
        <div className="row my-4">
          <h1 className="text-center mt-3">Kontakt</h1>
          <p className="text-center">
            Any question or remarks? Just write us a message!
          </p>
          <div className="col-md-4 contact-left">
            <div>
              <h2>Contact Information</h2>
              <p>Say something to start a live chat!</p>
            </div>
            <div className="contact-info">
              <a href="" className="d-flex gap-4 align-items-start">
                <FontAwesomeIcon icon={faPhone} className="pt-1" /> +1012 3456 789{" "}
              </a>
              <a href="" className="d-flex gap-4 align-items-start">
                <FontAwesomeIcon icon={faEnvelope} className="pt-1" /> demo@gmail.com{" "}
              </a>
              <a href="" className="d-flex gap-4 align-items-start">
                <FontAwesomeIcon icon={faLocationDot} className="pt-1"/> 132 Dartmouth Street Boston, Massachusetts 02156
                United States{" "}
              </a>
            </div>
            <div className="socials">
              <a href="www.x.com"><FontAwesomeIcon icon={faXTwitter} /></a>
              <a href="www.instagram.com"><FontAwesomeIcon icon={faInstagram} /></a>
              <a href="www.linkedin.com"><FontAwesomeIcon icon={faLinkedin} /></a>
            </div>
          </div>
          <div className="col-md-8 contact-right">
            <div className="d-flex flex-column contact-inputs" >
              <label htmlFor="name">First name</label>
              <input type="text" />
              <label htmlFor="email">Email</label>
              <input type="email" />
              <label htmlFor="message">Message</label>
              <textarea rows={1}></textarea>
            </div>
            <button className="contact-button"> Send Message </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Kontakt;