import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/main.css";
import { faLock, faUser, faEnvelope} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState(false);
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
        navigate('/');
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
          <form id={"register-form"}>
            <h2>Register</h2>

            <div className={"form-input-container"}>
              <FontAwesomeIcon icon={faUser} size={"2x"}></FontAwesomeIcon>
            <input placeholder={"Username"} type="text" id="username" name="username" required onChange={e => setUsername(e.target.value)} />
          </div>
            <div className={"form-input-container"}>
              <FontAwesomeIcon icon={faEnvelope} size={"2x"}></FontAwesomeIcon>
            <input placeholder={"Email"} type="email" id="email" name="email" />
              </div>

            <div className={"form-input-container"}>
              <FontAwesomeIcon icon={faLock} size={"2x"}></FontAwesomeIcon>
            <input placeholder={"Password"} type="password" id="password" name="password" required onChange={e => setPassword(e.target.value)} />
            </div>

            <div className={"form-input-container"}>
              <FontAwesomeIcon icon={faLock} size={"2x"}></FontAwesomeIcon>
              <input
                placeholder={"Confirm Password"}
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                onChange={e => setConfirmPassword(e.target.value)}
            />
              </div>
            {err && <p className="error-register">Check the inputs!</p>}
            <button type="submit" onClick={submitRegistration}>
              Register
            </button>
          </form>
        </section>
      </>
  );
}