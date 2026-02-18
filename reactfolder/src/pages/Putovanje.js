import { useState, useEffect } from "react";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

import "./Blog.css";
//import posts from "../components/zadaci/data/blog.json";

const BASE_URL = process.env.REACT_APP_API_URL;

const Putovanje = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const [putovanja, setPutovanja] = useState ([]);
  const [svaPutovanja, setSvaPutovanja] = useState ("")

  console.log("članci", posts);
  console.log("učitavanje", loading);
  console.log("stranica", page);

  useEffect(() =>{
    fetch(`${BASE_URL}v2/destinacije`)
    .then((response) =>response.json())
    .then((data) => setPutovanja(data));
  }, [])



  useEffect(() => {
    setLoading(true);

    let url = "https://front2.edukacija.online/backend/wp-json/wp/v2/putovanje?_embed";
    if (svaPutovanja) url += "&destinacije=" + svaPutovanja;
 
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
      })
      .finally(() => setLoading(false));
  }, [svaPutovanja]);

  return (
    <>
      {loading && <Loader />}
      <div className="blog-post">
        <div className="container">
          <h1>Putovanja</h1>
          <div className="row">
            <div className="col-6">
              <select value={svaPutovanja} onChange={(e) => setSvaPutovanja(e.target.value)}>
                <option value="">Sva putovanja</option>
                {putovanja.map((putovanje) =>(
                  <option key={putovanje.id} value={putovanje.id}>{putovanje.name}</option>
                ))}
              </select>
            </div>
          </div>



          <div className="row">
            {posts.map((post) => {
              const image =
                post._embedded?.["wp:featuredmedia"]?.[0]?.media_details.sizes
                  ?.full?.source_url;
              return (
                <div key={post.id} className="col-md-4 mb-4 blog-post">

                <Link to={'/putovanje/' + post.slug}>
                  {image && (
                    <img
                      src={image}
                      className="mb-3"
                      alt={post.title.rendered}
                    />
                  )}
                    </Link>
                    <Link to={'/putovanje/' + post.slug}>
                  <h2>{post.title.rendered}</h2>
                    </Link>
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
        </div>
      </div>
    </>
  );
};

export default Putovanje;
