import "./Blog.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";

const BASE_URL = process.env.REACT_APP_API_URL;

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
          day1Title: acf.dan_1_naslov || "",
          day1Description: acf.dan_1_opis || "",
          day2Title: acf.dan_2_naslov || "",
          day2Description: acf.dan_2_opis || "",
          day3Title: acf.dan_3_naslov || "",
          day3Description: acf.dan_3_opis || ""
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
      <div className="blog-single">
        <div className="container px-4 px-lg-5">
          <div className="row gx-4 gx-lg-5 justify-content-center">
            <div className="col-md-10 col-lg-8 col-xl-7">
              <p>Putovanje nije pronađeno</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-single">
      {/* Masthead sa slikom */}
      <div
        className="masthead"
        style={{
          backgroundImage: `url(${travel.image})`,
        }}
      >
        <div className="container position-relative px-4 px-lg-5">
          <div className="row gx-4 gx-lg-5 justify-content-center">
            <div className="col-md-10 col-lg-8 col-xl-7">
              <div className="post-heading">
                <h1>{travel.title}</h1>
                <h2 className="subheading">{travel.continent}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

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
              <div className="days-section">
                {(travel.day1Title || travel.day1Description) && (
                  <div className="day-card mb-4">
                    <h3>
                      <span className="day-badge">Dan 1</span> {travel.day1Title}
                    </h3>
                    <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {travel.day1Description}
                    </p>
                  </div>
                )}

                {(travel.day2Title || travel.day2Description) && (
                  <div className="day-card mb-4">
                    <h3>
                      <span className="day-badge">Dan 2</span> {travel.day2Title}
                    </h3>
                    <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {travel.day2Description}
                    </p>
                  </div>
                )}

                {(travel.day3Title || travel.day3Description) && (
                  <div className="day-card mb-4">
                    <h3>
                      <span className="day-badge">Dan 3</span> {travel.day3Title}
                    </h3>
                    <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {travel.day3Description}
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default PutovanjeBlogSingle;