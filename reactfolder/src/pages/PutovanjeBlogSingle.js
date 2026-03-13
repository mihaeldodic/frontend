import "./Blog.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";

const BASE_URL = process.env.REACT_APP_API_URL;

const buildDaysFromAcf = (acf = {}) => {
  const dayMap = {};

  Object.entries(acf).forEach(([key, value]) => {
    const normalizedKey = String(key).toLowerCase().replace(/_+$/, "");
    const match = normalizedKey.match(/^dan_(\d+)_(naslov|opis)$/i);
    if (!match) return;

    const dayNumber = Number(match[1]);
    const fieldType = match[2].toLowerCase();
    const safeValue = typeof value === "string" ? value.trim() : value;

    if (!dayMap[dayNumber]) {
      dayMap[dayNumber] = {
        number: dayNumber,
        title: "",
        description: "",
      };
    }

    if (fieldType === "naslov") {
      dayMap[dayNumber].title = safeValue || "";
    }

    if (fieldType === "opis") {
      dayMap[dayNumber].description = safeValue || "";
    }
  });

  return Object.values(dayMap)
    .filter((day) => day.title || day.description)
    .sort((a, b) => a.number - b.number);
};

const PutovanjeBlogSingle = () => {
  const { slug } = useParams();
  const [travel, setTravel] = useState(null);
  const [loading, setLoading] = useState(true);

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
        let imageUrl = "";
        if (acf.image) {
          try {
            const mediaResponse = await fetch(
              `${BASE_URL}v2/media/${acf.image}`
            );
            const media = await mediaResponse.json();
            imageUrl = media.source_url || "";
          } catch (error) {
            console.error("Greška pri dohvaćanju slike:", error);
          }
        }

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
          includedServices: acf.ukljuceno || "",
          travelPlan: acf.plan_putovanja || "",
          days: buildDaysFromAcf(acf)
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
                      <h5>Mjesec</h5>
                      <p>{travel.month}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-card">
                      <h5>Trajanje</h5>
                      <p>{travel.duration}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-card">
                      <h5>Cijena</h5>
                      <p className="price">€{travel.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-card">
                      <h5>Država</h5>
                      <p>{travel.country || "Nepoznato"}</p>
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
                      {day.description && (
                        <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                          {day.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default PutovanjeBlogSingle;