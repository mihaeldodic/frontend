import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faUsers,
  faMapMarkerAlt,
  faStar,
  faShieldAlt,
  faHeadset,
  faArrowRight,
  faCalendarAlt,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { getTransportIconByMethod } from "../utils/transportIcons";
import { buildTravelDetailsPath } from "../utils/travelRoutes";
import "./naslovna.css";

import Yoast from "../components/Yoast";

const BASE_URL = process.env.REACT_APP_API_URL;
const BLOG_AUTHOR_ID = Number(process.env.REACT_APP_BLOG_AUTHOR_ID || 9);
const FALLBACK_AUTHOR_MATCH = "mihael";
const CONTINENT_OFFER_SECTIONS = [
  { slug: "europa", label: "Europa" },
  { slug: "azija", label: "Azija" },
  { slug: "afrika", label: "Afrika" },
  { slug: "sjeverna-amerika", label: "Sjeverna Amerika" },
  { slug: "juzna-amerika", label: "Južna Amerika" },
  { slug: "australija", label: "Australija" },
];

const normalizeContinentSlug = (value) =>
  (value || "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .trim();

const resolveAcfImageUrl = async (acfImage) => {
  if (!acfImage) return "";

  if (typeof acfImage === "string") {
    if (acfImage.startsWith("http")) return acfImage;
    if (/^\d+$/.test(acfImage)) {
      try {
        const res = await fetch(`${BASE_URL}v2/media/${acfImage}`);
        if (!res.ok) return "";
        const media = await res.json();
        return media?.source_url || "";
      } catch {
        return "";
      }
    }
    return "";
  }

  if (typeof acfImage === "number") {
    try {
      const res = await fetch(`${BASE_URL}v2/media/${acfImage}`);
      if (!res.ok) return "";
      const media = await res.json();
      return media?.source_url || "";
    } catch {
      return "";
    }
  }

  if (typeof acfImage === "object") {
    return (
      acfImage?.sizes?.full?.url ||
      acfImage?.sizes?.large?.url ||
      acfImage?.url ||
      acfImage?.source_url ||
      ""
    );
  }

  return "";
};

const resolveDestinationImage = async (dest) => {
  const featured =
    dest?._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.full
      ?.source_url ||
    dest?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "";

  if (featured) return featured;

  const acf = dest?.acf || {};
  return (
    (await resolveAcfImageUrl(acf.image)) ||
    (await resolveAcfImageUrl(acf.hero_image)) ||
    (await resolveAcfImageUrl(acf.hero_slika)) ||
    ""
  );
};

const toShortExcerpt = (html, maxLength = 130) => {
  const plainText = (html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!plainText) {
    return "";
  }

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.slice(0, maxLength).trim()}...`;
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

const Naslovna = () => {
  const [page, setPage] = useState(null);
  const [yoastHeadJson, setYoastHeadJson] = useState(null);
  const [destinacije, setDestinacije] = useState([]);
  const [continentOffers, setContinentOffers] = useState({});
  const [blogPosts, setBlogPosts] = useState([]);
  const [myAuthorId, setMyAuthorId] = useState(BLOG_AUTHOR_ID || null);
  const [authorReady, setAuthorReady] = useState(Boolean(BLOG_AUTHOR_ID));

  useEffect(() => {
    if (BLOG_AUTHOR_ID) {
      return;
    }

    fetch(`${BASE_URL}v2/users?per_page=100`)
      .then((response) => response.json())
      .then((users) => {
        const matched = Array.isArray(users)
          ? users.find((user) => {
              const name = (user?.name || "").toLowerCase();
              const slug = (user?.slug || "").toLowerCase();
              return (
                name.includes(FALLBACK_AUTHOR_MATCH) ||
                slug.includes(FALLBACK_AUTHOR_MATCH)
              );
            })
          : null;

        setMyAuthorId(matched?.id || null);
        setAuthorReady(true);
      })
      .catch(() => {
        setMyAuthorId(null);
        setAuthorReady(true);
      });
  }, []);

  useEffect(() => {
    fetch(`${BASE_URL}v2/pages/727?_embed`)
      .then((r) => r.json())
      .then((data) => {
         setPage(data);
         setYoastHeadJson(data?.yoast_head_json);
      })
      .catch(() => {});

    fetch(`${BASE_URL}v2/nova-destinacija?_embed&per_page=100`)
      .then((r) => r.json())
      .then(async (data) => {
        const list = Array.isArray(data) ? data : [];
        const withResolvedImages = await Promise.all(
          list.map(async (dest) => ({
            ...dest,
            _resolvedImage: await resolveDestinationImage(dest),
          }))
        );

        const sortedByDate = [...withResolvedImages].sort(
          (a, b) => new Date(b?.date || 0) - new Date(a?.date || 0)
        );
        setDestinacije(sortedByDate.slice(0, 3));

        const groupedOffers = CONTINENT_OFFER_SECTIONS.reduce((acc, continent) => {
          acc[continent.slug] = [];
          return acc;
        }, {});

        sortedByDate.forEach((dest) => {
          const acfContinent = normalizeContinentSlug(dest?.acf?.continent);
          let key = acfContinent;

          if (key === "oceanija") key = "australija";
          if (key === "juzna-amerika") key = "juzna-amerika";
          if (key === "sjeverna-amerika") key = "sjeverna-amerika";

          if (groupedOffers[key] && groupedOffers[key].length < 3) {
            groupedOffers[key].push(dest);
          }
        });

        setContinentOffers(groupedOffers);
      })
      .catch(() => {});

  }, []);

  useEffect(() => {
    if (!authorReady) {
      return;
    }

    if (!myAuthorId) {
      setBlogPosts([]);
      return;
    }

    fetch(`${BASE_URL}v2/posts?_embed&per_page=3&author=${myAuthorId}`)
      .then((r) => r.json())
      .then((data) => setBlogPosts(Array.isArray(data) ? data : []))
      .catch(() => setBlogPosts([]));
  }, [myAuthorId, authorReady]);

  const stats = [
    { icon: faMapMarkerAlt, broj: "50+", naziv: "Destinacija" },
    { icon: faUsers, broj: "1000+", naziv: "Zadovoljnih putnika" },
    { icon: faGlobe, broj: "6", naziv: "Kontinenata" },
    { icon: faStar, broj: "5★", naziv: "Prosječna ocjena" },
  ];

  const prednosti = [
    {
      icon: faShieldAlt,
      naslov: "Sigurnost na prvom mjestu",
      opis: "Svako putovanje planiramo s maksimalnom pažnjom na sigurnost i udobnost putnika.",
    },
    {
      icon: faGlobe,
      naslov: "Lokalni vodiči",
      opis: "Surađujemo samo s provjerenim lokalnim vodičima koji poznaju svaki kutak destinacije.",
    },
    {
      icon: faHeadset,
      naslov: "Podrška 24/7",
      opis: "Naš tim dostupan je svakog dana, u svakom trenutku, kako bi vaš put bio savršen.",
    },
  ];

  return (
    <div className="naslovna">
      <Yoast yoastHeadJson={yoastHeadJson} />
      {/* ─── HERO ─── */}
      <HeroSection
        stranica={page}
        fallback="https://placehold.co/1920x1080"
        size="full"
      />

      {/* ─── FEATURED DESTINACIJE ─── */}
      <section className="naslovna-destinacije">
        <div className="container">
          <div className="naslovna-section-header">
            <span className="naslovna-section-tag">Istraži</span>
            <h2 className="naslovna-section-title">Popularne destinacije</h2>
            <p className="naslovna-section-sub">
              Otkrijte najtraženija mjesta koja naši putnici obožavaju
            </p>
          </div>

          <div className="row">
            {destinacije.length > 0
              ? destinacije.map((dest) => {
                  const img = dest._resolvedImage || "";
                  const acf = dest.acf || {};
                  const departureDate = formatTravelDate(
                    acf.date || acf.datum_polaska || acf.polazak || ""
                  );
                  const returnDate = formatTravelDate(
                    acf.date_2 || acf["date-2"] || acf.datum_povratka || acf.povratak || ""
                  );
                  const transportMethod =
                    acf.nacin_putovanja ||
                    acf["nacin-putovanja"] ||
                    acf.prijevozno_sredstvo ||
                    "";
                  const travelDetailsPath = buildTravelDetailsPath(acf.continent, dest.slug);
                  return (
                    <div key={dest.id} className="col-md-4 mb-4">
                      <Link to={travelDetailsPath} className="dest-card">
                        <div className="dest-card-img-wrap">
                          {img && (
                            <img
                              src={img}
                              alt={dest.title?.rendered}
                              className="dest-card-img"
                            />
                          )}
                          <div className="dest-card-overlay" />
                          {acf.continent && (
                            <span className="dest-card-tag">{acf.continent}</span>
                          )}
                          <span className="dest-card-icon-wrap">
                            <FontAwesomeIcon icon={getTransportIconByMethod(transportMethod)} />
                          </span>
                        </div>
                        <div className="dest-card-body">
                          <h3 className="dest-card-title">
                            {dest.title?.rendered}
                          </h3>
                          <div className="dest-card-meta">
                            {acf.price && (
                              <span className="dest-card-price">
                                od {acf.price} €
                              </span>
                            )}
                            {acf.month && (
                              <span className="dest-card-month">
                                <FontAwesomeIcon icon={faCalendarAlt} /> {acf.month}
                              </span>
                            )}
                            {acf.travel_duration && (
                              <span className="dest-card-duration">
                                <FontAwesomeIcon icon={faClock} />{" "}
                                {acf.travel_duration}
                              </span>
                            )}
                          </div>
                          {(departureDate || returnDate) && (
                            <div className="dest-card-dates">
                              {departureDate || "-"}
                              {departureDate && returnDate ? " - " : ""}
                              {returnDate || ""}
                            </div>
                          )}
                        </div>
                      </Link>
                    </div>
                  );
                })
              : [1, 2, 3].map((i) => (
                  <div key={i} className="col-md-4 mb-4">
                    <div className="dest-card dest-card--skeleton" />
                  </div>
                ))}
          </div>

          <div className="naslovna-section-cta">
            <Link to="/putovanje/sva-putovanja" className="naslovna-btn-outline">
              Pogledaj sve destinacije{" "}
              <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="naslovna-stats">
        <div className="container">
          <div className="row">
            {stats.map((s, i) => (
              <div key={i} className="col-6 col-md-3">
                <div className="stat-card">
                  <FontAwesomeIcon icon={s.icon} className="stat-icon" />
                  <span className="stat-broj">{s.broj}</span>
                  <span className="stat-naziv">{s.naziv}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BLOG POSTS ─── */}
      {blogPosts.length > 0 && (
        <section className="naslovna-blog">
          <div className="container">
            <div className="naslovna-section-header">
              <span className="naslovna-section-tag">Iz bloga</span>
              <h2 className="naslovna-section-title">Najnoviji članci</h2>
              <p className="naslovna-section-sub">
                Savjeti, priče i inspiracija za vaše sljedeće putovanje
              </p>
            </div>

            <div className="row">
              {blogPosts.map((post) => {
                const img =
                  post._embedded?.["wp:featuredmedia"]?.[0]?.media_details
                    ?.sizes?.full?.source_url ||
                  post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                  "";
                const excerpt = toShortExcerpt(post?.excerpt?.rendered, 130);
                const datum = new Date(post.date).toLocaleDateString("hr-HR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                });
                return (
                  <div key={post.id} className="col-md-4 mb-4">
                    <article className="blog-card">
                      <Link to={`/blog/${post.slug}`} className="blog-card-img-wrap">
                        {img && (
                          <img
                            src={img}
                            alt={post.title?.rendered}
                            className="blog-card-img"
                          />
                        )}
                      </Link>
                      <div className="blog-card-body">
                        <span className="blog-card-datum">{datum}</span>
                        <Link
                          to={`/blog/${post.slug}`}
                          className="blog-card-title-link"
                        >
                          <h3
                            className="blog-card-title"
                            dangerouslySetInnerHTML={{ __html: post.title?.rendered }}
                          />
                        </Link>
                        <p className="blog-card-excerpt">{excerpt}</p>
                        <Link to={`/blog/${post.slug}`} className="blog-card-link">
                          Pročitaj više <FontAwesomeIcon icon={faArrowRight} />
                        </Link>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>

            <div className="naslovna-section-cta">
              <Link to="/blog" className="naslovna-btn-outline">
                Sve objave{" "}
                <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA BANNER ─── */}
      <section className="naslovna-cta">
        <div className="container">
          <div className="naslovna-cta-inner">
            <h2 className="naslovna-cta-title">Spremi za avanturu?</h2>
            <p className="naslovna-cta-sub">
              Kontaktirajte nas i zajedno ćemo planirati savršeno putovanje po
              vašoj mjeri.
            </p>
            <Link to="/putovanje/sva-putovanja" className="naslovna-btn-cta">
              Planiraj putovanje
            </Link>
          </div>
        </div>
      </section>

      {/* ─── ZAŠTO MI ─── */}
      <section className="naslovna-kontinent-ponuda">
        <div className="container">
          <div className="naslovna-section-header">
            <span className="naslovna-section-tag">Ponuda po kontinentima</span>
            <h2 className="naslovna-section-title">Najnovija putovanja</h2>
            <p className="naslovna-section-sub">
              Za svaki kontinent pažljivo smo izdvojili tri najatraktivnija i najnovija putovanja, osmišljena kako bi vam pružila jedinstvena iskustva i najbolje od svjetskih destinacija.
            </p>
          </div>

          {CONTINENT_OFFER_SECTIONS.map((continent) => {
            const offers = continentOffers[continent.slug] || [];

            return (
              <div key={continent.slug} className="kontinent-ponuda-blok">
                <h3 className="kontinent-ponuda-naslov">{continent.label}</h3>

                {offers.length > 0 ? (
                  <div className="row">
                    {offers.map((dest) => {
                      const img = dest._resolvedImage || "";
                      const acf = dest.acf || {};
                      const departureDate = formatTravelDate(
                        acf.date || acf.datum_polaska || acf.polazak || ""
                      );
                      const returnDate = formatTravelDate(
                        acf.date_2 || acf["date-2"] || acf.datum_povratka || acf.povratak || ""
                      );
                      const transportMethod =
                        acf.nacin_putovanja ||
                        acf["nacin-putovanja"] ||
                        acf.prijevozno_sredstvo ||
                        "";
                      const travelDetailsPath = buildTravelDetailsPath(acf.continent, dest.slug);

                      return (
                        <div key={dest.id} className="col-md-4 mb-4">
                          <Link to={travelDetailsPath} className="dest-card">
                            <div className="dest-card-img-wrap">
                              {img && (
                                <img
                                  src={img}
                                  alt={dest.title?.rendered}
                                  className="dest-card-img"
                                />
                              )}
                              <div className="dest-card-overlay" />
                              {acf.continent && (
                                <span className="dest-card-tag">{acf.continent}</span>
                              )}
                              <span className="dest-card-icon-wrap">
                                <FontAwesomeIcon icon={getTransportIconByMethod(transportMethod)} />
                              </span>
                            </div>
                            <div className="dest-card-body">
                              <h3 className="dest-card-title">{dest.title?.rendered}</h3>
                              <div className="dest-card-meta">
                                {acf.price && (
                                  <span className="dest-card-price">od {acf.price} €</span>
                                )}
                                {acf.month && (
                                  <span className="dest-card-month">
                                    <FontAwesomeIcon icon={faCalendarAlt} /> {acf.month}
                                  </span>
                                )}
                                {acf.travel_duration && (
                                  <span className="dest-card-duration">
                                    <FontAwesomeIcon icon={faClock} /> {acf.travel_duration}
                                  </span>
                                )}
                              </div>
                              {(departureDate || returnDate) && (
                                <div className="dest-card-dates">
                                  {departureDate || "-"}
                                  {departureDate && returnDate ? " - " : ""}
                                  {returnDate || ""}
                                </div>
                              )}
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="kontinent-ponuda-prazno">
                    Trenutno nema dostupnih putovanja za kontinent {continent.label}.
                  </div>
                )}

                <div className="kontinent-ponuda-cta-wrap">
                  <Link
                    to={`/putovanje/kontinent/${continent.slug}`}
                    className="naslovna-btn-cta"
                  >
                    Sva putovanja {continent.label}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="naslovna-prednosti">
        <div className="container">
          <div className="naslovna-section-header">
            <span className="naslovna-section-tag">Zašto Explorers Way</span>
            <h2 className="naslovna-section-title">Putujte s povjerenjem</h2>
          </div>

          <div className="row">
            {prednosti.map((p, i) => (
              <div key={i} className="col-md-4 mb-4">
                <div className="prednost-card">
                  <div className="prednost-icon-wrap">
                    <FontAwesomeIcon icon={p.icon} className="prednost-icon" />
                  </div>
                  <h3 className="prednost-naslov">{p.naslov}</h3>
                  <p className="prednost-opis">{p.opis}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Naslovna;
