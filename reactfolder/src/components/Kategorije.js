import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "./Loader";

const Kategorije = () => {
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetch("https://front2.edukacija.online/backend/wp-json/wp/v2/categories")
      .then((response) => response.json())
      .then((data) => setCategory(data));
  }, []);

  useEffect(() => {
    if (!selectedCategory) return;
    setLoading(true);
    fetch(
      `https://front2.edukacija.online/backend/wp-json/wp/v2/posts?categories=${selectedCategory}&_embed`,
    )
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  console.log(posts);

  const handleCategoryChange = (e) => {
    setSelectedCategory(Number(e.target.value));
    setPosts([]);
  };

  return (
    <>
      {loading && <Loader />}
      <div className="container blog-page">
        <div className="row">
          <div className="col-12 d-flex justify-content-center mt-5">
            <select value={selectedCategory} onChange={handleCategoryChange}>
              <option value="" disabled>
                Odaberi kategoriju
              </option>
              {category.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="row">
        {posts.map((post) => {
          const image =
            post._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes
              ?.full?.source_url;
          return (
            <div key={post.id} className="col-md-4 mb-4 blog-post">
              {image && (
                <img src={image} className="mb-3" alt={post.title.rendered} />
              )}
              <h2>{post.title.rendered}</h2>
              <div
                dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
              />
              <p>
                {post._embedded?.author?.[0]?.name} |{" "}
                {new Date(post.date).toLocaleDateString("hr-HR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Kategorije;
