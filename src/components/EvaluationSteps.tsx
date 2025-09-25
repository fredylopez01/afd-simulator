// components/EvaluationSteps.tsx

import { EvaluationResult } from "../types/Index";
import { Card } from "./ui/Card";
import "./EvaluationSteps.css";

// Propiedades del componente para mostrar los pasos de evaluación
interface EvaluationStepsProps {
  result: EvaluationResult;
  inputString: string;
  className?: string;
}

export function EvaluationSteps({
  result,
  inputString,
  className = "",
}: EvaluationStepsProps) {
  // Formatear la cadena para mostrar, incluyendo el símbolo épsilon para cadena vacía
  const displayString = inputString === "" ? "ε (cadena vacía)" : inputString;

  return (
    <Card
      variant={result.accepted ? "success" : "error"}
      title={`Evaluando la cadena: "${displayString}"`}
      className={`evaluation-steps ${className}`}
    >
      <div className="evaluation-steps__content">
        {/* Lista de pasos de evaluación */}
        <div className="evaluation-steps__list">
          {result.steps.map((step, index) => (
            <div
              key={index}
              className={`evaluation-step ${
                step.step === 0 ? "evaluation-step--initial" : ""
              }`}
            >
              {/* Número del paso */}
              <div className="evaluation-step__number">{step.step}</div>
              <div className="evaluation-step__content">
                {/* Mensaje descriptivo del paso */}
                <p className="evaluation-step__message">{step.message}</p>

                {/* Detalles de la transición si existe símbolo */}
                {step.symbol && (
                  <div className="evaluation-step__transition">
                    <span className="evaluation-step__current-state">
                      Estado actual: <strong>{step.state}</strong>
                    </span>
                    <span className="evaluation-step__symbol">
                      Símbolo: <strong>'{step.symbol}'</strong>
                    </span>
                    {step.nextState && (
                      <span className="evaluation-step__next-state">
                        Siguiente estado: <strong>{step.nextState}</strong>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Resultado final de la evaluación */}
        <div
          className={`evaluation-result ${
            result.accepted
              ? "evaluation-result--accepted"
              : "evaluation-result--rejected"
          }`}
        >
          {/* Ícono visual del resultado */}
          <div className="evaluation-result__icon">
            {result.accepted ? "✅" : "❌"}
          </div>
          <div className="evaluation-result__text">
            <strong>
              Resultado: La cadena "{displayString}" es{" "}
              {result.accepted ? "ACEPTADA" : "RECHAZADA"}
            </strong>
            {/* Mostrar estado final si está disponible */}
            {result.finalState && (
              <p className="evaluation-result__final-state">
                Estado final: <strong>{result.finalState}</strong>
              </p>
            )}
          </div>
        </div>

        {/* Mostrar errores si ocurrieron durante la evaluación */}
        {result.error && (
          <div className="evaluation-error">
            <div className="evaluation-error__icon">⚠️</div>
            <div className="evaluation-error__message">
              <strong>Error:</strong> {result.error}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
