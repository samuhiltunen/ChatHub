import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../css/main.css";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { handleLogin } from "../functions/handleLogin";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(false);
  let navigate = useNavigate();

  return (
    <>
      <div className="header-container">
        <header>
          <h1>ChatHub</h1>
        </header>
      </div>
      <section className="login-section">
        <form id={'login-form'}>
          <h2>Login</h2>

          <div className={"form-input-container"}>
            <FontAwesomeIcon icon={faUser} size={"2x"}></FontAwesomeIcon>
            <input placeholder={"Username"} type="text" id="username" name="username" required="" onChange={e => setUsername(e.target.value)} />
          </div>

          <div className={"form-input-container"}>
            <FontAwesomeIcon icon={faLock} size={"2x"}></FontAwesomeIcon>
            <input placeholder={"Password"} type="password" id="password" name="password" required="" onChange={e => setPassword(e.target.value)} />

          </div>
          {err && <p className="error">Invalid username or password!</p>}
          <button type="submit" onClick={(e) => {
            e.preventDefault();
            handleLogin(username, password, setErr, navigate);
          }}>Login</button>
          <p>Don't have an account?<Link to={'/register'}> <a >Register</a></Link> </p>
        </form>
      </section>
    </>
  );
}