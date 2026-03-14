import "./opciuvjeti.css";

const OpciUvjeti = () => {
  return (
    <div className="opci-page">
      <section className="opci-section">
        <div className="container opci-container">
          <div className="opci-header">
            <span className="opci-tag">Pravila korištenja</span>
            <h1>Opći uvjeti</h1>
            <p>
              Ovi opći uvjeti uređuju način korištenja web stranice Explorers
              Way, uvjete rezervacije i prava te obveze korisnika i agencije.
            </p>
          </div>

          <article className="opci-card">
            <h2>1. Prihvaćanje uvjeta</h2>
            <p>
              Korištenjem ove web stranice potvrđujete da ste upoznati s ovim
              uvjetima i da ih prihvaćate u cijelosti.
            </p>

            <h2>2. Točnost informacija</h2>
            <p>
              Nastojimo osigurati točnost svih objavljenih informacija, ali ne
              možemo jamčiti da su sve informacije uvijek potpune ili ažurne.
            </p>

            <h2>3. Rezervacije i plaćanje</h2>
            <p>
              Rezervacija putovanja smatra se valjanom nakon potvrde i uplate u
              skladu s uvjetima pojedine ponude.
            </p>

            <h2>4. Otkazivanje i izmjene</h2>
            <p>
              Uvjeti otkazivanja i izmjene rezervacije ovise o vrsti usluge i
              dobavljaču te su navedeni u detaljima pojedinog putovanja.
            </p>

            <h2>5. Odgovornost korisnika</h2>
            <p>
              Korisnik je odgovoran za točnost podataka koje dostavlja, kao i za
              ispunjavanje putnih i zakonskih uvjeta (dokumentacija, vize,
              osiguranje i sl.).
            </p>

            <h2>6. Intelektualno vlasništvo</h2>
            <p>
              Sav sadržaj na stranici (tekstovi, fotografije, grafike i dizajn)
              zaštićen je autorskim pravima te se ne smije koristiti bez
              prethodne suglasnosti.
            </p>

            <h2>7. Ograničenje odgovornosti</h2>
            <p>
              Explorers Way ne odgovara za neizravne štete nastale korištenjem
              stranice ili zbog privremene nedostupnosti usluge.
            </p>

            <h2>8. Završne odredbe</h2>
            <p>
              Zadržavamo pravo izmjene ovih uvjeta u bilo kojem trenutku. Sve
              izmjene stupaju na snagu objavom na ovoj stranici.
            </p>

            <p className="opci-note">Zadnje ažuriranje: ožujak 2026.</p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default OpciUvjeti;