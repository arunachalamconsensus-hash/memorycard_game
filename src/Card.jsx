
// eslint-disable-next-line no-unused-vars
import React from "react";
import "./Card.css";

function Card({ card, onCardClick, disabled }) {
  const isVisible = card.isFlipped || card.isMatched;

  return (
    <button
      type="button"
      className={`memory-card ${isVisible ? "flipped" : ""} ${
        card.isMatched ? "matched" : ""
      }`}
      onClick={() => onCardClick(card.id)}
      disabled={disabled || isVisible}
    >
      <span className="card-inner">

        <span className="card-front">
          ?
        </span>

        <span className="card-back">
          {card.emoji}
        </span>

      </span>
    </button>
  );
}

export default Card;
