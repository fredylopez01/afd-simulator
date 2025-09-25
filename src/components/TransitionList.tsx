// components/TransitionList.tsx

import React from "react";
import { Transition } from "../types/Index";
import { Button } from "./ui/Button";
import "./TransitionList.css";

// Propiedades del componente para mostrar la lista de transiciones
interface TransitionListProps {
  transitions: Transition[];
  onRemove: (index: number) => void;
  className?: string;
}

export const TransitionList: React.FC<TransitionListProps> = ({
  transitions,
  onRemove,
  className = "",
}) => {
  // Mostrar mensaje cuando no hay transiciones definidas
  if (transitions.length === 0) {
    return (
      <div className={`transition-list transition-list--empty ${className}`}>
        <p className="transition-list__empty-message">
          No hay transiciones definidas. <br />
          Agrega transiciones <br />
          usando el formulario de arriba.
        </p>
      </div>
    );
  }

  return (
    <div className={`transition-list ${className}`}>
      {/* Título con contador de transiciones */}
      <h5 className="transition-list__title">
        Transiciones Definidas ({transitions.length})
      </h5>

      {/* Lista de todas las transiciones */}
      <div className="transition-list__items">
        {transitions.map((transition, index) => (
          <div key={index} className="transition-item">
            <div className="transition-item__content">
              {/* Representación matemática de la función de transición */}
              <span className="transition-item__formula">
                δ({transition.from}, {transition.symbol}) = {transition.to}
              </span>
              {/* Descripción textual de la transición */}
              <span className="transition-item__description">
                Desde <strong>{transition.from}</strong> con{" "}
                <strong>'{transition.symbol}'</strong> ir a{" "}
                <strong>{transition.to}</strong>
              </span>
            </div>

            {/* Botón para eliminar la transición */}
            <Button
              variant="danger"
              size="small"
              onClick={() => onRemove(index)}
              className="transition-item__remove"
            >
              ✕
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
