// components/FileManager.tsx

import React, { useState, useCallback, useRef } from "react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { AFDDefinition } from "../types/Index";
import "./FileManager.css";
import { useAFD } from "../hooks/useAFD";

export function FileManager() {
  // Hook personalizado para acceder a las funciones del AFD
  const { saveAFD, loadAFD, isCreated } = useAFD();

  // Estado para mostrar mensajes de resultado
  const [result, setResult] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Referencia para el input de archivo (hidden)
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Función para guardar el AFD actual como archivo JSON
  const handleSave = useCallback(() => {
    try {
      // Verificar que existe un AFD para guardar
      if (!isCreated) {
        setResult({
          message: "No hay ningún AFD definido para guardar",
          type: "error",
        });
        return;
      }

      // Obtener los datos del AFD
      const afdData = saveAFD();
      if (!afdData) {
        setResult({
          message: "Error al obtener los datos del AFD",
          type: "error",
        });
        return;
      }

      // Crear y descargar archivo
      const blob = new Blob([afdData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `afd-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setResult({ message: "AFD guardado exitosamente", type: "success" });
    } catch (error) {
      setResult({ message: "Error al guardar el archivo", type: "error" });
    }
  }, [isCreated, saveAFD]);

  // Función para activar el selector de archivos
  const handleLoadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Función para procesar el archivo cargado
  const handleFileLoad = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validar que sea un archivo JSON
      if (!file.name.endsWith(".json")) {
        setResult({
          message: "Por favor selecciona un archivo JSON válido",
          type: "error",
        });
        return;
      }

      // Leer el contenido del archivo
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const afdData = JSON.parse(content) as AFDDefinition;

          // Cargar el AFD desde los datos del archivo
          const result = loadAFD(afdData);

          if (result.success) {
            setResult({ message: "AFD cargado exitosamente", type: "success" });
          } else {
            setResult({
              message: result.error || "Error al cargar el AFD",
              type: "error",
            });
          }
        } catch (error) {
          setResult({
            message: "Error al procesar el archivo JSON",
            type: "error",
          });
        }
      };

      reader.onerror = () => {
        setResult({ message: "Error al leer el archivo", type: "error" });
      };

      reader.readAsText(file);

      // Limpiar el input para permitir cargar el mismo archivo otra vez
      event.target.value = "";
    },
    [loadAFD]
  );

  // Función para limpiar mensajes de resultado
  const handleClearResult = useCallback(() => {
    setResult(null);
  }, []);

  return (
    <div className="file-manager">
      <Card title="Gestión de Archivos">
        <div className="file-manager__content">
          {/* Descripción del componente */}
          <div className="file-manager__description">
            <p>
              Guarda tu AFD actual en un archivo JSON para poder cargarlo
              posteriormente, o carga un AFD previamente guardado.
            </p>
          </div>

          {/* Botones de acción principal */}
          <div className="file-manager__actions">
            {/* Sección para guardar AFD */}
            <div className="file-manager__save">
              <Button
                onClick={handleSave}
                disabled={!isCreated}
                size="large"
                className="file-manager__save-btn"
              >
                📥 Guardar AFD
              </Button>
              <p className="file-manager__help-text">
                {isCreated
                  ? "Descargar el AFD actual como archivo JSON"
                  : "Crea un AFD primero para poder guardarlo"}
              </p>
            </div>

            {/* Divisor visual */}
            <div className="file-manager__divider">
              <span>o</span>
            </div>

            {/* Sección para cargar AFD */}
            <div className="file-manager__load">
              <Button
                onClick={handleLoadClick}
                variant="secondary"
                size="large"
                className="file-manager__load-btn"
              >
                📤 Cargar AFD
              </Button>
              <p className="file-manager__help-text">
                Seleccionar un archivo JSON con un AFD guardado
              </p>
            </div>
          </div>

          {/* Input de archivo oculto */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileLoad}
            style={{ display: "none" }}
          />
        </div>
      </Card>

      {/* Mostrar mensajes de resultado */}
      {result && (
        <Card variant={result.type} className="file-manager__result">
          <div className="file-manager__result-content">
            <div className="file-manager__result-message">{result.message}</div>
            <Button
              variant="secondary"
              size="small"
              onClick={handleClearResult}
              className="file-manager__close-btn"
            >
              ✕
            </Button>
          </div>
        </Card>
      )}

      {/* Información sobre el formato de archivo */}
      <Card variant="info" className="file-manager__info">
        <div className="file-manager__format-info">
          <h4>Formato del archivo</h4>
          <p>
            Los archivos se guardan en formato JSON con la siguiente estructura:
          </p>
          <pre className="file-manager__json-example">
            {`{
  "states": ["q0", "q1", "q2"],
  "alphabet": ["0", "1"],
  "initialState": "q0",
  "finalStates": ["q2"],
  "transitions": [
    { "from": "q0", "symbol": "0", "to": "q1" },
    { "from": "q1", "symbol": "1", "to": "q2" }
  ]
}`}
          </pre>
        </div>
      </Card>
    </div>
  );
}
