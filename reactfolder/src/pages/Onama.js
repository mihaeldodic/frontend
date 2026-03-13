import { useState, useEffect } from "react";
import "./onama.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faUsers,
  faGlobe,
  faLightbulb,
  faStar,
  faHeart,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";

const BASE_URL = process.env.REACT_APP_API_URL;

const Onama = () => {
  const [content, setContent] = useState(null);
  const [heroImage, setHeroImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const iconMap = {
    "fa-globe": faGlobe,
    "fa-users": faUsers,
    "fa-lightbulb": faLightbulb,
    "fa-check": faCheck,
    "fa-star": faStar,
    "fa-heart": faHeart,
    "fa-shield-alt": faShieldAlt,
  };

  const resolveHeroImage = async (heroField) => {
    if (!heroField) return "";

    if (typeof heroField === "string") return heroField;

    if (typeof heroField === "number") {
      try {
        const response = await fetch(`${BASE_URL}v2/media/${heroField}`);
        if (!response.ok) return "";
        const media = await response.json();
        return media.source_url || "";
      } catch {
        return "";
      }
    }

    if (typeof heroField === "object") {
      return (
        heroField.source_url ||
        heroField.url ||
        heroField.sizes?.full?.url ||
        heroField.sizes?.large?.url ||
        ""
      );
    }

    return "";
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    
    fetch(`${BASE_URL}v2/pages/202`)
      .then((response) => response.json())
      .then(async (data) => {
        console.log("Puni podaci:", data);
        console.log("ACF podaci:", data.acf);
        const heroImageUrl = await resolveHeroImage(data?.acf?.hero_image);
        setContent(data);
        setHeroImage(heroImageUrl);
        setLoading(false);
        window.scrollTo(0, 0);
      })
      .catch((err) => {
        console.error("Greška:", err);
        setError(err.message);
        setHeroImage("");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="onama-container">
        <div className="loading">Učitavanje...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="onama-container">
        <div className="error">Greška pri učitavanju sadržaja: {error}</div>
      </div>
    );
  }

  const acf = content?.acf || {};
  const misija = acf.misija || "";
  const vizija = acf.vizija || "";
  const vrijednosti = Array.isArray(acf.vrijednosti) ? acf.vrijednosti : [];

  const heroStyle = heroImage
    ? {
        backgroundImage: `linear-gradient(135deg, rgba(14, 116, 144, 0.72) 0%, rgba(10, 85, 106, 0.72) 100%), url(${heroImage})`,
      }
    : undefined;

  const defaultVrijednosti = [
    { naslov: "Globalnost", opis: "Istraživanje svih kontinenata i kultura", ikona: "fa-globe" },
    { naslov: "Zajednica", opis: "Povezivanje putnika i stvaranje uspomena", ikona: "fa-users" },
    { naslov: "Inovacija", opis: "Nove rute i jedinstvena iskustva", ikona: "fa-lightbulb" },
    { naslov: "Pouzdanost", opis: "Kvaliteta i sigurnost na prvom mjestu", ikona: "fa-check" },
  ];

  const displayVrijednosti = vrijednosti && vrijednosti.length > 0 ? vrijednosti : defaultVrijednosti;

  return (
    <div className="onama">
      {/* Hero sekcija */}
      <section className="onama-hero" style={heroStyle}>
        <div className="onama-hero-overlay">
          <div className="container">
            <h1 className="onama-hero-title">{content?.title?.rendered || "O Nama"}</h1>
            <p className="onama-hero-subtitle">
              Upoznajte priču iza Explorers Way
            </p>
          </div>
        </div>
      </section>

      {/* Sadržaj iz WordPress-a */}
      <section className="onama-content">
        <div className="container">
          <div className="onama-text">
            {content && content.content.rendered && (
              <div
                dangerouslySetInnerHTML={{ __html: content.content.rendered }}
              />
            )}
          </div>
        </div>
      </section>

      {/* O nama detaljno */}
      <section className="onama-details">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <h2 className="onama-section-title">Naša Misija</h2>
              <p className="onama-text-paragraph">
                {misija && misija.trim() !== "" ? misija : "Naša misija je povezati putnike sa autentičnim doživljajima i skrivenim blagajnama svijeta. Vjerujemo da je svaki put transformativna avantura koja oblikuje našu perspektivu i proširuje naše horizonte."}
              </p>
              <ul className="onama-features">
                <li>
                  <FontAwesomeIcon icon={faCheck} className="onama-icon" />
                  <span>Autentična iskustva</span>
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheck} className="onama-icon" />
                  <span>Personalizirani itinerari</span>
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheck} className="onama-icon" />
                  <span>Lokalni vodiči</span>
                </li>
              </ul>
            </div>

            <div className="col-lg-6">
              <h2 className="onama-section-title">Naša Vizija</h2>
              <p className="onama-text-paragraph">
                {vizija && vizija.trim() !== "" ? vizija : "Vizija nam je postati vodeća putna agencija koja inspira ljude da istraže svijet sa curiozitetom, poštovanjem i otvorenim umom. Želimo da svaki put bude bezbedan, udoban i nezaboravan."}
              </p>
              <ul className="onama-features">
                <li>
                  <FontAwesomeIcon icon={faCheck} className="onama-icon" />
                  <span>Sigurnost i udobnost</span>
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheck} className="onama-icon" />
                  <span>Dostupnost za sve</span>
                </li>
                <li>
                  <FontAwesomeIcon icon={faCheck} className="onama-icon" />
                  <span>Održivost</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Vrijednosti */}
      <section className="onama-values">
        <div className="container">
          <h2 className="onama-section-title text-center">Naše Vrijednosti</h2>

          <div className="row">
            {displayVrijednosti.map((value, index) => (
              <div key={index} className="col-md-3 col-sm-6 mb-4">
                <div className="value-card">
                  <FontAwesomeIcon
                    icon={iconMap[value.ikona] || faGlobe}
                    className="value-icon"
                  />
                  <h3>{value.naslov}</h3>
                  <p>{value.opis}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Onama;