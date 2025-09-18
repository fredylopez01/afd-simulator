// components/ui/Card.tsx

import React from "react";
import "./Card.css";

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  variant?: "default" | "success" | "error" | "warning" | "info";
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  variant = "default",
  className = "",
  onClick,
}) => {
  const baseClasses = "card";
  const variantClass = `card--${variant}`;
  const clickableClass = onClick ? "card--clickable" : "";

  const classes = [baseClasses, variantClass, clickableClass, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} onClick={onClick}>
      {(title || subtitle) && (
        <div className="card__header">
          {title && <h3 className="card__title">{title}</h3>}
          {subtitle && <p className="card__subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="card__content">{children}</div>
    </div>
  );
};
