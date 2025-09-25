// components/StringGenerator.tsx

import { useState, useCallback } from "react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { GeneratedString } from "../types/Index";
import "./StringGenerator.css";
import { useAFD } from "../hooks/useAFD";

export function StringGenerator() {
  // Hook personalizado para acceder a las funciones del AFD
  const { generateStrings } = useAFD();

  // Estado para almacenar las cadenas generadas
  const [generatedStrings, setGeneratedStrings] = useState<GeneratedString[]>(
    []
  );

  // Estado para manejar el indicador de carga durante la generación
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Estado para controlar el número de cadenas a generar
  const [limit, setLimit] = useState<number>(10);

  // Función para generar cadenas del lenguaje
  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);

    // Simular un pequeño delay para mejor UX
    setTimeout(() => {
      const strings = generateStrings(limit);

      // Agregar índices a las cadenas generadas para su visualización
      const generatedWithIndex: GeneratedString[] = strings.map(
        (value, index) => ({
          value,
          index: index + 1,
        })
      );

      setGeneratedStrings(generatedWithIndex);
      setIsGenerating(false);
    }, 500);
  }, [generateStrings, limit]);

  // Función para limpiar las cadenas generadas
  const handleClear = useCallback(() => {
    setGeneratedStrings([]);
  }, []);

  // Función para cambiar el límite de cadenas con validación
  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(Math.max(1, Math.min(50, newLimit))); // Límite entre 1 y 50
  }, []);

  return (
    <div className="string-generator">
      <Card title="Generación de Cadenas del Lenguaje">
        <div className="string-generator__controls">
          {/* Control para establecer el número de cadenas a generar */}
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

          {/* Botones de acción */}
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

      {/* Mostrar resultados si hay cadenas generadas */}
      {generatedStrings.length > 0 && (
        <Card
          title={`${generatedStrings.length} cadenas del lenguaje:`}
          variant="success"
          className="string-generator__results"
        >
          {/* Grilla de cadenas generadas */}
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

          {/* Mensaje cuando no se generaron cadenas */}
          {generatedStrings.length === 0 && (
            <div className="string-generator__empty">
              <p>El lenguaje está vacío o no se pudieron generar cadenas.</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
