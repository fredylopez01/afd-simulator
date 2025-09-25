// components/AFDInfo.tsx

import { Card } from "./ui/Card";
import "./AFDInfo.css";
import { useAFD } from "../hooks/useAFD";

export function AFDInfo() {
  const { currentAFD, transitions } = useAFD();
  if (!currentAFD) {
    return (
      <Card variant="error" className="afd-info">
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
    <Card title="AFD Actual" variant="info" className="afd-info">
      <div className="afd-info__content">
        <div className="afd-info__row">
          <span className="afd-info__label">Estados:</span>
          <span className="afd-info__value">
            {"{" + currentAFD.states.join(", ") + "}"}
          </span>
        </div>

        <div className="afd-info__row">
          <span className="afd-info__label">Alfabeto:</span>
          <span className="afd-info__value">
            {"{" + currentAFD.alphabet.join(", ") + "}"}
          </span>
        </div>

        <div className="afd-info__row">
          <span className="afd-info__label">Estado Inicial:</span>
          <span className="afd-info__value afd-info__value--highlight">
            {currentAFD.initialState}
          </span>
        </div>

        <div className="afd-info__row">
          <span className="afd-info__label">Estados de Aceptación:</span>
          <span className="afd-info__value">
            {"{" + currentAFD.finalStates.join(", ") + "}"}
          </span>
        </div>

        <div className="afd-info__row">
          <span className="afd-info__label">Transiciones:</span>
          <span className="afd-info__value afd-info__value--count">
            {transitions.length}
          </span>
        </div>
      </div>
    </Card>
  );
}
