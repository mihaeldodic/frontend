import { useEffect, useState } from "react";
import "./herosection.css";

const HeroSection = ({ fallback = "/img/slider-default.jpg" }) => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pause, setPause] = useState(false);

  const PAGE_URL =
    "https://front2.edukacija.online/backend/wp-json/wp/v2/pages/2434";

  const fetchImageUrl = async (id) => {
    try {
      const res = await fetch(
        `https://front2.edukacija.online/backend/wp-json/wp/v2/media/${id}`
      );

      if (!res.ok) return fallback;

      const data = await res.json();
      return data.source_url || fallback;
    } catch {
      return fallback;
    }
  };

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch(PAGE_URL);
        const data = await res.json();

        if (!data.acf) {
          setLoading(false);
          return;
        }

        const acf = data.acf;

        const heroIds = [
          { text: acf.hero_text_1, id: acf.hero_image_1 },
          { text: acf.hero_text_2, id: acf.hero_image_2 },
          { text: acf.hero_text_3, id: acf.hero_image_3 },
          { text: acf.hero_text_4, id: acf.hero_image_4 },
        ].filter((s) => s.text && s.id);

        const slidesWithUrls = await Promise.all(
          heroIds.map(async (slide) => ({
            text: slide.text,
            image: (await fetchImageUrl(slide.id)) || fallback,
          }))
        );

        setSlides(slidesWithUrls);
      } catch (err) {
        console.error("Hero error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;

    const currentText = slides[current].text;
    const typingSpeed = 100;
    const deletingSpeed = 100;
    const pauseDuration = 4000;

    const handleTyping = () => {
      if (pause) return;

      if (!isDeleting) {
        if (typedText.length < currentText.length) {
          setTypedText(currentText.slice(0, typedText.length + 1));
        } else {
          setPause(true);
          setTimeout(() => setPause(false), pauseDuration);
          setIsDeleting(true);
        }
      } else {
        if (typedText.length > 0) {
          setTypedText(currentText.slice(0, typedText.length - 1));
        } else {
          setIsDeleting(false);
          setCurrent((prev) => (prev + 1) % slides.length);
        }
      }
    };

    const speed = isDeleting ? deletingSpeed : typingSpeed;
    const timer = setTimeout(handleTyping, speed);

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, current, slides, pause]);

  if (loading) return null;
  if (slides.length === 0) return null;

  return (
    <div className="hero">
      <div className="slides overlay">
        {slides.map((slide, i) => (
          <img
            key={i}
            src={slide.image || fallback}
            alt={slide.text}
            className={i === current ? "active" : ""}
          />
        ))}
      </div>

      <div className="intro">
        <h1>
          <div className="fixed-text">
            Istražite najljepša mjesta u svijetu
          </div>

          <div className="dynamic-text">
            poput{" "}
            <span className="typed-words">{typedText}</span>
            <span className="typed-cursor">|</span>
          </div>
        </h1>

        <a href="#" className="hero-btn">
          Contact us
        </a>
      </div>
    </div>
  );
};

export default HeroSection;
