// components/StringGenerator.tsx

import React, { useState, useCallback } from "react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { GeneratedString } from "../types/Index";
import "./StringGenerator.css";

interface StringGeneratorProps {
  onGenerateStrings: (limit?: number) => string[];
  className?: string;
}

export const StringGenerator: React.FC<StringGeneratorProps> = ({
  onGenerateStrings,
  className = "",
}) => {
  const [generatedStrings, setGeneratedStrings] = useState<GeneratedString[]>(
    []
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(10);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);

    // Simular un pequeño delay para mejor UX
    setTimeout(() => {
      const strings = onGenerateStrings(limit);
      const generatedWithIndex: GeneratedString[] = strings.map(
        (value, index) => ({
          value,
          index: index + 1,
        })
      );

      setGeneratedStrings(generatedWithIndex);
      setIsGenerating(false);
    }, 500);
  }, [onGenerateStrings, limit]);

  const handleClear = useCallback(() => {
    setGeneratedStrings([]);
  }, []);

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(Math.max(1, Math.min(50, newLimit))); // Límite entre 1 y 50
  }, []);

  return (
    <div className={`string-generator ${className}`}>
      <Card title="Generación de Cadenas del Lenguaje">
        <div className="string-generator__controls">
          <div className="string-generator__limit-control">
            <label htmlFor="limit-input" className="string-generator__label">
              Número de cadenas a generar:
            </label>
            <div className="string-generator__limit-input">
              <input
                id="limit-input"
                type="number"
                min="1"
                max="50"
                value={limit}
                onChange={(e) =>
                  handleLimitChange(parseInt(e.target.value) || 10)
                }
                className="string-generator__number-input"
              />
            </div>
          </div>

          <div className="string-generator__actions">
            {generatedStrings.length > 0 && (
              <Button
                variant="secondary"
                onClick={handleClear}
                disabled={isGenerating}
              >
                Limpiar
              </Button>
            )}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              size="large"
            >
              {isGenerating ? "Generando..." : `Generar ${limit} Cadenas`}
            </Button>
          </div>
        </div>
      </Card>

      {generatedStrings.length > 0 && (
        <Card
          title={`${generatedStrings.length} cadenas del lenguaje:`}
          variant="success"
          className="string-generator__results"
        >
          <div className="string-generator__grid">
            {generatedStrings.map((item) => (
              <div key={item.index} className="string-item">
                <div className="string-item__number">{item.index}</div>
                <div className="string-item__value">
                  "{item.value === "" ? "ε" : item.value}"
                </div>
                <div className="string-item__length">
                  L: {item.value.length}
                </div>
              </div>
            ))}
          </div>

          {generatedStrings.length === 0 && (
            <div className="string-generator__empty">
              <p>El lenguaje está vacío o no se pudieron generar cadenas.</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
