const Kontakt = () => {
  return (
    <>
      <div className="container">
        <div className="row">
          <h1 className="text-center my-4">Kontakt</h1>
          <p className="text-center">Imate li pitanja?</p>
          <div className="col-md-4">
            <div>
              <h2>Kontakt informacije</h2>
              <p>Recite nešto</p>
            </div>
          </div>

          <div className="d-flex flex-column">
            <a href="">
              <span>+3856635554</span>
            </a>
            <a href="">
              <span></span>email@email.com
            </a>
            <a href="">
              <span></span>10000 Zagreb
            </a>
          </div>
          <div className="d-flex flex-column">
            <a href="">
              <span>X</span>
            </a>
            <a href="">
              <span></span>Instagram
            </a>
            <a href="">
              <span></span>LinkedIN
            </a>
          </div>
        </div>
        <div className="col-md-8">
          <label htmlFor="name">first name</label>
          <input type="text" />
          <label htmlFor="email">Email</label>
          <input type="email" />
          <label htmlFor="message">Poruka</label>
        </div>
      </div>
    </>
  );
};

export default Kontakt;
