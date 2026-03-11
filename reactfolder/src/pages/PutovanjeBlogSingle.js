import "./Blog.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";

//import "./Blog.css"
//import post from "../components/zadaci/data/blogsingle.json";

const BASE_URL = process.env.REACT_APP_API_URL;

const PutovanjeBlogSingle = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(
      `${BASE_URL}v2/putovanje?slug=${slug}&_embed`,
    )
      .then((response) => response.json())
      .then((data) => setPost(data[0]));
  }, [slug]);

  if (!post) {
    return <Loader />;
  }

  return (
    <div className="blog-single">
      <div
        class="masthead"
        style={{
          backgroundImage:
            "url(" +
            post._embedded["wp:featuredmedia"][0].media_details.sizes.full
              .source_url +
            ")",
        }}
      >
        <div class="container position-relative px-4 px-lg-5">
          <div class="row gx-4 gx-lg-5 justify-content-center">
            <div class="col-md-10 col-lg-8 col-xl-7">
              <div class="post-heading">
                <h1>{post.title.rendered}</h1>
                <h2 class="subheading">Naslov</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      <article class="mb-4">
        <div class="container px-4 px-lg-5">
          <div class="row gx-4 gx-lg-5 justify-content-center">
            <div class="col-md-10 col-lg-8 col-xl-7">
              <div
                dangerouslySetInnerHTML={{ __html: post.content.rendered }}
              ></div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default PutovanjeBlogSingle;
