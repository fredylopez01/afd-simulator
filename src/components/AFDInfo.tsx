// components/AFDInfo.tsx

import React from "react";
import { AFD } from "../types/Index";
import { Card } from "./ui/Card";
import "./AFDInfo.css";

interface AFDInfoProps {
  afd: AFD | null;
  transitionsCount: number;
  className?: string;
}

export const AFDInfo: React.FC<AFDInfoProps> = ({
  afd,
  transitionsCount,
  className = "",
}) => {
  if (!afd) {
    return (
      <Card variant="error" className={`afd-info ${className}`}>
        <div className="afd-info__empty">
          <span className="afd-info__icon">⚠️</span>
          <p className="afd-info__message">
            No hay ningún AFD definido. Ve a la pestaña "Crear AFD" para definir
            uno.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="AFD Actual" variant="info" className={`afd-info ${className}`}>
      <div className="afd-info__content">
        <div className="afd-info__row">
          <span className="afd-info__label">Estados:</span>
          <span className="afd-info__value">
            {"{" + afd.states.join(", ") + "}"}
          </span>
        </div>

        <div className="afd-info__row">
          <span className="afd-info__label">Alfabeto:</span>
          <span className="afd-info__value">
            {"{" + afd.alphabet.join(", ") + "}"}
          </span>
        </div>

        <div className="afd-info__row">
          <span className="afd-info__label">Estado Inicial:</span>
          <span className="afd-info__value afd-info__value--highlight">
            {afd.initialState}
          </span>
        </div>

        <div className="afd-info__row">
          <span className="afd-info__label">Estados de Aceptación:</span>
          <span className="afd-info__value">
            {"{" + afd.finalStates.join(", ") + "}"}
          </span>
        </div>

        <div className="afd-info__row">
          <span className="afd-info__label">Transiciones:</span>
          <span className="afd-info__value afd-info__value--count">
            {transitionsCount}
          </span>
        </div>
      </div>
    </Card>
  );
};
