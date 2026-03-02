import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
  }, []);

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0,
  );

  if (cartItems.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h2>Košarica je prazna</h2>
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/shop")}
        >
          Nastavi s kupovinom
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Tvoja Košarica</h1>

      {cartItems.map((item) => (
        <div className="card mb-3" key={item.id}>
          <div className="row g-0 align-items-center p-3">
            <div className="col-md-2">
              <img
                src={item.images[0]}
                alt={item.title}
                className="img-fluid"
              />
            </div>

            <div className="col-md-4">
              <h5>{item.title}</h5>
            </div>

            <div className="col-md-2">
              <p>{item.price} EUR</p>
            </div>

            <div className="col-md-2">
              <p>Količina: {item.quantity}</p>
            </div>

            <div className="col-md-2 text-end">
              <button
                className="btn btn-danger"
                onClick={() => removeFromCart(item.id)}
              >
                Ukloni
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="d-flex justify-content-between align-items-center mt-4">
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate("/shop")}
        >
          Nastavi s kupovinom
        </button>

        <div className="text-end">
          <h4>Ukupno: {totalPrice} EUR</h4>
          <button
            type="button"
            className="btn btn-success mt-2"
            onClick={() => navigate("/checkout")}
          >
            Odi na plaćanje
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
