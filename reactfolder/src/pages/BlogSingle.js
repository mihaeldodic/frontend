import "./Blog.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";
import Author from "../components/Author";
import Yoast from "../components/Yoast";
import { mapBlogPostForSingle, stripHtml } from "../utils/blogAcf";

const BASE_URL = process.env.REACT_APP_API_URL;

const BlogSingle = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  useEffect(() => {
    fetch(`${BASE_URL}v2/posts?slug=${slug}&_embed`)
      .then((response) => response.json())
      .then(async (data) => {
        const nextPost = Array.isArray(data) ? data[0] : null;

        if (!nextPost) {
          setPost(null);
          return;
        }

        setPost(await mapBlogPostForSingle(nextPost));
      });
  }, [slug]);

  if (!post) {
    return <Loader />;
  }

  const featuredImage =
    post._blogHeroImage ||
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80";

  const subtitle = decodeHtml(
    (post._blogIntro || post.excerpt?.rendered || "").replace(/<[^>]+>/g, "").trim()
  ).replace(/…|&#8230;/g, "...");

  const hasStructuredAcfContent = Boolean(
    post._blogIntro || post._blogSections?.length || post._blogConclusion
  );

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
                {featuredImage && (
                  <img
                    src={featuredImage}
                    alt={decodeHtml(post.title.rendered)}
                    className="blog-single-content-top-image"
                  />
                )}

                {hasStructuredAcfContent ? (
                  <div className="blog-single-content blog-single-content--acf">
                    {post._blogIntro && (
                      <p className="blog-single-intro">{stripHtml(post._blogIntro)}</p>
                    )}

                    {post._blogSections.map((section, index) => (
                      <section key={`${section.title}-${index}`} className="blog-single-section">
                        {section.title && <h2>{section.title}</h2>}
                        {section.image && (
                          <img
                            src={section.image}
                            alt={section.title || decodeHtml(post.title.rendered)}
                            className="blog-single-section-image"
                          />
                        )}
                        {section.text && <p>{stripHtml(section.text)}</p>}
                      </section>
                    ))}

                    {post._blogConclusion && (
                      <section className="blog-single-section blog-single-section--conclusion">
                        <h2>Zaključak</h2>
                        <p>{stripHtml(post._blogConclusion)}</p>
                      </section>
                    )}
                  </div>
                ) : (
                  <div
                    className="blog-single-content"
                    dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                  />
                )}
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
