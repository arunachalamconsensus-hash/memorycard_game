
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import Card from "./Card";
import "./Game.css";

const emojis = [
  "🍎",
  "🍌",
  "🍇",
  "🍓",
  "🍉",
  "🍍",
  "🥝",
  "🍒"
];

const GAME_TIME = 120;

// Create and shuffle cards
function createCards() {
  const cardList = [...emojis, ...emojis];

  const shuffledCards = cardList
    .map((emoji, index) => ({
      id: index + 1,
      emoji: emoji,
      isFlipped: false,
      isMatched: false
    }))
    .sort(() => Math.random() - 0.5);

  return shuffledCards;
}

function Game() {

  // State variables
  const [cards, setCards] = useState(() => createCards());
  const [selectedCards, setSelectedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [resetCount, setResetCount] = useState(0);

  // Derived values (No additional useState required)
  const gameWon = cards.every((card) => card.isMatched);
  const gameOver = timeLeft === 0 && !gameWon;
  const isChecking = selectedCards.length === 2;

  // Countdown timer
  useEffect(() => {

    if (gameWon) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previousTime) => {
        return previousTime > 0
          ? previousTime - 1
          : 0;
      });
    }, 1000);

    return () => clearInterval(timer);

  }, [gameWon, resetCount]);


  // Automatically flip unmatched cards back
  useEffect(() => {

    if (selectedCards.length !== 2) {
      return;
    }

    const firstCard = cards.find(
      (card) => card.id === selectedCards[0]
    );

    const secondCard = cards.find(
      (card) => card.id === selectedCards[1]
    );

    if (!firstCard || !secondCard) {
      return;
    }

    const timer = setTimeout(() => {

      if (firstCard.emoji === secondCard.emoji) {

        // Matching cards
        setCards((previousCards) =>
          previousCards.map((card) =>
            card.id === firstCard.id ||
            card.id === secondCard.id
              ? { ...card, isMatched: true }
              : card
          )
        );

        setScore((previousScore) => previousScore + 10);

      } else {

        // Non-matching cards
        setCards((previousCards) =>
          previousCards.map((card) =>
            card.id === firstCard.id ||
            card.id === secondCard.id
              ? { ...card, isFlipped: false }
              : card
          )
        );

      }

      setSelectedCards([]);

    }, 800);

    return () => clearTimeout(timer);

  }, [selectedCards, cards]);


  // Handle card click
  const handleCardClick = (id) => {

    if (
      isChecking ||
      gameOver ||
      gameWon
    ) {
      return;
    }

    const clickedCard = cards.find(
      (card) => card.id === id
    );

    if (
      clickedCard.isFlipped ||
      clickedCard.isMatched
    ) {
      return;
    }

    // Flip selected card
    setCards((previousCards) =>
      previousCards.map((card) =>
        card.id === id
          ? { ...card, isFlipped: true }
          : card
      )
    );

    // Store selected card ID
    setSelectedCards((previousCards) => [
      ...previousCards,
      id
    ]);

    // Increase moves
    setMoves((previousMoves) => previousMoves + 1);

  };


  // Restart game
  const handleRestart = () => {

    setCards(createCards());
    setSelectedCards([]);
    setMoves(0);
    setScore(0);
    setTimeLeft(GAME_TIME);

    setResetCount((previousCount) => previousCount + 1);

  };


  // Timer formatting
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Matched pairs count
  const matchedPairs = cards.filter(
    (card) => card.isMatched
  ).length / 2;


  return (
    <section className="game-container">

      {/* Game Heading */}
      <div className="game-heading">

        <div>
          <span className="level-badge">
            MEDIUM LEVEL
          </span>

          <h2>Find the Matching Pairs</h2>

          <p>
            Flip two cards and find identical emojis.
          </p>
        </div>

        <button
          className="restart-btn"
          onClick={handleRestart}
        >
          ↻ Restart
        </button>

      </div>


      {/* Game Statistics */}
      <div className="stats-container">

        <div className="stat-card">
          <span className="stat-icon">🎯</span>

          <div>
            <p>Score</p>
            <h3>{score}</h3>
          </div>
        </div>


        <div className="stat-card">
          <span className="stat-icon">🔄</span>

          <div>
            <p>Moves</p>
            <h3>{moves}</h3>
          </div>
        </div>


        <div className="stat-card">
          <span className="stat-icon">⏱️</span>

          <div>
            <p>Time Left</p>

            <h3 className={timeLeft <= 15 ? "time-warning" : ""}>
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </h3>
          </div>
        </div>


        <div className="stat-card">
          <span className="stat-icon">🏆</span>

          <div>
            <p>Matched</p>
            <h3>{matchedPairs}/8</h3>
          </div>
        </div>

      </div>


      {/* Game Board */}
      <div className="game-board">

        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onCardClick={handleCardClick}
            disabled={isChecking || gameOver || gameWon}
          />
        ))}

      </div>


      {/* Winning Message */}
      {gameWon && (

        <div className="result-message win-message">

          <div className="result-icon">🎉</div>

          <h2>Congratulations!</h2>

          <p>
            You matched all 8 pairs successfully.
          </p>

          <p>
            Final Score: <strong>{score}</strong>
          </p>

          <p>
            Total Moves: <strong>{moves}</strong>
          </p>

          <button onClick={handleRestart}>
            Play Again
          </button>

        </div>

      )}


      {/* Game Over Message */}
      {gameOver && (

        <div className="result-message lose-message">

          <div className="result-icon">⏰</div>

          <h2>Time's Up!</h2>

          <p>
            Don't worry! Try again and beat the timer.
          </p>

          <p>
            Your Score: <strong>{score}</strong>
          </p>

          <button onClick={handleRestart}>
            Try Again
          </button>

        </div>

      )}


      {/* Instructions */}
      <div className="game-instructions">

        <h3>How to Play?</h3>

        <p>
          🃏 Click any two cards to reveal their emojis.
          If they match, you earn 10 points. If not,
          they will flip back automatically.
        </p>

        <p>
          ⏱️ Complete all 8 pairs within 90 seconds!
        </p>

      </div>

    </section>
  );
}

export default Game;
