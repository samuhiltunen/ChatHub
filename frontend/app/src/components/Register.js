import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/register.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const submitRegistration = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
  
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name: username, password: password})
    };
  
    try {
      const response = await fetch('https://api.chathub.kontra.tel/users/register', options);
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        navigate('/main');
      } else {
        console.error("Server responded with status:", response.status);
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
      <section className="register-section">
        <form>
          <h2>Register</h2>                               
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" required onChange={e => setUsername(e.target.value)} />
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required onChange={e => setEmail(e.target.value)} />
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required onChange={e => setPassword(e.target.value)} />
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            onChange={e => setConfirmPassword(e.target.value)}
          />
          <button type="submit" onClick={submitRegistration}>
            Register
          </button>
        </form>
      </section>
    </>
  );
}