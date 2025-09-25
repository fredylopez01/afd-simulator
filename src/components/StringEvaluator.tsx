// components/StringEvaluator.tsx

import { useState, useCallback } from "react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { EvaluationResult } from "../types/Index";
import "./StringEvaluator.css";
import { EvaluationSteps } from "./EvaluationSteps";
import { useAFD } from "../hooks/useAFD";

export function StringEvaluator() {
  const { evaluateString } = useAFD();
  const [inputString, setInputString] = useState<string>("");
  const [evaluationResult, setEvaluationResult] =
    useState<EvaluationResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  const handleEvaluate = useCallback(async () => {
    if (!inputString.trim()) {
      setEvaluationResult(null);
      return;
    }

    setIsEvaluating(true);

    // Simular un pequeño delay para mejor UX
    setTimeout(() => {
      const result = evaluateString(inputString);
      setEvaluationResult(result);
      setIsEvaluating(false);
    }, 300);
  }, [inputString, evaluateString]);

  const handleClear = useCallback(() => {
    setInputString("");
    setEvaluationResult(null);
  }, []);

  return (
    <div className="string-evaluator">
      <Card title="Evaluación de Cadenas">
        <div className="string-evaluator__form">
          <Input
            label="Cadena a evaluar"
            value={inputString}
            onChange={setInputString}
            placeholder="Ingrese la cadena (ej: 101)"
          />

          <div className="string-evaluator__actions">
            <Button
              onClick={handleEvaluate}
              disabled={!inputString.trim() || isEvaluating}
              size="large"
            >
              {isEvaluating ? "Evaluando..." : "Evaluar Cadena"}
            </Button>

            <Button
              variant="secondary"
              onClick={handleClear}
              disabled={!inputString && !evaluationResult}
            >
              Limpiar
            </Button>
          </div>
        </div>
      </Card>

      {evaluationResult && (
        <EvaluationSteps result={evaluationResult} inputString={inputString} />
      )}
    </div>
  );
}
