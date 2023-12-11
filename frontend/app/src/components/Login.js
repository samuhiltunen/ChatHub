import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: username, password: password })
    };

    try {
      const response = await fetch('https://auth.chathub.kontra.tel/login', options);
      if (response.ok) {
        const data = await response.json();
        console.log("OK");
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        navigate('/main');
      } else {
        console.error("Server responded with status:", response.status);
        setErr(true);
      }
    } catch (err) {
      console.error(err);
    }
  };


  return (
      <>
        <div className="header-container">
          <header>
            <h1>ChatHub</h1>
          </header>
        </div>
        <section className="login-section">
          <form>
            <h2>Login</h2>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" required="" onChange={e => setUsername(e.target.value)} />
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" required="" onChange={e => setPassword(e.target.value)} />
            {err && <p className="error">Invalid username or password</p>}
            <button type="submit" onClick={handleSubmit}>Login</button>
            <div className="register-btn-container">
              <p>Don't have an account?</p>
              <Link to="/register">
                <button>Register</button>
              </Link>
            </div>
          </form>
        </section>
      </>
  );
}