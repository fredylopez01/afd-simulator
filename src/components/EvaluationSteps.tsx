// components/EvaluationSteps.tsx

import React from "react";
import { EvaluationResult } from "../types/Index";
import { Card } from "./ui/Card";
import "./EvaluationSteps.css";

interface EvaluationStepsProps {
  result: EvaluationResult;
  inputString: string;
  className?: string;
}

export const EvaluationSteps: React.FC<EvaluationStepsProps> = ({
  result,
  inputString,
  className = "",
}) => {
  const displayString = inputString === "" ? "ε (cadena vacía)" : inputString;

  return (
    <Card
      variant={result.accepted ? "success" : "error"}
      title={`Evaluando la cadena: "${displayString}"`}
      className={`evaluation-steps ${className}`}
    >
      <div className="evaluation-steps__content">
        <div className="evaluation-steps__list">
          {result.steps.map((step, index) => (
            <div
              key={index}
              className={`evaluation-step ${
                step.step === 0 ? "evaluation-step--initial" : ""
              }`}
            >
              <div className="evaluation-step__number">{step.step}</div>
              <div className="evaluation-step__content">
                <p className="evaluation-step__message">{step.message}</p>
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

        <div
          className={`evaluation-result ${
            result.accepted
              ? "evaluation-result--accepted"
              : "evaluation-result--rejected"
          }`}
        >
          <div className="evaluation-result__icon">
            {result.accepted ? "✅" : "❌"}
          </div>
          <div className="evaluation-result__text">
            <strong>
              Resultado: La cadena "{displayString}" es{" "}
              {result.accepted ? "ACEPTADA" : "RECHAZADA"}
            </strong>
            {result.finalState && (
              <p className="evaluation-result__final-state">
                Estado final: <strong>{result.finalState}</strong>
              </p>
            )}
          </div>
        </div>

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
};
