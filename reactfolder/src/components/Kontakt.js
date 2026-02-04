import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import "./kontakt.css";
import {
  faInstagram,
  faLinkedin,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
const Kontakt = () => {
  const form = useRef();
  const [isSent, setIsSent] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_97u9bj7", "template_dc4l4ga", form.current, {
        publicKey: "hYTEnnh516nSj-76R",
      })
      .then(
        () => {
          console.log("SUCCESS!");
          setIsSent(true);
        },
        (error) => {
          console.log("FAILED...", error.text);
        },
      );
  };
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
                <FontAwesomeIcon icon={faPhone} className="pt-1" /> +1012 3456
                789{" "}
              </a>
              <a href="" className="d-flex gap-4 align-items-start">
                <FontAwesomeIcon icon={faEnvelope} className="pt-1" />{" "}
                demo@gmail.com{" "}
              </a>
              <a href="" className="d-flex gap-4 align-items-start">
                <FontAwesomeIcon icon={faLocationDot} className="pt-1" /> 132
                Dartmouth Street Boston, Massachusetts 02156 United States{" "}
              </a>
            </div>
            <div className="socials">
              <a href="www.x.com">
                <FontAwesomeIcon icon={faXTwitter} />
              </a>
              <a href="www.instagram.com">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="www.linkedin.com">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
            </div>
          </div>
          <div className="col-md-8 contact-right">
            <div className="d-flex flex-column contact-inputs">
              <form ref={form} onSubmit={sendEmail}>
                <label>Name</label>
                <input type="text" name="user_name" className="inputform" />
                <label>Email</label>
                <input type="email" name="user_email" className="inputform" />
                <label>Message</label>
                <textarea rows={2} name="message" className="inputform" />
                <button
                  type="submit"
                  value="Send"
                  className="contact-button mt-5"
                  disabled={isSent}
                >
                  {isSent ? "Message Sent" : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Kontakt;
