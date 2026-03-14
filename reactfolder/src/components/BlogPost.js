import { Link } from "react-router-dom";
import Author from "./Author";

const toShortExcerpt = (html, maxLength = 140) => {
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

const BlogPost = ({ post }) => {
  const image =
    post._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.full
      ?.source_url || post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;

  const excerpt = toShortExcerpt(post?.excerpt?.rendered, 140);

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <article className="blog-modern-card">
        {image && (
          <Link to={"/blog/" + post.slug} className="blog-modern-card-img-wrap">
            <img src={image} className="blog-modern-card-img" alt={post.title.rendered} />
          </Link>
        )}

        <div className="blog-modern-card-body">
          <Link to={"/blog/" + post.slug} className="blog-modern-card-title-link">
            <h2 className="blog-modern-card-title">{post.title.rendered}</h2>
          </Link>

          <p className="blog-modern-card-excerpt">{excerpt}</p>

          <Link to={"/blog/" + post.slug} className="blog-modern-card-readmore">
            Pročitajte više
          </Link>

          <div className="blog-modern-card-meta">
            <Author post={post} author={false} />
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
