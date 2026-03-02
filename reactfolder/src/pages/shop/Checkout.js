import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
  }, []);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0,
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.address) {
      alert("Molimo ispunite sva polja");
      return;
    }

    setLoading(true);
    const currentCart = [...cartItems];

    // 🔢 Random ID narudžbe
    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);

    // 🖼️ HTML proizvoda sa slikama
    const orderDetailsHTML = currentCart
      .map(
        (item) => `
    <div style="display:flex; align-items:center; margin-bottom:15px;">
      <img src="${item.image || item.images?.[0]}" 
           style="width:60px;height:60px;object-fit:cover;border-radius:8px;margin-right:12px;" />
      <div>
        <strong>${item.title}</strong><br/>
        Količina: ${item.quantity}<br/>
        Cijena: ${item.price * item.quantity} EUR
      </div>
    </div>
  `,
      )
      .join("");

    try {
      const results = await Promise.allSettled([
        emailjs.send(
          "service_97u9bj7",
          "template_dc4l4ga",
          {
            order_id: orderId,
            user_name: formData.name,
            user_email: formData.email,
            user_address: formData.address,
            order_details: orderDetailsHTML,
            total_price: totalPrice,
          },
          { publicKey: "hYTEnnh516nSj-76R" },
        ),

        emailjs.send(
          "service_97u9bj7",
          "template_customer_confirmation",
          {
            order_id: orderId,
            user_name: formData.name,
            user_email: formData.email,
            user_address: formData.address,
            order_details: orderDetailsHTML,
            total_price: totalPrice,
          },
          { publicKey: "hYTEnnh516nSj-76R" },
        ),
      ]);

      console.log(results);

      const adminStatus = results[0].status;
      const customerStatus = results[1].status;

      if (adminStatus === "fulfilled") {
        alert(`Narudžba ${orderId} uspješna! 🎉`);
        localStorage.removeItem("cart");
        navigate("/shop");
      } else {
        alert("Došlo je do greške pri slanju admin maila.");
      }

      if (customerStatus === "rejected") {
        console.log("Customer mail failed:", results[1].reason);
      }
    } catch (error) {
      console.log("Neočekivana greška:", error);
      alert("Greška pri slanju maila.");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Checkout</h1>

      <div className="row">
        {/* Forma */}
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Ime i prezime</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Adresa</label>
              <textarea
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-success"
              disabled={loading}
            >
              {loading ? "Šalje se..." : "Potvrdi narudžbu"}
            </button>
          </form>
        </div>

        {/* Sažetak */}
        <div className="col-md-6">
          <h4>Sažetak narudžbe</h4>
          <ul className="list-group mb-3">
            {cartItems.map((item) => (
              <li
                key={item.id}
                className="list-group-item d-flex align-items-center justify-content-between"
              >
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={item.image || item.images?.[0]}
                    alt={item.title}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />

                  <span>
                    {item.title} x {item.quantity}
                  </span>
                </div>

                <span>{item.price * item.quantity} EUR</span>
              </li>
            ))}
          </ul>

          <h5>Ukupno: {totalPrice} EUR</h5>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
