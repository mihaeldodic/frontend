import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSearch } from "@fortawesome/free-solid-svg-icons";
import "./search-modal.css";

const SearchModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [travels, setTravels] = useState([]);
  const [filteredTravels, setFilteredTravels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContinent, setSelectedContinent] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
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

      // Prvo dohvati sve slike
      const mediaResponse = await fetch(
        `${apiUrl}v2/media?per_page=100`
      );
      const mediaItems = await mediaResponse.json();
      const mediaMap = {};
      
      mediaItems.forEach(media => {
        mediaMap[media.id] = media.source_url;
      });

      const travelsData = posts.map((post) => {
        const acf = post.acf || {};
        
        // Dohvati sliku - image je ID
        let imageUrl = "";
        if (acf.image) {
          imageUrl = mediaMap[acf.image] || "";
        }

        // Ako nema, pokušaj hero_image
        if (!imageUrl && acf.hero_image) {
          imageUrl = mediaMap[acf.hero_image] || "";
        }
        
        // Ako nema, pokušaj hero_slika
        if (!imageUrl && acf.hero_slika) {
          imageUrl = mediaMap[acf.hero_slika] || "";
        }

        return {
          id: post.id,
          title: post.title.rendered || post.title,
          continent: acf.continent ? acf.continent.trim() : "Nepoznato",
          price: parseInt(acf.price) || 0,
          month: acf.month ? acf.month.trim() : "Nepoznato",
          duration: acf.travel_duration ? acf.travel_duration.trim() : "Nepoznato",
          image: imageUrl,
          description: acf.description || "",
          slug: post.slug
        };
      });

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

    // Pretraga po tekstu
    if (searchTerm && searchTerm.trim() !== "") {
      filtered = filtered.filter(travel =>
        travel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        travel.description.toLowerCase().includes(searchTerm.toLowerCase())
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

    // Filtriraj po cijeni
    filtered = filtered.filter(
      travel => travel.price >= priceRange[0] && travel.price <= priceRange[1]
    );

    console.log("Filtrirano:", filtered);
    setFilteredTravels(filtered);
  }, [searchTerm, selectedContinent, selectedMonth, priceRange, travels]);

  const handlePriceChange = (e) => {
    setPriceRange([priceRange[0], parseInt(e.target.value)]);
  };

  const handleTravelClick = (travel) => {
    navigate(`/putovanje/${travel.slug}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal-content" onClick={e => e.stopPropagation()}>
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

        {/* Filtri */}
        <div className="search-modal-filters">
          {/* Kontinent */}
          <div className="filter-group">
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

          {/* Mjesec */}
          <div className="filter-group">
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

          {/* Cijena */}
          <div className="filter-group">
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
                    </div>
                  )}
                  <div className="travel-card-content">
                    <h3>{travel.title}</h3>
                    <div className="travel-info">
                      <div className="travel-left-info">
                        <p className="travel-continent">{travel.continent}</p>
                        <p className="travel-month">{travel.month}</p>
                      </div>
                      <p className="travel-duration">⏱️ {travel.duration}</p>
                    </div>
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
  );
};

export default SearchModal;