import React from 'react'

export default function Register() {
  return (
    <>
      <header>
        <h1>ChatHub</h1>
      </header>
      <section>
        <form>
          <h2>Register</h2>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" required="" />
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required="" />
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required="" />
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required=""
          />
          <button type="button" onclick="submitRegistration()">
            Register
          </button>
        </form>
      </section>
    </>

  )
}
