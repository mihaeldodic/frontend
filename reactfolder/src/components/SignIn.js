import { Link, Navigate } from "react-router-dom";
import "./signin.css";
import { useState } from "react";

const SignIn = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  console.log(form);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://front2.edukacija.online/backend/wp-json/jwt-auth/v1/token",
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(form),
        },
      );

      const data = await response.json();

      setLoading(false);

      console.log(data);

      if (data?.code) {
        setError("Wrong Email or password");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user_display_name);

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
          <img src="" alt="" />
        </div>
        <div className="col-md-6 profile-right">
          <h2>Welcome back</h2>
          <p>Lorem ipsum dolor sit amet.</p>
          <form onSubmit={handleLogin} className="signin-form">
            <label htmlFor="">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
            />
            <label htmlFor="">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
            <a href="#">Forgot password?</a>
            <button type="submit">Log in</button>
            <p>{error}</p>
          </form>

          <p className="text-center breakline">or</p>
          <p>
            Don't have an account? <Link>Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;