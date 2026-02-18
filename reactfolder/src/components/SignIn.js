import { Link, useNavigate } from "react-router-dom";
import "./signin.css";
import { useEffect, useState } from "react";

const SignIn = () => {
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://front2.edukacija.online/backend/wp-json/jwt-auth/v1/token",
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

      // spremanje tokena
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user_display_name);

      // redirect nakon uspješne prijave
      navigate("/", { replace: true });
      window.location.reload();

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

          <form onSubmit={handleLogin} className="signin-form">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />

            <a href="#">Forgot password?</a>

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </button>

            {error && <p className="error">{error}</p>}
          </form>

          <p className="text-center breakline">or</p>
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;