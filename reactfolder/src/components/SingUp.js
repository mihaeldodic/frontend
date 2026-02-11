import { Link, useNavigate } from "react-router-dom";
import "./signin.css";
import { useEffect, useState } from "react";

const SignUp = () => {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
  });

  // Ako je korisnik već prijavljen → redirect na home
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://front2.edukacija.online/backend/wp-json/wp/v2/users/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();
      setLoading(false);

      if (data?.code) {
        setError("Wrong Email or password");
        return;
      }

      // redirect nakon uspješne prijave
      navigate("/signin", { replace: true });

    } catch (error) {
      setLoading(false);
      setError("Something went wrong. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="d-none d-md-flex col-md-6 profile-left">
          <h1>ENJOY THE</h1>
          <img src="/img/header/logo_light.svg" alt="" />
        </div>

        <div className="col-md-6 profile-right">
          <h2>Welcome back</h2>
          <p>Lorem ipsum dolor sit amet.</p>

          <form onSubmit={handleRegister} className="signin-form">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
            />

            <label>E-mail address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />

            <button type="submit" disabled={loading}>
              {loading ? "Registration..." : "Sign Up"}
            </button>

            {error && <p className="error">{error}</p>}
          </form>

          <p className="text-center breakline">or</p>
          <p>
            Already have an account? <Link to="/signin">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;