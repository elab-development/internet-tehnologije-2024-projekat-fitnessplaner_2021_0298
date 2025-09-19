// src/Reusable/Button.js
import React from 'react';

function Button({ text, onClick, type = 'button', icon, variant = 'primary', className = '', }) {
  return (
    <button className={`custom-button ${variant} ${className}`} onClick={onClick} type={type}>
      {icon && <img src={icon} alt="icon" className="button-icon" />}
      {text}
    </button>
  );
}

export default Button;

