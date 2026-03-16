import "./Blog.css";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";

import Loader from "../components/Loader";

const BASE_URL = process.env.REACT_APP_API_URL;

const resolveMediaUrl = async (mediaField) => {
  if (!mediaField) return "";

  if (typeof mediaField === "string") {
    if (mediaField.startsWith("http")) {
      return mediaField;
    }

    if (/^\d+$/.test(mediaField)) {
      try {
        const response = await fetch(`${BASE_URL}v2/media/${mediaField}`);
        if (!response.ok) return "";
        const media = await response.json();
        return media.source_url || "";
      } catch {
        return "";
      }
    }

    return "";
  }

  if (typeof mediaField === "number") {
    try {
      const response = await fetch(`${BASE_URL}v2/media/${mediaField}`);
      if (!response.ok) return "";
      const media = await response.json();
      return media.source_url || "";
    } catch {
      return "";
    }
  }

  if (typeof mediaField === "object") {
    return (
      mediaField.source_url ||
      mediaField.url ||
      mediaField.sizes?.full?.url ||
      mediaField.sizes?.large?.url ||
      ""
    );
  }

  return "";
};

const formatTravelDate = (value) => {
  if (!value) return "";

  const rawValue = String(value).trim();
  const compactMatch = rawValue.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (compactMatch) {
    return `${compactMatch[3]}.${compactMatch[2]}.${compactMatch[1]}.`;
  }

  const isoMatch = rawValue.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (isoMatch) {
    return `${isoMatch[3]}.${isoMatch[2]}.${isoMatch[1]}.`;
  }

  const dottedMatch = rawValue.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
  if (dottedMatch) {
    return `${dottedMatch[1].padStart(2, "0")}.${dottedMatch[2].padStart(2, "0")}.${dottedMatch[3]}.`;
  }

  return rawValue;
};

const buildDaysFromAcf = async (acf = {}) => {
  const dayMap = {};

  await Promise.all(
    Object.entries(acf).map(async ([key, value]) => {
    const normalizedKey = String(key).toLowerCase().replace(/_+$/, "");
    const match = normalizedKey.match(/^dan_(\d+)_(naslov|opis|datum|slika|image)$/i);
    if (!match) return;

    const dayNumber = Number(match[1]);
    const fieldType = match[2].toLowerCase();
    const safeValue = typeof value === "string" ? value.trim() : value;

    if (!dayMap[dayNumber]) {
      dayMap[dayNumber] = {
        number: dayNumber,
        title: "",
        description: "",
        date: "",
        image: "",
      };
    }

    if (fieldType === "naslov") {
      dayMap[dayNumber].title = safeValue || "";
    }

    if (fieldType === "opis") {
      dayMap[dayNumber].description = safeValue || "";
    }

    if (fieldType === "datum") {
      dayMap[dayNumber].date = safeValue || "";
    }

    if (fieldType === "slika" || fieldType === "image") {
      dayMap[dayNumber].image = await resolveMediaUrl(safeValue);
    }
  })
  );

  return Object.values(dayMap)
    .filter((day) => day.title || day.description || day.date || day.image)
    .sort((a, b) => a.number - b.number);
};

const normalizeAcfMediaField = (value) => {
  if (!value) return "";
  if (typeof value === "object") {
    if (value.ID) return value.ID;
    if (value.id) return value.id;
  }
  return value;
};

const buildExcursionsFromAcf = async (acf = {}) => {
  const details =
    acf.detaljji_destinacije && typeof acf.detaljji_destinacije === "object"
      ? acf.detaljji_destinacije
      : acf;

  const indexes = Object.keys(details)
    .map((key) => {
      const match = String(key).match(
        /(?:naziv_izleta|opis_izleta|slika_izleta|cijena_izleta)_(\d+)$/i
      );
      return match ? Number(match[1]) : null;
    })
    .filter((value) => Number.isFinite(value));

  const uniqueSortedIndexes = [...new Set(indexes)].sort((a, b) => a - b);

  const excursions = await Promise.all(
    uniqueSortedIndexes.map(async (i) => {
      const nazivRaw = details[`naziv_izleta_${i}`] || "";
      const opisRaw = details[`opis_izleta_${i}`] || "";
      const cijenaRaw = details[`cijena_izleta_${i}`] || 0;
      const slikaRaw = details[`slika_izleta_${i}`];

      const naziv = String(nazivRaw).trim();
      const opis = String(opisRaw || "").trim();
      const cijena = Number(cijenaRaw || 0);
      const slika = await resolveMediaUrl(normalizeAcfMediaField(slikaRaw));

      if (!naziv && !opis && !cijena && !slika) {
        return null;
      }

      return {
        id: i,
        naziv,
        opis,
        cijena,
        slika,
      };
    })
  );

  return excursions.filter(Boolean);
};

const PutovanjeBlogSingle = () => {
  const { slug } = useParams();
  const [travel, setTravel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedExcursions, setSelectedExcursions] = useState([]);
  const [numPersons, setNumPersons] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isHuman, setIsHuman] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const excursions = travel?.excursions || [];

  // Izračun cijena
  const basePrice = Number(travel?.price || 0);
  const selectedExcursionItems = selectedExcursions
    .map((idx) => excursions[idx])
    .filter(Boolean);
  const selectedExcursionsTotal = selectedExcursions.reduce((sum, idx) => sum + (excursions[idx]?.cijena || 0), 0);
  const totalPrice = (basePrice + selectedExcursionsTotal) * numPersons;

  // Handleri
  const handleExcursionChange = (idx) => {
    setSelectedExcursions((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };
  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleNumPersons = (e) => {
    const val = Math.max(1, Number(e.target.value));
    setNumPersons(val);
  };
  const handleTerms = (e) => setTermsAccepted(e.target.checked);
  const handleHuman = (e) => setIsHuman(e.target.checked);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSent(false);
    setSending(true);
    setError("");

    if (!form.name.trim() || !form.email.trim()) {
      setError("Molimo unesite ime i prezime te email.");
      setSending(false);
      return;
    }

    const selectedListText = selectedExcursionItems.length
      ? selectedExcursionItems
          .map((item) => `- ${item.naziv || "Fakultativni izlet"}: €${Number(item.cijena || 0).toLocaleString()}`)
          .join("\n")
      : "- Nema odabranih fakultativnih izleta";

    const offerMessage = [
      `Upit za putovanje: ${travel?.title || "Nepoznato putovanje"}`,
      `Ime i prezime: ${form.name}`,
      `Email: ${form.email}`,
      `Broj putnika: ${numPersons}`,
      "",
      "Odabrani fakultativni izleti:",
      selectedListText,
      "",
      `Ukupna cijena po putniku: €${(basePrice + selectedExcursionsTotal).toLocaleString()}`,
      `Ukupna cijena: €${totalPrice.toLocaleString()}`,
      "",
      `Poruka korisnika: ${form.message || "(nije uneseno)"}`,
    ].join("\n");

    try {
      await emailjs.send(
        "service_97u9bj7",
        "template_dc4l4ga",
        {
          user_name: form.name,
          user_email: form.email,
          message: offerMessage,
          order_details: selectedListText,
          total_price: totalPrice,
          destination_name: travel?.title || "",
          passengers: numPersons,
        },
        {
          publicKey: "hYTEnnh516nSj-76R",
        }
      );

      setSent(true);
      setForm({ name: "", email: "", message: "" });
      setNumPersons(1);
      setSelectedExcursions([]);
      setTermsAccepted(false);
      setIsHuman(false);
    } catch (sendError) {
      setError("Došlo je do greške pri slanju ponude. Pokušajte ponovno.");
      console.error("Ponuda email error:", sendError);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    fetchTravel();
  }, [slug]);

  const fetchTravel = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}v2/nova-destinacija?slug=${slug}`
      );
      const data = await response.json();
      
      if (data.length > 0) {
        const post = data[0];
        const acf = post.acf || {};

        // Dohvati sliku
        const imageUrl = await resolveMediaUrl(acf.image || acf.hero_image || acf.hero_slika);
        const days = await buildDaysFromAcf(acf);
        const excursions = await buildExcursionsFromAcf(acf);

        setTravel({
          id: post.id,
          title: post.title.rendered,
          continent: acf.continent || "Nepoznato",
          price: acf.price || 0,
          month: acf.month || "Nepoznato",
          duration: acf.travel_duration || "Nepoznato",
          description: acf.description || "",
          image: imageUrl,
          country: acf.drzava || "",
          departureDate:
            formatTravelDate(
              acf.date ||
                acf.datum_polaska ||
                acf.polazak ||
                acf.datum_od ||
                acf.start_date ||
                ""
            ),
          returnDate:
            formatTravelDate(
              acf.date_2 ||
                acf["date-2"] ||
                acf.datum_povratka ||
                acf.povratak ||
                acf.datum_do ||
                acf.end_date ||
                ""
            ),
          transportMethod:
            acf.nacin_putovanja ||
            acf["nacin-putovanja"] ||
            acf.prijevozno_sredstvo ||
            "",
          includedServices: acf.ukljuceno || "",
          travelPlan: acf.plan_putovanja || "",
          days,
          excursions,
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Greška pri dohvaćanju putovanja:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!travel) {
    return (
      <div className="blog-single-modern">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-10 col-lg-8 col-xl-7 text-center">
              <p>Putovanje nije pronađeno</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-single-modern">
      <section
        className="travel-single-hero"
        style={{
          backgroundImage: `url(${travel.image || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80"})`,
        }}
      >
        <div className="travel-single-hero-overlay">
          <div className="container">
            <div className="travel-single-hero-content">
              <h1>{travel.title}</h1>
              <p className="travel-single-subtitle">{travel.continent}</p>
              <div className="travel-single-meta">
                <span>{travel.month}</span>
                <span>{travel.duration}</span>
                <span>€{travel.price.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Artikal */}
      <article className="mb-4">
        <div className="container px-4 px-lg-5">
          <div className="row gx-4 gx-lg-5 justify-content-center">
            <div className="col-md-10 col-lg-8 col-xl-7">
              
              {/* Info kartice */}
              <div className="travel-info-cards mb-5">
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="info-card">
                      <h5>DRŽAVA</h5>
                      <p>{travel.country || "Nepoznato"}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-card">
                      <h5>MJESEC</h5>
                      <p>{travel.month}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-card">
                      <h5>TRAJANJE</h5>
                      <p>{travel.duration}</p>
                    </div>
                  </div>
                  {(travel.departureDate || travel.returnDate) && (
                    <div className="col-md-6">
                      <div className="info-card">
                        <h5>DATUM PUTOVANJA</h5>
                        <p>
                          {travel.departureDate || "-"}
                          {travel.departureDate && travel.returnDate ? " - " : ""}
                          {travel.returnDate || ""}
                        </p>
                      </div>
                    </div>
                  )}
                  {travel.transportMethod && (
                    <div className="col-md-6">
                      <div className="info-card">
                        <h5>NAČIN PUTOVANJA</h5>
                        <p>{travel.transportMethod}</p>
                      </div>
                    </div>
                  )}
                  <div className="col-md-6">
                    <div className="info-card">
                      <h5>CIJENA</h5>
                      <p className="price">€{travel.price.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Opis */}
              <div className="section mb-5">
                <h2>Opis putovanja</h2>
                <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {travel.description}
                </p>
              </div>

              {/* Što je uključeno */}
              {travel.includedServices && (
                <div className="section mb-5">
                  <h2>Što je uključeno</h2>
                  <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {travel.includedServices}
                  </p>
                </div>
              )}

              {/* Plan putovanja */}
              {travel.travelPlan && (
                <div className="section mb-5">
                  <h2>Plan putovanja</h2>
                  <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {travel.travelPlan}
                  </p>
                </div>
              )}


              {/* Dani putovanja */}
              {travel.days && travel.days.length > 0 && (
                <div className="days-section">
                  {travel.days.map((day) => (
                    <div className="day-card mb-4" key={day.number}>
                      <h3>
                        <span className="day-badge">Dan {day.number}</span> {day.title || "Program dana"}
                      </h3>
                      {day.date && <span className="day-date">{day.date}</span>}
                      {day.image && (
                        <img
                          src={day.image}
                          alt={day.title || `Dan ${day.number}`}
                          className="day-card-image"
                        />
                      )}
                      {day.description && (
                        <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                          {day.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}


              {/* Fakultativni izleti */}
              {excursions.length > 0 && (
                <div className="section mb-5">
                  <h2>Dodatni izleti (fakultativno)</h2>
                  <div className="excursions-section">
                    {excursions.map((ex, idx) => (
                      <div className="excursion-card mb-4" key={ex.id}>
                        <div className="excursion-card-head">
                          <label className="excursion-title-wrap" htmlFor={`excursion-${idx}`}>
                            <input
                              className="checkbox-input-1"
                              type="checkbox"
                              id={`excursion-${idx}`}
                              checked={selectedExcursions.includes(idx)}
                              onChange={() => handleExcursionChange(idx)}
                            />
                            <span className="excursion-badge">Izlet {idx + 1}</span>
                            <h3>{ex.naziv || "Fakultativni izlet"}</h3>
                          </label>
                          <span className="excursion-price">+ €{Number(ex.cijena || 0).toLocaleString()}</span>
                        </div>

                        {ex.slika && (
                          <img
                            src={ex.slika}
                            alt={ex.naziv || `Izlet ${idx + 1}`}
                            className="excursion-card-image"
                          />
                        )}

                        {ex.opis && (
                          <p style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                            {ex.opis}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}


              {/* Obrazac za narudžbu */}
              <div className="section mb-5">
                <h2>Rezerviraj ponudu</h2>
                <form onSubmit={handleSubmit} className="contact-inputs order-form" style={{maxWidth: 600, margin: '0 auto'}}>
                  <div className="form-group">
                    <label htmlFor="name">Ime i prezime *</label>
                    <input
                      type="text"
                      className="inputform"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Vaše ime i prezime"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      className="inputform"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      required
                      placeholder="Vaš email"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="numPersons">Broj putnika *</label>
                    <input
                      type="number"
                      className="inputform"
                      id="numPersons"
                      name="numPersons"
                      min="1"
                      value={numPersons}
                      onChange={handleNumPersons}
                      required
                      placeholder="Unesite broj putnika"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Poruka</label>
                    <textarea
                      className="inputform"
                      id="message"
                      name="message"
                      rows="3"
                      value={form.message}
                      onChange={handleInputChange}
                      placeholder="Dodatne napomene ili pitanja"
                    />
                  </div>

                  <div className="offer-summary-card">
                    <h4>Detalji ponude</h4>
                    <ul className="offer-summary-list">
                      <li>
                        <span>Osnovna cijena putovanja</span>
                        <strong>€{basePrice.toLocaleString()}</strong>
                      </li>

                      {selectedExcursionItems.length > 0 ? (
                        selectedExcursionItems.map((item) => (
                          <li key={item.id}>
                            <span>{item.naziv || "Fakultativni izlet"}</span>
                            <strong>+ €{Number(item.cijena || 0).toLocaleString()}</strong>
                          </li>
                        ))
                      ) : (
                        <li>
                          <span>Nema odabranih fakultativnih izleta</span>
                          <strong>€0</strong>
                        </li>
                      )}
                    </ul>

                    <div className="offer-summary-total">
                      <span>Ukupna cijena po putniku</span>
                      <strong>€{(basePrice + selectedExcursionsTotal).toLocaleString()}</strong>
                    </div>
                    <div className="offer-summary-total">
                      <span>Broj putnika</span>
                      <strong>x {numPersons}</strong>
                    </div>
                    <div className="offer-summary-total grand-total">
                      <span>Ukupna cijena</span>
                      <strong>€{totalPrice.toLocaleString()}</strong>
                    </div>
                  </div>

                  <div className="form-group" style={{marginTop: 8}}>
                    <strong>Ukupna cijena: <span style={{color: '#ff6b6b'}}>{totalPrice} €</span></strong>
                  </div>
                  <div className="form-group" style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                    <input
                      className="checkbox-input-1"
                      type="checkbox"
                      id="terms"
                      checked={termsAccepted}
                      onChange={handleTerms}
                      required
                      style={{marginTop: 0}}
                    />
                    <label htmlFor="terms" className="offer-terms-label">
                      Prihvaćam {" "}
                      <Link
                        to="/opci-uvjeti"
                        onClick={(event) => event.stopPropagation()}
                        className="offer-terms-link"
                      >
                        uvjete korištenja
                      </Link>{" "}
                      i {" "}
                      <Link
                        to="/zastita-podataka"
                        onClick={(event) => event.stopPropagation()}
                        className="offer-terms-link"
                      >
                        politiku privatnosti
                      </Link>{" "}
                      *
                    </label>
                  </div>
                  {error && <div className="alert alert-danger" style={{marginTop: 8}}>{error}</div>}
                  {sent && <div className="success-message" style={{marginTop: 8}}>Ponuda je uspješno poslana!</div>}
                  <button
                    type="submit"
                    className="offer-submit-btn"
                    disabled={sending || !termsAccepted}
                  >
                    {sending ? "Šaljem..." : "Pošalji ponudu"}
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default PutovanjeBlogSingle;