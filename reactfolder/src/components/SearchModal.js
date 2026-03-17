import { useState, useEffect, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch, faCalendarAlt, faClock } from "@fortawesome/free-solid-svg-icons";
import { getTransportIconByMethod } from "../utils/transportIcons";
import { buildTravelDetailsPath } from "../utils/travelRoutes";
import "./search-modal.css";

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

  if (normalizedDepartureDate && normalizedReturnDate) {
    return true;
  }

  return true;
};

const SearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [travels, setTravels] = useState([]);
  const [filteredTravels, setFilteredTravels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContinent, setSelectedContinent] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDateFrom, setSelectedDateFrom] = useState("");
  const [selectedDateTo, setSelectedDateTo] = useState("");
  const [selectedTransportMethod, setSelectedTransportMethod] = useState("Svi načini putovanja");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [loading, setLoading] = useState(false);

  const continents = [
    "Svi kontinenti",
    "Afrika",
    "Azija",
    "Australija",
    "Europa",
    "Južna amerika",
    "Sjeverna amerika"
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
    "Prosinac"
  ];

  const transportMethods = [
    "Svi načini putovanja",
    ...Array.from(
      new Set(
        travels
          .map((travel) => travel.transportMethod)
          .filter(Boolean)
      )
    ),
  ];

  // Dohvati putovanja iz WordPressă
  useEffect(() => {
    if (isOpen) {
      fetchTravels();
    }
  }, [isOpen]);

  const fetchTravels = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "https://front2.edukacija.online/backend/wp-json/wp/";
      
      const response = await fetch(
        `${apiUrl}v2/nova-destinacija?per_page=100`
      );
      
      if (!response.ok) {
        throw new Error("Greška pri dohvaćanju putovanja");
      }
      
      const posts = await response.json();
      console.log("API odgovor:", posts);

      const resolveImage = async (field) => {
        if (!field) return "";
        if (typeof field === "object") {
          return field.source_url || field.url || "";
        }
        if (typeof field === "string" && field.startsWith("http")) return field;
        const numId = parseInt(field);
        if (!numId) return "";
        try {
          const res = await fetch(`${apiUrl}v2/media/${numId}`);
          if (!res.ok) return "";
          const data = await res.json();
          return data.source_url || "";
        } catch { return ""; }
      };

      const travelsData = await Promise.all(posts.map(async (post) => {
        const acf = post.acf || {};

        const imageUrl =
          (await resolveImage(acf.image)) ||
          (await resolveImage(acf.hero_image)) ||
          (await resolveImage(acf.hero_slika)) ||
          "";

        return {
          id: post.id,
          title: post.title.rendered || post.title,
          continent: acf.continent ? acf.continent.trim() : "Nepoznato",
          price: parseInt(acf.price) || 0,
          month: acf.month ? acf.month.trim() : "Nepoznato",
          duration: acf.travel_duration ? acf.travel_duration.trim() : "Nepoznato",
          departureDate: acf.date || acf.datum_polaska || acf.polazak || "",
          returnDate: acf.date_2 || acf["date-2"] || acf.datum_povratka || acf.povratak || "",
          transportMethod: acf.nacin_putovanja || acf["nacin-putovanja"] || acf.prijevozno_sredstvo || "",
          image: imageUrl,
          description: acf.description || "",
          slug: post.slug
        };
      }));

      console.log("Obrađena putovanja:", travelsData);
      setTravels(travelsData);
      setFilteredTravels(travelsData);
    } catch (error) {
      console.error("Greška pri dohvaćanju putovanja:", error);
      const defaultTravels = getDefaultTravels();
      setTravels(defaultTravels);
      setFilteredTravels(defaultTravels);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultTravels = () => [
    {
      id: 1,
      title: "Safari u Keniji",
      continent: "Afrika",
      price: 2500,
      month: "Srpanj",
      duration: "7 dana",
      image: "https://via.placeholder.com/300x200?text=Kenya+Safari",
      description: "Nevjerojatan safari kroz nacionalne parkove",
      slug: "safari-u-keniji"
    },
    {
      id: 2,
      title: "Bali - Raj na zemlji",
      continent: "Azija",
      price: 1800,
      month: "Ožujak",
      duration: "10 dana",
      image: "https://via.placeholder.com/300x200?text=Bali",
      description: "Uživaj u rajskom otoku Baliju",
      slug: "bali-raj-na-zemlji"
    }
  ];

  // Filtriraj putovanja
  useEffect(() => {
    if (!travels || travels.length === 0) return;

    let filtered = [...travels];

    // Pretraga po početku naziva
    if (searchTerm && searchTerm.trim() !== "") {
      const normalizedSearchTerm = normalizeSearchValue(searchTerm);
      filtered = filtered.filter(travel =>
        normalizeSearchValue(travel.title).startsWith(normalizedSearchTerm)
      );
    }

    // Filtriraj po kontinentu
    if (selectedContinent && selectedContinent !== "Svi kontinenti") {
      console.log("Filtriram po kontinentu:", selectedContinent);
      filtered = filtered.filter(travel => {
        console.log("Uspoređujem:", travel.continent, "sa", selectedContinent);
        return travel.continent.toLowerCase().trim() === selectedContinent.toLowerCase().trim();
      });
    }

    // Filtriraj po mjesecu
    if (selectedMonth && selectedMonth !== "Svi mjeseci") {
      filtered = filtered.filter(travel => 
        travel.month.toLowerCase().trim() === selectedMonth.toLowerCase().trim()
      );
    }

    if (selectedDateFrom || selectedDateTo) {
      filtered = filtered.filter((travel) =>
        isTravelWithinSelectedRange(
          selectedDateFrom,
          selectedDateTo,
          travel.departureDate,
          travel.returnDate
        )
      );
    }

    if (
      selectedTransportMethod &&
      selectedTransportMethod !== "Svi načini putovanja"
    ) {
      filtered = filtered.filter(
        (travel) =>
          normalizeSearchValue(travel.transportMethod) ===
          normalizeSearchValue(selectedTransportMethod)
      );
    }

    // Filtriraj po cijeni
    filtered = filtered.filter(
      travel => travel.price >= priceRange[0] && travel.price <= priceRange[1]
    );

    console.log("Filtrirano:", filtered);
    setFilteredTravels(filtered);
  }, [
    priceRange,
    searchTerm,
    selectedContinent,
    selectedDateFrom,
    selectedDateTo,
    selectedMonth,
    selectedTransportMethod,
    travels,
  ]);

  const handlePriceChange = (e) => {
    setPriceRange([priceRange[0], parseInt(e.target.value)]);
  };

  const mobileInstantResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const normalizedTerm = normalizeSearchValue(searchTerm);
    return travels
      .filter((travel) => normalizeSearchValue(travel.title).startsWith(normalizedTerm))
      .slice(0, 5);
  }, [searchTerm, travels]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedContinent("");
    setSelectedMonth("");
    setSelectedDateFrom("");
    setSelectedDateTo("");
    setSelectedTransportMethod("Svi načini putovanja");
    setPriceRange([0, 10000]);
  };

  const handleTravelClick = (travel) => {
    navigate(buildTravelDetailsPath(travel.continent, travel.slug));
    onClose();
  };

  const handleDateInputClick = (event) => {
    const input = event.currentTarget;
    if (typeof input.showPicker === "function") {
      input.showPicker();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal-content" onClick={e => e.stopPropagation()}>
        <div className="search-modal-scroll">
        {/* Header */}
        <div className="search-modal-header">
          <h2>Pretraži putovanja</h2>
          <button className="search-modal-close" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-modal-search-bar">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Pretraži po nazivu ili opisu..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {!!searchTerm.trim() && (
          <div className="search-mobile-suggestions" role="listbox" aria-label="Brzi rezultati pretrage">
            {mobileInstantResults.length > 0 ? (
              mobileInstantResults.map((travel) => (
                <div
                  key={travel.id}
                  className="travel-card search-mobile-suggestion-card"
                  onClick={() => handleTravelClick(travel)}
                  style={{ cursor: "pointer" }}
                >
                  {travel.image && (
                    <div className="travel-card-image">
                      <img src={travel.image} alt={travel.title} loading="lazy" />
                      {travel.continent && travel.continent !== "Nepoznato" && (
                        <span className="travel-card-tag">{travel.continent}</span>
                      )}
                      <span className="travel-card-icon-wrap">
                        <FontAwesomeIcon icon={getTransportIconByMethod(travel.transportMethod)} />
                      </span>
                    </div>
                  )}
                  <div className="travel-card-content">
                    <h3>{travel.title}</h3>
                    <div className="travel-info">
                      <div className="travel-left-info">
                        <p className="travel-month">
                          <FontAwesomeIcon icon={faCalendarAlt} /> {travel.month}
                        </p>
                      </div>
                      <p className="travel-duration">
                        <FontAwesomeIcon icon={faClock} /> {travel.duration}
                      </p>
                    </div>
                    {(travel.departureDate || travel.returnDate) && (
                      <p className="travel-date-range">
                        {formatTravelDate(travel.departureDate) || "-"}
                        {travel.departureDate && travel.returnDate ? " - " : ""}
                        {formatTravelDate(travel.returnDate) || ""}
                      </p>
                    )}
                    <p className="travel-price">€{travel.price.toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="search-mobile-suggestion-empty">
                Nema rezultata za ovaj upit.
              </div>
            )}
          </div>
        )}

        {/* Filtri */}
        <div className="search-modal-filters">
          {/* Kontinent */}
          <div className="filter-group filter-group--continent">
            <label>Kontinent</label>
            <select
              value={selectedContinent}
              onChange={e => setSelectedContinent(e.target.value)}
              className="filter-select"
            >
              {continents.map(continent => (
                <option key={continent} value={continent}>
                  {continent}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group filter-group--transport">
            <label>Način putovanja</label>
            <select
              value={selectedTransportMethod}
              onChange={e => setSelectedTransportMethod(e.target.value)}
              className="filter-select"
            >
              {transportMethods.map(method => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>

          {/* Cijena */}
          <div className="filter-group filter-group--price">
            <label>Maksimalna cijena: €{priceRange[1]}</label>
            <input
              type="range"
              min="0"
              max="10000"
              value={priceRange[1]}
              onChange={handlePriceChange}
              className="filter-range"
            />
          </div>

          {/* Mjesec */}
          <div className="filter-group filter-group--month">
            <label>Mjesec</label>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              className="filter-select"
            >
              {months.map(month => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group filter-group--date-from">
            <label>Datum od</label>
            <input
              type="date"
              value={selectedDateFrom}
              onChange={e => setSelectedDateFrom(e.target.value)}
              onClick={handleDateInputClick}
              className="filter-select"
            />
          </div>

          <div className="filter-group filter-group--date-to">
            <label>Datum do</label>
            <input
              type="date"
              value={selectedDateTo}
              onChange={e => setSelectedDateTo(e.target.value)}
              onClick={handleDateInputClick}
              className="filter-select"
            />
          </div>
        </div>

        <div className="search-modal-filter-actions">
          <button
            type="button"
            className="search-modal-reset-btn"
            onClick={handleResetFilters}
          >
            Resetiraj filtere
          </button>
        </div>

        {/* Rezultati */}
        <div className="search-modal-results">
          {loading ? (
            <div className="search-loading">
              <p>Učitavanje...</p>
            </div>
          ) : filteredTravels.length > 0 ? (
            <div className="travels-grid">
              {filteredTravels.map(travel => (
                <div 
                  key={travel.id} 
                  className="travel-card"
                  onClick={() => handleTravelClick(travel)}
                  style={{ cursor: 'pointer' }}
                >
                  {travel.image && (
                    <div className="travel-card-image">
                      <img src={travel.image} alt={travel.title} loading="lazy" />
                      {travel.continent && travel.continent !== "Nepoznato" && (
                        <span className="travel-card-tag">{travel.continent}</span>
                      )}
                      <span className="travel-card-icon-wrap">
                        <FontAwesomeIcon icon={getTransportIconByMethod(travel.transportMethod)} />
                      </span>
                    </div>
                  )}
                  <div className="travel-card-content">
                    <h3>{travel.title}</h3>
                    <div className="travel-info">
                      <div className="travel-left-info">
                        <p className="travel-month">
                          <FontAwesomeIcon icon={faCalendarAlt} /> {travel.month}
                        </p>
                      </div>
                      <p className="travel-duration">
                        <FontAwesomeIcon icon={faClock} /> {travel.duration}
                      </p>
                    </div>
                    {(travel.departureDate || travel.returnDate) && (
                      <p className="travel-date-range">
                        {formatTravelDate(travel.departureDate) || "-"}
                        {travel.departureDate && travel.returnDate ? " - " : ""}
                        {formatTravelDate(travel.returnDate) || ""}
                      </p>
                    )}
                    <p className="travel-price">€{travel.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="search-no-results">
              <p>Nema rezultata koji odgovaraju vašem pretraživanju.</p>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;