import React from 'react'
import { Link } from 'react-router-dom'
import '../css/main.css'

export default function login() {
    return (
        <>
            <header>
                <h1>ChatHub</h1>
            </header>
            <section>
                <form>
                    <h2>Login</h2>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" required="" />
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required="" />
                    <button type="button">Login</button>
                    <div className='register-btn-container'>
                        <p>Don't have an account?</p>
                        <Link to="/register">
                            <button>Register</button>
                        </Link>
                    </div>

                </form>

            </section>
        </>

    )
}
