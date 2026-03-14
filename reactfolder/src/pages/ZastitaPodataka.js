import "./zastitapodataka.css";

const ZastitaPodataka = () => {
  return (
    <div className="zastita-page">
      <section className="zastita-section">
        <div className="container zastita-container">
          <div className="zastita-header">
            <span className="zastita-tag">Pravila privatnosti</span>
            <h1>Zaštita podataka</h1>
            <p>
              Ova stranica objašnjava kako prikupljamo, obrađujemo i čuvamo vaše
              osobne podatke kada koristite web stranicu Explorers Way.
            </p>
          </div>

          <article className="zastita-card">
            <h2>1. Voditelj obrade</h2>
            <p>
              Voditelj obrade osobnih podataka je Explorers Way. Za sva pitanja
              vezana uz privatnost i obradu podataka možete nas kontaktirati
              putem stranice Kontakt.
            </p>

            <h2>2. Koje podatke prikupljamo</h2>
            <p>
              Prikupljamo samo podatke koji su potrebni za pružanje usluga,
              uključujući podatke koje sami unesete (npr. ime, email, kontakt)
              te tehničke podatke potrebne za rad stranice.
            </p>

            <h2>3. Svrha obrade podataka</h2>
            <p>
              Vaše podatke obrađujemo radi odgovora na upite, realizacije
              putovanja, slanja relevantnih informacija i unaprjeđenja
              korisničkog iskustva.
            </p>

            <h2>4. Pravna osnova</h2>
            <p>
              Obrada se provodi na temelju vašeg pristanka, izvršavanja ugovora,
              zakonskih obveza ili legitimnog interesa, ovisno o vrsti zahtjeva.
            </p>

            <h2>5. Rok čuvanja podataka</h2>
            <p>
              Podatke čuvamo onoliko dugo koliko je potrebno za svrhu za koju su
              prikupljeni ili koliko nalažu važeći propisi.
            </p>

            <h2>6. Dijeljenje podataka</h2>
            <p>
              Podatke ne prodajemo trećim stranama. Dijeljenje je moguće samo s
              pouzdanim partnerima koji sudjeluju u pružanju usluge, uz obvezu
              zaštite podataka.
            </p>

            <h2>7. Vaša prava</h2>
            <p>
              Imate pravo na pristup, ispravak, brisanje, ograničenje obrade,
              prigovor i prenosivost podataka u skladu s važećim propisima.
            </p>

            <h2>8. Kontakt za privatnost</h2>
            <p>
              Za ostvarivanje prava ili dodatna pitanja o obradi podataka,
              kontaktirajte nas putem kontakt obrasca na web stranici.
            </p>

            <p className="zastita-note">
              Zadnje ažuriranje: ožujak 2026.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default ZastitaPodataka;