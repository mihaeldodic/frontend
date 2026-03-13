import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCalendarDays, faClock } from "@fortawesome/free-solid-svg-icons";
import Loader from "../components/Loader";
import "./putovanje.css";

const BASE_URL = process.env.REACT_APP_API_URL;

const slugToNaziv = {
  europa: "Europa",
  azija: "Azija",
  afrika: "Afrika",
  oceanija: "Oceanija",
  australija: "Australija",
  "juzna-amerika": "Juzna Amerika",
  "južna-amerika": "Juzna Amerika",
  "sjeverna-amerika": "Sjeverna Amerika",
  "sjeverna-amerika": "Sjeverna Amerika",
};

const fallbackOpis = {
  europa: "Povijest, kultura i gradovi koji ostavljaju bez daha.",
  azija: "Egzotika, tradicija i avantura na svakom koraku.",
  afrika: "Divlja priroda, safari i autentična iskustva.",
  australija: "Netaknuta priroda, ocean i jedinstveni krajolici.",
  oceanija: "Netaknuta priroda, ocean i jedinstveni krajolici.",
  "juzna-amerika": "Ande, Amazona i boje Latinske Amerike.",
  "sjeverna-amerika": "Nacionalni parkovi, metropole i road trip iskustva.",
};

const normalize = (value) =>
  (value || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .trim();

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

const PutovanjeKontinent = () => {
  const { continentSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [continentContent, setContinentContent] = useState({
    title: "",
    shortDescription: "",
    heroImage: "",
  });

  const trazeniKontinent = useMemo(() => {
    const mapped = slugToNaziv[continentSlug] || continentSlug;
    return normalize(mapped);
  }, [continentSlug]);

  useEffect(() => {
    const fetchPutovanja = async () => {
      try {
        setLoading(true);
        const nazivKontinenta = slugToNaziv[continentSlug] || continentSlug;
        const nazivSearch = encodeURIComponent(nazivKontinenta);

        const [putovanjaResponse, ...pageResponses] = await Promise.all([
          fetch(`${BASE_URL}v2/nova-destinacija?_embed&per_page=100`),
          fetch(`${BASE_URL}v2/pages?slug=${continentSlug}&_embed`),
          fetch(`${BASE_URL}v2/pages?slug=putovanje-${continentSlug}&_embed`),
          fetch(`${BASE_URL}v2/pages?slug=kontinent-${continentSlug}&_embed`),
          fetch(`${BASE_URL}v2/pages?search=${nazivSearch}&_embed&per_page=20`),
        ]);

        const putovanjaData = await putovanjaResponse.json();
        const normalizedPosts = Array.isArray(putovanjaData) ? putovanjaData : [];

        const postsWithImages = await Promise.all(
          normalizedPosts.map(async (post) => {
            const resolvedImage = await resolvePostImage(post);
            return { ...post, _resolvedImage: resolvedImage };
          })
        );

        setPosts(postsWithImages);

        let pageData = null;
        for (let i = 0; i < pageResponses.length; i += 1) {
          const data = await pageResponses[i].json();
          if (!Array.isArray(data) || data.length === 0) continue;

          if (i === pageResponses.length - 1) {
            const target = normalize(nazivKontinenta);
            const matched = data.find((page) => {
              const title = normalize(page?.title?.rendered || "");
              return title.includes(target) || target.includes(title);
            });
            pageData = matched || data[0];
          } else {
            pageData = data[0];
          }

          if (pageData) break;
        }

        if (pageData) {
          const acf = pageData.acf || {};
          const heroImage = await resolveHeroImage(acf.hero_image || acf.hero_slika);
          const shortDescription =
            acf.kratki_opis ||
            acf.hero_opis ||
            acf.short_description ||
            acf.opis ||
            pageData.excerpt?.rendered?.replace(/<[^>]+>/g, "").trim() ||
            fallbackOpis[continentSlug] ||
            "Ponuda putovanja za odabrani kontinent.";

          setContinentContent({
            title: pageData.title?.rendered || slugToNaziv[continentSlug] || continentSlug,
            shortDescription,
            heroImage,
          });
        } else {
          setContinentContent({
            title: slugToNaziv[continentSlug] || continentSlug,
            shortDescription:
              fallbackOpis[continentSlug] || "Ponuda putovanja za odabrani kontinent.",
            heroImage: "",
          });
        }
      } catch (error) {
        console.error("Greska pri dohvacanju putovanja:", error);
        setPosts([]);
        setContinentContent({
          title: slugToNaziv[continentSlug] || continentSlug,
          shortDescription:
            fallbackOpis[continentSlug] || "Ponuda putovanja za odabrani kontinent.",
          heroImage: "",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPutovanja();
  }, [continentSlug]);

  const filtriranaPutovanja = useMemo(() => {
    return posts.filter((post) => {
      const kontinent = normalize(post?.acf?.continent);
      if (!kontinent) return false;

      if (trazeniKontinent === "oceanija" || trazeniKontinent === "australija") {
        return kontinent === "oceanija" || kontinent === "australija";
      }

      if (trazeniKontinent === "sjeverna-amerika") {
        return kontinent === "sjeverna-amerika";
      }

      if (trazeniKontinent === "juzna-amerika") {
        return kontinent === "juzna-amerika";
      }

      return kontinent === trazeniKontinent;
    });
  }, [posts, trazeniKontinent]);

  const naslovKontinenta = slugToNaziv[continentSlug] || continentSlug;

  const heroStyle = continentContent.heroImage
    ? {
        backgroundImage: `linear-gradient(145deg, rgba(14, 116, 144, 0.78), rgba(10, 88, 110, 0.78)), url(${continentContent.heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : undefined;

  return (
    <div className="putovanje-kontinent-stranica">
      {loading && <Loader />}

      <section className="putovanje-kontinent-hero" style={heroStyle}>
        <div className="container">
          <Link to="/putovanje" className="putovanje-back-link">
            <FontAwesomeIcon icon={faArrowLeft} /> Natrag na kontinente
          </Link>
          <h1>{continentContent.title || naslovKontinenta}</h1>
          <p>{continentContent.shortDescription || "Ponuda putovanja za odabrani kontinent."}</p>
        </div>
      </section>

      <section className="putovanje-kontinent-lista">
        <div className="container">
          {!loading && filtriranaPutovanja.length === 0 && (
            <div className="putovanje-empty-state">
              Trenutno nema dostupnih putovanja za ovaj kontinent.
            </div>
          )}

          <div className="row g-4">
            {filtriranaPutovanja.map((post) => {
              const image = post._resolvedImage;
              const acf = post.acf || {};
              return (
                <div key={post.id} className="col-md-6 col-lg-4">
                  <Link to={`/putovanje/${post.slug}`} className="put-card">
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

                      <div className="put-card-bottom">
                        <span className="put-card-price">€{Number(acf.price || 0).toLocaleString("hr-HR")}</span>
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

export default PutovanjeKontinent;