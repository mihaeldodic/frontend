import { useState, useEffect } from "react"; 

        
        
const Naslovna = () => {

    const [page, setPosts] = useState(null);

    useEffect(
        () => {
            fetch('https://front2.edukacija.online/backend/wp-json/wp/v2/pages/727')
            .then(response => response.json())
            .then(
                (data) => {
                    setPosts(data);
                    console.log(data)
                    
                }
             )
        }, []
    )


   if(!page) return <p>Učitavanje...</p>;
    return (
        <div className="container" dangerouslySetInnerHTML={{__html: page.content.rendered}}></div>
    
   
    
    );
}

export default Naslovna;