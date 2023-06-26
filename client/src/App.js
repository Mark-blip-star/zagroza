import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [csvFile, setCsvFile] = useState(null);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCsvFile(file);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("file", csvFile);

    fetch("http://localhost:3000/api/upload/upload-csv", {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("access_token"),
      },
      body: formData,
    })
      .then(async (response) => {
        if (response.ok) {
          const data = await response.json();
          setError(data.message);
        } else {
          const data = await response.json();
          console.log(data.message);
          throw new Error(data.message);
        }
      })
      .catch((error) => {
        console.log(error.message);
        setError(error.message);
        console.error(error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        setError("");
        setLoggedIn(true);

        const data = await response.text();
        localStorage.setItem("access_token", data);
      } else {
        throw new Error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {loggedIn ? (
          <div>
            <label>Upload CSV file:</label>
            <input type="file" accept=".csv" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            {error && <div className="error">{error}</div>}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div>
              <label>Email:</label>
              <input type="email" value={email} onChange={handleEmailChange} />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            {error && <div className="error">{error}</div>}
            <button type="submit">Login</button>
          </form>
        )}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
