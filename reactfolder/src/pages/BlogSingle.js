import { useState, useEffect } from "react"; 

//import "./Blog.css"
import post from "../components/zadaci/data/blogsingle.json";
        
        
const BlogSingle = () => {

    const [posts, setPosts] = useState(null);

    useEffect(
        () => {
            fetch('https://front2.edukacija.online/backend/wp-json/wp/v2/posts/680?_embed')
            .then(response => response.json())
            .then(
                (data) => {
                    setPosts(data);
                    console.log(data)
                    
                }
             )
        }, []
    )


   if(post) return <p>Učitavanje...</p>;
    return (
        <div dangerouslySetInnerHTML={{__html: post.content.rendered}}></div>
    
   
    
    );
}

export default BlogSingle;