import ScrollToTop from "./ScrollToTop";
import "./footer.css";

const Footer = () => {
  return (
    <>
    <section>
      <div className="row row-subscribe justify-content-center align-items-center">
        <div className="col-10 col-lg-6 col-md-6 col-sm-8">
          <div className="subscribe">
            <form action="#" className="subscribe-form">
              <div className="form-group d-flex">
                <input
                  type="email"
                  aria-label="Email adresa"
                  className="form-control"
                  placeholder="Upišite svoju email adresu"
                  required
                />
                <div className="subscribe-button d-flex">
                  <button type="submit" className="btn btn-primary">
                    Pretplati se
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>

    <footer className="footer-01">
      <div className="container">
        <div className="row row-footer mt-5">
          <div className="col-md-4 col-lg-5">
            <div className="footer-brand">
              <h2 className="footer-heading">
                <a href="" className="logo">
                  Explorersway.com
                </a>
              </h2>
              <p>
                Explorers Wey je putnička agencija posvećena onima koji žele
                više od običnog putovanja. Kreiramo autentična iskustva,
                nezaboravne avanture i pažljivo osmišljene rute koje vode izvan
                utabanih staza. Vaš put započinje ovdje.
              </p>
              <a href="" className="footer-link">
                Pročitajte više
                <span className="ion-ios-arrow-round-forward"></span>
              </a>
            </div>
          </div>

          <div className="col-md-8 col-lg-7 d-flex justify-content-center">
            <div className="row">
              <div className="col-md-4 border-start ps-3">
                <h2 className="footer-heading-01">Istraži</h2>
                <nav aria-label="Footer navigacija"></nav>
                <ul className="list-unstyled">
                  <li>
                    <a href="" className="py-1 d-block">
                      Europu
                    </a>
                  </li>
                  <li>
                    <a href="" className="py-1 d-block">
                      Aziju
                    </a>
                  </li>
                  <li>
                    <a href="" className="py-1 d-block">
                      Afriku
                    </a>
                  </li>
                  <li>
                    <a href="" className="py-1 d-block">
                      Sjevernu Ameriku
                    </a>
                  </li>
                  <li>
                    <a href="" className="py-1 d-block">
                      Južnu Ameriku
                    </a>
                  </li>
                </ul>
              </div>
              <div className="col-md-4 border-start ps-3">
                <h2 className="footer-heading-02">Istraži</h2>
                <nav aria-label="Footer navigacija"></nav>
                <ul className="list-unstyled">
                  <li>
                    <a href="" className="py-1 d-block">
                      Europu
                    </a>
                  </li>
                  <li>
                    <a href="" className="py-1 d-block">
                      Aziju
                    </a>
                  </li>
                  <li>
                    <a href="" className="py-1 d-block">
                      Afriku
                    </a>
                  </li>
                  <li>
                    <a href="" className="py-1 d-block">
                      Sjevernu Ameriku
                    </a>
                  </li>
                  <li>
                    <a href="" className="py-1 d-block">
                      Južnu Ameriku
                    </a>
                  </li>
                </ul>
              </div>
              <div className="col-md-4 border-start ps-3">
                <h2 className="footer-heading-03">Istraži</h2>
                <nav aria-label="Footer navigacija"></nav>
                <ul className="list-unstyled">
                  <li>
                    <a href="" className="py-1 d-block">
                      Europu
                    </a>
                  </li>
                  <li>
                    <a href="" className="py-1 d-block">
                      Aziju
                    </a>
                  </li>
                  <li>
                    <a href="" className="py-1 d-block">
                      Afriku
                    </a>
                  </li>
                  <li>
                    <a href="" className="py-1 d-block">
                      Sjevernu Ameriku
                    </a>
                  </li>
                  <li>
                    <a href="" className="py-1 d-block">
                      Južnu Ameriku
                    </a>
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
    </footer>

  </>
  );
};

export default Footer;
