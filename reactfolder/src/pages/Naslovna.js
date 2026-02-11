import { useState, useEffect } from "react";

const Naslovna = () => {
    
  const [page, setPage] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await fetch(
          "https://front2.edukacija.online/backend/wp-json/wp/v2/pages/727",
        );
        if (!response.ok) {
          throw new Error("Ne mogu povući podatke");
        }
        const data = await response.json();
        setPage(data);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchPage();
  }, []);

  if (!page) return <p>Učitavanje...</p>;

  return (
    <div dangerouslySetInnerHTML={{ __html: page.content.rendered }}></div>
  );
};

export default Naslovna;
