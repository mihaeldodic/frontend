import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faArrowRight,
  faEarthEurope,
  faEarthAsia,
  faEarthAfrica,
  faEarthAmericas,
  faEarthOceania,
} from "@fortawesome/free-solid-svg-icons";
import "./putovanje.css";

const BASE_URL = process.env.REACT_APP_API_URL;
const CONTINENT_PAGE_IDS = {
  afrika: 198,
  azija: 193,
  europa: 196,
  "juzna-amerika": 2729,
  "južna-amerika": 2729,
  "sjeverna-amerika": 2731,
  "sjeverna-amerika": 2731,
  australija: 2733,
};

const kontinenti = [
  {
    slug: "europa",
    naziv: "Europa",
    opis: "Povijesni gradovi, slikoviti pejzaži i bogata kultura na dohvat ruke.",
    boja: "#0e7490",
    icon: faEarthEurope,
    img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80",
  },
  {
    slug: "azija",
    naziv: "Azija",
    opis: "Drevne tradicije, egzotična kuhinja i zadivljujuća priroda.",
    boja: "#ff6b6b",
    icon: faEarthAsia,
    img: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=600&q=80",
  },
  {
    slug: "afrika",
    naziv: "Afrika",
    opis: "Nevjerojatna divljina, safari avanture i kulture koje ostavljaju bez daha.",
    boja: "#f59e0b",
    icon: faEarthAfrica,
    img: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=600&q=80",
  },
  {
    slug: "sjeverna-amerika",
    naziv: "Sjeverna Amerika",
    opis: "Nacionalni parkovi, metropole i spektakularni road tripovi.",
    boja: "#10b981",
    icon: faEarthAmericas,
    img: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&q=80",
  },
  {
    slug: "juzna-amerika",
    naziv: "Juzna Amerika",
    opis: "Ande, Amazona i ritmovi Latinske Amerike u jedinstvenim turama.",
    boja: "#f97316",
    icon: faEarthAmericas,
    img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80",
  },
  {
    slug: "australija",
    naziv: "Australija",
    opis: "Kristalno more, koraljni grebeni i netaknuta priroda na rubovima svijeta.",
    boja: "#8b5cf6",
    icon: faEarthOceania,
    img: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600&q=80",
  },
];

const Putovanje = () => {
  const navigate = useNavigate();
  const [odabraniKontinent, setOdabraniKontinent] = useState("sva-putovanja");
  const [continentHeroImages, setContinentHeroImages] = useState({});

  useEffect(() => {
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

    const fetchContinentImages = async () => {
      try {
        const continentEntries = Object.entries(CONTINENT_PAGE_IDS);

        const results = await Promise.all(
          continentEntries.map(async ([slug, pageId]) => {
            const pageResponse = await fetch(`${BASE_URL}v2/pages/${pageId}`);
            if (!pageResponse.ok) return [slug, ""];

            const page = await pageResponse.json();
            const heroImage = await resolveHeroImage(
              page?.acf?.hero_image || page?.acf?.hero_slika
            );

            return [slug, heroImage || ""];
          })
        );

        const imageMap = results.reduce((acc, [slug, image]) => {
          if (image) acc[slug] = image;
          return acc;
        }, {});

        setContinentHeroImages(imageMap);
      } catch {
        setContinentHeroImages({});
      }
    };

    fetchContinentImages();
  }, []);

  const handleIstraziKontinent = () => {
    if (odabraniKontinent === "sva-putovanja") {
      navigate("/putovanje/sva-putovanja");
      return;
    }

    navigate(`/putovanje/kontinent/${odabraniKontinent}`);
  };

  const kontinentiZaPrikaz = kontinenti.map((k) => {
    const dynamicImage = continentHeroImages[k.slug];
    if (dynamicImage) {
      return { ...k, img: dynamicImage };
    }
    return k;
  });

  return (
    <div className="putovanje-stranica">
      {/* Hero */}
      <section className="putovanje-hero">
        <div className="putovanje-hero-overlay">
          <div className="container">
            <div className="putovanje-hero-content">
              <h1 className="putovanje-hero-title">Istražite svijet s nama</h1>
              <p className="putovanje-hero-subtitle">
                Odaberite kontinent i pronađite savršeno putovanje koje ste oduvijek
                sanjali. Svako putovanje je priča, vaša počinje ovdje.
              </p>
              <a href="#kontinenti" className="putovanje-btn-scroll">
                <FontAwesomeIcon icon={faMapMarkerAlt} /> Pogledaj destinacije
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Kontinenti grid */}
      <section className="putovanje-kontinenti" id="kontinenti">
        <div className="container">
          <div className="putovanje-dropdown-wrap">
            <label htmlFor="kontinent-select" className="putovanje-dropdown-label">
              Odaberi kontinent
            </label>
            <div className="putovanje-dropdown-row">
              <select
                id="kontinent-select"
                className="putovanje-dropdown"
                value={odabraniKontinent}
                onChange={(e) => setOdabraniKontinent(e.target.value)}
              >
                <option value="sva-putovanja">Svi kontinenti</option>
                {kontinentiZaPrikaz.map((k) => (
                  <option key={k.slug} value={k.slug}>
                    {k.naziv}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="putovanje-istrazi-btn"
                onClick={handleIstraziKontinent}
              >
                Istrazi
              </button>
            </div>
          </div>

          <div className="naslovna-section-header">
            <span className="naslovna-section-tag">Destinacije</span>
            <h2 className="naslovna-section-title">Putujte po kontinentima</h2>
            <p className="naslovna-section-sub">
              Svaki kontinent nudi jedinstvena iskustva. Odaberite vaš sljedeći
              korak.
            </p>
          </div>

          <div className="row g-4">
            {kontinentiZaPrikaz.map((k) => (
              <div key={k.slug} className="col-md-6 col-lg-4">
                <Link
                  to={`/putovanje/kontinent/${k.slug}`}
                  className="kontinent-card"
                >
                  <div className="kontinent-card-img-wrap">
                    <img src={k.img} alt={k.naziv} className="kontinent-card-img" />
                    <div className="kontinent-card-overlay" />
                    <span className="kontinent-card-icon-wrap">
                      <FontAwesomeIcon icon={k.icon} />
                    </span>
                  </div>
                  <div className="kontinent-card-body">
                    <h3 className="kontinent-card-naziv">{k.naziv}</h3>
                    <p className="kontinent-card-opis">{k.opis}</p>
                    <span className="kontinent-card-link">
                      Istraži putovanja{" "}
                      <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Putovanje;
