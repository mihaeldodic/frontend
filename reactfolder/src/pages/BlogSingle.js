import "./Blog.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";
import Author from "../components/Author";
import Yoast from "../components/Yoast";

const BASE_URL = process.env.REACT_APP_API_URL;

const BlogSingle = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  // Funkcija za dekodiranje HTML entiteta
  const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  useEffect(() => {
    fetch(`${BASE_URL}v2/posts?slug=${slug}&_embed`)
      .then((response) => response.json())
      .then((data) => setPost(data[0]));
  }, [slug]);

  if (!post) {
    return <Loader />;
  }

  const featuredImage =
    post?._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.full
      ?.source_url ||
    post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80";

  // Dekodiramo HTML i zamjenjujemo &#8230; s ...
  const subtitle = decodeHtml(
    (post.excerpt?.rendered || "").replace(/<[^>]+>/g, "").trim()
  ).replace(/…|&#8230;/g, "...");

  return (
    <>
    <Yoast yoastHeadJson={post.yoast_head_json} />
    <div className="blog-single-modern">
      <section
        className="blog-single-hero"
        style={{ backgroundImage: `url(${featuredImage})` }}
      >
        <div className="blog-single-hero-overlay">
          <div className="container">
            <div className="blog-single-hero-content">
              <h1>{decodeHtml(post.title.rendered)}</h1>
              {subtitle && (
                <p className="blog-single-subtitle">{subtitle}</p>
              )}
              <div className="blog-single-meta">
                <Author post={post} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="blog-single-content-wrap">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-10 col-lg-9 col-xl-8">
              <article className="blog-single-content-card">
                <div
                  className="blog-single-content"
                  dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                />
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default BlogSingle;
