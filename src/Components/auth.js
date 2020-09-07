import React, { useState, useEffect } from 'react';
import { API } from '../api-service';
import { useCookies } from 'react-cookie';

function Auth() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginView, setIsLoginView] = useState(true);

  const [token, setToken] = useCookies(['movieapp-token']);

  useEffect(() => {
    console.log(token);
    if (token['movieapp-token']) window.location.href = '/index';
  }, [token]);

  const loginClicked = () => {
    console.log(username, password);
    API.loginUser({ username, password })
      .then((resp) => setToken('movieapp-token', resp.token))
      .catch((err) => console.log(err));
  };

  const registerClicked = () => {
    API.registerUser({ username, password })
      .then(() => loginClicked())
      .catch((err) => console.log(err));
  };

  const isDisabled = username.length === 0 || password.length === 0;

  return (
    <div className="App">
      <header className="App-header">
        {isLoginView ? <h1>Login</h1> : <h1>Register</h1>}
      </header>
      <div className="login-container">
        <label htmlFor="username">Username</label>
        <br />
        <input
          id="username"
          type="text"
          placeholder="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <br />
        <label htmlFor="password">Password</label>
        <br />
        <input
          id="password"
          type="password"
          placeholder="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <br />
        {isLoginView ? (
          <button onClick={loginClicked} disabled={isDisabled}>
            Login
          </button>
        ) : (
          <button onClick={registerClicked} disabled={isDisabled}>
            Register
          </button>
        )}
        {isLoginView ? (
          <p onClick={() => setIsLoginView(false)}>
            You don't have an account? Register here!
          </p>
        ) : (
          <p onClick={() => setIsLoginView(true)}>
            You already have an account? Login here!
          </p>
        )}
      </div>
    </div>
  );
}

export default Auth;
