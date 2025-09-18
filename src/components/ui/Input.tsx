// components/ui/Input.tsx

import React from "react";
import "./Input.css";

interface InputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "number" | "email" | "password";
  disabled?: boolean;
  error?: string;
  className?: string;
  id?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  error,
  className = "",
  id,
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`input-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`input ${error ? "input--error" : ""} ${
          disabled ? "input--disabled" : ""
        }`}
      />
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};
