// src/Reusable/Button.js
import React from 'react';

function Button({ text, onClick, type = 'button', icon, variant = 'primary' }) {
  return (
    <button className={`custom-button ${variant}`} onClick={onClick} type={type}>
      {icon && <img src={icon} alt="icon" className="button-icon" />}
      {text}
    </button>
  );
}

export default Button;

