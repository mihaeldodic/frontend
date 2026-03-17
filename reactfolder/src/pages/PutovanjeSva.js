import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCalendarDays,
  faClock,
  faPlaneDeparture,
} from "@fortawesome/free-solid-svg-icons";
import Loader from "../components/Loader";
import { getTransportIconByMethod } from "../utils/transportIcons";
import { buildTravelDetailsPath } from "../utils/travelRoutes";
import "./putovanje.css";

const BASE_URL = process.env.REACT_APP_API_URL;
const continents = [
  "Svi kontinenti",
  "Afrika",
  "Azija",
  "Australija",
  "Europa",
  "Južna amerika",
  "Sjeverna amerika",
];

const months = [
  "Svi mjeseci",
  "Siječanj",
  "Veljača",
  "Ožujak",
  "Travanj",
  "Svibanj",
  "Lipanj",
  "Srpanj",
  "Kolovoz",
  "Rujan",
  "Listopad",
  "Studeni",
  "Prosinac",
];

const normalizeSearchValue = (value) =>
  (value || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const normalizeDateValue = (value) => {
  if (!value) return "";

  const rawValue = String(value).trim();
  const compactMatch = rawValue.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (compactMatch) {
    return `${compactMatch[1]}-${compactMatch[2]}-${compactMatch[3]}`;
  }

  const isoMatch = rawValue.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  }

  const dottedMatch = rawValue.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/);
  if (dottedMatch) {
    return `${dottedMatch[3]}-${dottedMatch[2].padStart(2, "0")}-${dottedMatch[1].padStart(2, "0")}`;
  }

  return "";
};

const formatTravelDate = (value) => {
  const normalizedDate = normalizeDateValue(value);
  if (!normalizedDate) return "";

  const match = normalizedDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return String(value || "").trim();

  return `${match[3]}.${match[2]}.${match[1]}.`;
};

const isTravelWithinSelectedRange = (
  selectedDateFrom,
  selectedDateTo,
  departureDate,
  returnDate
) => {
  const normalizedSelectedDateFrom = normalizeDateValue(selectedDateFrom);
  const normalizedSelectedDateTo = normalizeDateValue(selectedDateTo);
  const normalizedDepartureDate = normalizeDateValue(departureDate);
  const normalizedReturnDate = normalizeDateValue(returnDate);

  if (!normalizedSelectedDateFrom && !normalizedSelectedDateTo) return true;
  if (!normalizedDepartureDate && !normalizedReturnDate) return false;

  const travelStart = normalizedDepartureDate || normalizedReturnDate;
  const travelEnd = normalizedReturnDate || normalizedDepartureDate;

  if (normalizedSelectedDateFrom && normalizedSelectedDateTo) {
    return travelStart >= normalizedSelectedDateFrom && travelEnd <= normalizedSelectedDateTo;
  }

  if (normalizedSelectedDateFrom) {
    return travelStart >= normalizedSelectedDateFrom;
  }

  if (normalizedSelectedDateTo) {
    return travelEnd <= normalizedSelectedDateTo;
  }

  return true;
};

const resolvePostImage = async (post) => {
  const embeddedImage = post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  if (embeddedImage) return embeddedImage;

  const acf = post?.acf || {};
  const imageField = acf.image || acf.hero_image || acf.hero_slika;

  if (!imageField) return "";

  if (typeof imageField === "string") return imageField;

  if (typeof imageField === "number") {
    try {
      const response = await fetch(`${BASE_URL}v2/media/${imageField}`);
      if (!response.ok) return "";
      const media = await response.json();
      return media.source_url || "";
    } catch {
      return "";
    }
  }

  if (typeof imageField === "object") {
    return (
      imageField.source_url ||
      imageField.url ||
      imageField.sizes?.full?.url ||
      imageField.sizes?.large?.url ||
      ""
    );
  }

  return "";
};

const PutovanjeSva = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContinent, setSelectedContinent] = useState("Svi kontinenti");
  const [selectedMonth, setSelectedMonth] = useState("Svi mjeseci");
  const [selectedDateFrom, setSelectedDateFrom] = useState("");
  const [selectedDateTo, setSelectedDateTo] = useState("");
  const [selectedTransportMethod, setSelectedTransportMethod] = useState("Svi načini putovanja");
  const [priceRange, setPriceRange] = useState([0, 10000]);

  useEffect(() => {
    const fetchPutovanja = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BASE_URL}v2/nova-destinacija?_embed&per_page=100`);
        const data = await response.json();
        const normalizedPosts = Array.isArray(data) ? data : [];

        const postsWithImages = await Promise.all(
          normalizedPosts.map(async (post) => {
            const resolvedImage = await resolvePostImage(post);
            return {
              ...post,
              _resolvedImage: resolvedImage,
              _travelMeta: {
                departureDate:
                  post?.acf?.date ||
                  post?.acf?.datum_polaska ||
                  post?.acf?.polazak ||
                  "",
                returnDate:
                  post?.acf?.date_2 ||
                  post?.acf?.["date-2"] ||
                  post?.acf?.datum_povratka ||
                  post?.acf?.povratak ||
                  "",
                transportMethod:
                  post?.acf?.nacin_putovanja ||
                  post?.acf?.["nacin-putovanja"] ||
                  post?.acf?.prijevozno_sredstvo ||
                  "",
              },
            };
          })
        );

        setPosts(postsWithImages);
      } catch (error) {
        console.error("Greska pri dohvacanju svih putovanja:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPutovanja();
  }, []);

  const ukupnoPutovanja = useMemo(() => posts.length, [posts]);
  const transportMethods = useMemo(
    () => [
      "Svi načini putovanja",
      ...Array.from(
        new Set(
          posts
            .map((post) => post?._travelMeta?.transportMethod)
            .filter(Boolean)
        )
      ),
    ],
    [posts]
  );

  const filtriranaPutovanja = useMemo(() => {
    let filtered = [...posts];

    if (searchTerm.trim()) {
      const normalizedTerm = normalizeSearchValue(searchTerm);
      filtered = filtered.filter((post) => {
        const title = normalizeSearchValue(post.title?.rendered || "");
        return title.startsWith(normalizedTerm);
      });
    }

    if (selectedContinent !== "Svi kontinenti") {
      filtered = filtered.filter((post) => {
        const continent = (post?.acf?.continent || "").toLowerCase().trim();
        return continent === selectedContinent.toLowerCase().trim();
      });
    }

    if (selectedMonth !== "Svi mjeseci") {
      filtered = filtered.filter((post) => {
        const month = (post?.acf?.month || "").toLowerCase().trim();
        return month === selectedMonth.toLowerCase().trim();
      });
    }

    if (selectedDateFrom || selectedDateTo) {
      filtered = filtered.filter((post) =>
        isTravelWithinSelectedRange(
          selectedDateFrom,
          selectedDateTo,
          post?._travelMeta?.departureDate,
          post?._travelMeta?.returnDate
        )
      );
    }

    if (selectedTransportMethod !== "Svi načini putovanja") {
      filtered = filtered.filter(
        (post) =>
          normalizeSearchValue(post?._travelMeta?.transportMethod) ===
          normalizeSearchValue(selectedTransportMethod)
      );
    }

    filtered = filtered.filter((post) => {
      const price = Number(post?.acf?.price || 0);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    return filtered;
  }, [
    posts,
    priceRange,
    searchTerm,
    selectedContinent,
    selectedDateFrom,
    selectedDateTo,
    selectedMonth,
    selectedTransportMethod,
  ]);

  const handlePriceChange = (event) => {
    setPriceRange([priceRange[0], parseInt(event.target.value, 10)]);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedContinent("Svi kontinenti");
    setSelectedMonth("Svi mjeseci");
    setSelectedDateFrom("");
    setSelectedDateTo("");
    setSelectedTransportMethod("Svi načini putovanja");
    setPriceRange([0, 10000]);
  };

  const handleDateInputClick = (event) => {
    const input = event.currentTarget;
    if (typeof input.showPicker === "function") {
      input.showPicker();
    }
  };

  return (
    <div className="putovanje-kontinent-stranica">
      {loading && <Loader />}

      <section className="putovanje-all-hero">
        <div className="container">
          <Link to="/putovanje" className="putovanje-back-link">
            <FontAwesomeIcon icon={faArrowLeft} /> Natrag na kontinente
          </Link>
          <div className="putovanje-all-hero-content">
            <span className="putovanje-all-tag">Ponuda putovanja</span>
            <h1>Sva putovanja u ponudi</h1>
            <p>
              Pregledajte kompletnu ponudu naših putovanja i pronađite destinaciju
              koja najbolje odgovara vašem sljedećem putovanju.
            </p>
            <div className="putovanje-all-count">
              <FontAwesomeIcon icon={faPlaneDeparture} />
              <span>{ukupnoPutovanja} dostupnih putovanja</span>
            </div>
          </div>
        </div>
      </section>

      <section className="putovanje-kontinent-lista">
        <div className="container">
          <div className="putovanje-search-panel">
            <div className="putovanje-search-bar">
              <input
                type="text"
                placeholder="Pretraži po nazivu ili opisu..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="putovanje-search-input"
              />
            </div>

            <div className="putovanje-search-filters">
              <div className="putovanje-filter-group putovanje-filter-group--continent">
                <label>Kontinent</label>
                <select
                  value={selectedContinent}
                  onChange={(event) => setSelectedContinent(event.target.value)}
                  className="putovanje-filter-select"
                >
                  {continents.map((continent) => (
                    <option key={continent} value={continent}>
                      {continent}
                    </option>
                  ))}
                </select>
              </div>

              <div className="putovanje-filter-group putovanje-filter-group--month">
                <label>Mjesec</label>
                <select
                  value={selectedMonth}
                  onChange={(event) => setSelectedMonth(event.target.value)}
                  className="putovanje-filter-select"
                >
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>

              <div className="putovanje-filter-group putovanje-filter-group--price">
                <label>Maksimalna cijena: €{priceRange[1]}</label>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={priceRange[1]}
                  onChange={handlePriceChange}
                  className="putovanje-filter-range"
                />
              </div>

              <div className="putovanje-filter-group putovanje-filter-group--transport">
                <label>Način putovanja</label>
                <select
                  value={selectedTransportMethod}
                  onChange={(event) => setSelectedTransportMethod(event.target.value)}
                  className="putovanje-filter-select"
                >
                  {transportMethods.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>

              <div className="putovanje-filter-group putovanje-filter-group--date-from">
                <label>Datum od</label>
                <input
                  type="date"
                  value={selectedDateFrom}
                  onChange={(event) => setSelectedDateFrom(event.target.value)}
                  onClick={handleDateInputClick}
                  className="putovanje-filter-select"
                />
              </div>

              <div className="putovanje-filter-group putovanje-filter-group--date-to">
                <label>Datum do</label>
                <input
                  type="date"
                  value={selectedDateTo}
                  onChange={(event) => setSelectedDateTo(event.target.value)}
                  onClick={handleDateInputClick}
                  className="putovanje-filter-select"
                />
              </div>
            </div>

            <div className="putovanje-search-actions">
              <button
                type="button"
                className="putovanje-reset-btn"
                onClick={handleResetFilters}
              >
                Resetiraj filtere
              </button>
            </div>
          </div>

          {!loading && filtriranaPutovanja.length === 0 && (
            <div className="putovanje-empty-state">
              Nema rezultata koji odgovaraju odabranim filterima.
            </div>
          )}

          <div className="row g-4">
            {filtriranaPutovanja.map((post) => {
              const image = post._resolvedImage;
              const acf = post.acf || {};
              const departureDate = formatTravelDate(
                acf.date || acf.datum_polaska || acf.polazak || ""
              );
              const returnDate = formatTravelDate(
                acf.date_2 || acf["date-2"] || acf.datum_povratka || acf.povratak || ""
              );
              const transportMethod =
                post?._travelMeta?.transportMethod ||
                acf.nacin_putovanja ||
                acf["nacin-putovanja"] ||
                acf.prijevozno_sredstvo ||
                "";
              const travelDetailsPath = buildTravelDetailsPath(acf.continent, post.slug);

              return (
                <div key={post.id} className="col-md-6 col-lg-4">
                  <Link to={travelDetailsPath} className="put-card">
                    <div className="put-card-img-wrap">
                      {image ? (
                        <img
                          src={image}
                          alt={post.title?.rendered || "Putovanje"}
                          className="put-card-img"
                        />
                      ) : (
                        <div className="put-card-noimg">Nema slike</div>
                      )}
                      {acf.continent && (
                        <span className="put-card-tag">{acf.continent}</span>
                      )}
                      <span className="put-card-icon-wrap">
                        <FontAwesomeIcon icon={getTransportIconByMethod(transportMethod)} />
                      </span>
                    </div>

                    <div className="put-card-body">
                      <h3 className="put-card-title">{post.title?.rendered}</h3>

                      <div className="put-card-meta">
                        <span>
                          <FontAwesomeIcon icon={faCalendarDays} /> {acf.month || "Termin uskoro"}
                        </span>
                        <span>
                          <FontAwesomeIcon icon={faClock} /> {acf.travel_duration || "Trajanje"}
                        </span>
                      </div>

                      {(departureDate || returnDate) && (
                        <div className="put-card-dates">
                          {departureDate || "-"}
                          {departureDate && returnDate ? " - " : ""}
                          {returnDate || ""}
                        </div>
                      )}

                      <div className="put-card-bottom">
                        <span className="put-card-price">
                          €{Number(acf.price || 0).toLocaleString("hr-HR")}
                        </span>
                        <span className="put-card-link">Detalji</span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PutovanjeSva;