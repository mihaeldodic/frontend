import "./Blog.css"
import posts from "../components/zadaci/data/blog.json";

const Blog = () => {
    return (
    <div className="blog-post">
        <div className="container">
            <h1>Blog</h1>
            <div className="row">
                {posts.map((post) => (
                    <div className="col-md-4 mb-4">
                        <img src={post._embedded["wp:featuredmedia"][0].media_details.sizes.full.source_url}/>
                        <h2>{post.title.rendered}</h2>
                        <div dangerouslySetInnerHTML={{ __html: post.excerpt.rendered}}></div>
                        
                        <p>{post._embedded.author[0].name} | vrijeme objave {new Date(post.date).toLocaleString("hr-HR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                                })}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
    );
};

export default Blog;