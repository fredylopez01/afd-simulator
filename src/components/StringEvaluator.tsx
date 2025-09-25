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
  // Hook personalizado para acceder a las funciones del AFD
  const { evaluateString } = useAFD();

  // Estado para la cadena de entrada
  const [inputString, setInputString] = useState<string>("");

  // Estado para almacenar el resultado de la evaluación
  const [evaluationResult, setEvaluationResult] =
    useState<EvaluationResult | null>(null);

  // Estado para manejar el indicador de carga durante la evaluación
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);

  // Función para evaluar la cadena ingresada
  const handleEvaluate = useCallback(async () => {
    // Validar que la cadena no esté vacía
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

  // Función para limpiar el formulario y resultados
  const handleClear = useCallback(() => {
    setInputString("");
    setEvaluationResult(null);
  }, []);

  return (
    <div className="string-evaluator">
      <Card title="Evaluación de Cadenas">
        <div className="string-evaluator__form">
          {/* Campo de entrada para la cadena a evaluar */}
          <Input
            label="Cadena a evaluar"
            value={inputString}
            onChange={setInputString}
            placeholder="Ingrese la cadena (ej: 101)"
          />

          {/* Botones de acción */}
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

      {/* Mostrar los pasos de evaluación si hay resultado */}
      {evaluationResult && (
        <EvaluationSteps result={evaluationResult} inputString={inputString} />
      )}
    </div>
  );
}
