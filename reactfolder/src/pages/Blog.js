import { useState, useEffect } from "react";
import Loader from "../components/Loader";
import ReactPaginate from "react-paginate";

import "./Blog.css";
import ScrollToTop from "../components/ScrollToTop";
import BlogPost from "../components/BlogPost";
import { mapBlogPostForCard } from "../utils/blogAcf";
import Yoast from "../components/Yoast";
//import posts from "../components/zadaci/data/blog.json";

const BASE_URL = process.env.REACT_APP_API_URL;
const BLOG_AUTHOR_ID = Number(process.env.REACT_APP_BLOG_AUTHOR_ID || 9);
const FALLBACK_AUTHOR_MATCH = "mihael";
const FALLBACK_BLOG_HERO_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80";
const BLOG_FALLBACK_TITLE = "Blog | Explorers Way";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [myAuthorId, setMyAuthorId] = useState(BLOG_AUTHOR_ID || null);
  const [authorReady, setAuthorReady] = useState(Boolean(BLOG_AUTHOR_ID));
  const [yoastHeadJson, setYoastHeadJson] = useState(null);
  const heroImage = posts[0]?._blogCardImage || FALLBACK_BLOG_HERO_IMAGE;

  useEffect(() => {
    fetch(`${BASE_URL}v2/pages?slug=blog&_embed`)
      .then((response) => response.json())
      .then((data) => {
        const blogPage = Array.isArray(data) ? data[0] : null;
        const nextYoastHeadJson = blogPage?.yoast_head_json || null;

        if (!nextYoastHeadJson) {
          setYoastHeadJson(null);
          return;
        }

        const normalizedTitle = String(nextYoastHeadJson.title || "").trim();
        const hasTrailingSeparator = /[-|:]\s*$/.test(normalizedTitle);

        setYoastHeadJson({
          ...nextYoastHeadJson,
          title:
            !normalizedTitle || hasTrailingSeparator
              ? BLOG_FALLBACK_TITLE
              : normalizedTitle,
        });
      })
      .catch(() => setYoastHeadJson(null));
  }, []);

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
    if (!authorReady) {
      return;
    }

    if (!myAuthorId) {
      setPosts([]);
      setPageCount(0);
      return;
    }

    setLoading(true);

    const per_page = 6;

    let url =
      `${BASE_URL}v2/posts?_embed&per_page=${per_page}&page=${currentPage + 1}`;
    url += `&author=${myAuthorId}`;

    fetch(url)
      .then((response) => {
        const totalPages = response.headers.get("X-WP-TotalPages");
        setPageCount(Number(totalPages));
        return response.json();
      })
      .then(async (data) => {
        const normalizedPosts = await Promise.all(
          (Array.isArray(data) ? data : []).map((post) => mapBlogPostForCard(post))
        );
        setPosts(normalizedPosts);
      })
      .finally(() => setLoading(false));
  }, [currentPage, myAuthorId, authorReady]);

  return (
    <>
      <Yoast yoastHeadJson={yoastHeadJson} />
      {loading && <Loader />}
      <div className="blog-post">
        <section
          className="blog-modern-hero"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="blog-modern-hero-overlay">
            <div className="container">
              <div className="blog-modern-hero-content">
                <h1 className="blog-modern-title">Blog</h1>
                <p className="blog-modern-subtitle">
                  Inspiracije, vodiči i priče s putovanja koje će vam pomoći da
                  isplanirate sljedeću avanturu.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="container">
          <div className="row blog-modern-grid">
            {posts.map((post) => {
              return <BlogPost key={post.id} post={post} />;
            })}
          </div>

          <div className="blog-modern-pagination-wrap">
            <ReactPaginate
              previousLabel={"prev"}
              nextLabel={"next"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={1}
              pageRangeDisplayed={2}
              onPageChange={(e) => {
                setCurrentPage(e.selected);
                setPosts([]);
                ScrollToTop();
              }}
              containerClassName={"pagination blog-modern-pagination"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              nextClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextLinkClassName={"page-link"}
              activeClassName={"active"}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Blog;
