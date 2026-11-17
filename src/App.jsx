
// eslint-disable-next-line no-unused-vars
import React from "react";
import Game from "./Game";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="header-icon">🧠</div>
        <h1>Memory Match</h1>
        <p>Train your brain. Match all the pairs!</p>
      </header>

      <main className="main-content">
        <Game />
      </main>

      <footer className="footer">
        <p>React Memory Card Game | Built with React Hooks</p>
      </footer>
    </div>
  );
}

export default App;
