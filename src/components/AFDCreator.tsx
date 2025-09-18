// components/AFDCreator.tsx

import React, { useState, useCallback, useEffect } from "react";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Transition, AFDDefinition } from "../types/Index";
import "./AFDCreator.css";
import { TransitionList } from "./TransitionList";

interface AFDCreatorProps {
  transitions: Transition[];
  onCreateAFD: (definition: AFDDefinition) => {
    success: boolean;
    error?: string;
  };
  onAddTransition: (transition: Transition) => {
    success: boolean;
    error?: string;
  };
  onRemoveTransition: (index: number) => void;
  onClearTransitions: () => void;
}

interface FormData {
  states: string;
  alphabet: string;
  initialState: string;
  finalStates: string;
}

interface TransitionForm {
  fromState: string;
  symbol: string;
  toState: string;
}

export const AFDCreator: React.FC<AFDCreatorProps> = ({
  transitions,
  onCreateAFD,
  onAddTransition,
  onRemoveTransition,
  onClearTransitions,
}) => {
  const [formData, setFormData] = useState<FormData>({
    states: "",
    alphabet: "",
    initialState: "",
    finalStates: "",
  });

  const [transitionForm, setTransitionForm] = useState<TransitionForm>({
    fromState: "",
    symbol: "",
    toState: "",
  });

  const [result, setResult] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [stateOptions, setStateOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [symbolOptions, setSymbolOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);

  // Actualizar opciones cuando cambien los estados o el alfabeto
  useEffect(() => {
    const states = formData.states
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
    setStateOptions(states.map((state) => ({ value: state, label: state })));
  }, [formData.states]);

  useEffect(() => {
    const symbols = formData.alphabet
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
    setSymbolOptions(
      symbols.map((symbol) => ({ value: symbol, label: symbol }))
    );
  }, [formData.alphabet]);

  const handleInputChange = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setResult(null);
    },
    []
  );

  const handleTransitionFormChange = useCallback(
    (field: keyof TransitionForm, value: string) => {
      setTransitionForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleAddTransition = useCallback(() => {
    if (
      !transitionForm.fromState ||
      !transitionForm.symbol ||
      !transitionForm.toState
    ) {
      setResult({
        message: "Todos los campos de la transición son obligatorios",
        type: "error",
      });
      return;
    }

    const result = onAddTransition({
      from: transitionForm.fromState,
      symbol: transitionForm.symbol,
      to: transitionForm.toState,
    });

    if (result.success) {
      setTransitionForm({ fromState: "", symbol: "", toState: "" });
      setResult(null);
    } else {
      setResult({
        message: result.error || "Error al agregar transición",
        type: "error",
      });
    }
  }, [transitionForm, onAddTransition]);

  const handleCreateAFD = useCallback(() => {
    const states = formData.states
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
    const alphabet = formData.alphabet
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
    const finalStates = formData.finalStates
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);

    const definition: AFDDefinition = {
      states,
      alphabet,
      initialState: formData.initialState,
      finalStates,
      transitions,
    };

    const result = onCreateAFD(definition);

    if (result.success) {
      setResult({ message: "AFD creado exitosamente", type: "success" });
    } else {
      setResult({
        message: result.error || "Error al crear AFD",
        type: "error",
      });
    }
  }, [formData, transitions, onCreateAFD]);

  return (
    <div className="afd-creator">
      <Card title="Definir Autómata Finito Determinista">
        <div className="afd-creator__form">
          <div>
            <Input
              label="Estados (separados por comas)"
              value={formData.states}
              onChange={(value) => handleInputChange("states", value)}
              placeholder="q0, q1, q2, q3"
            />

            <Input
              label="Alfabeto (símbolos separados por comas)"
              value={formData.alphabet}
              onChange={(value) => handleInputChange("alphabet", value)}
              placeholder="0, 1"
            />

            <Select
              label="Estado Inicial"
              value={formData.initialState}
              onChange={(value) => handleInputChange("initialState", value)}
              options={stateOptions}
              placeholder="Seleccionar estado inicial"
            />

            <Input
              label="Estados de Aceptación (separados por comas)"
              value={formData.finalStates}
              onChange={(value) => handleInputChange("finalStates", value)}
              placeholder="q2, q3"
            />
          </div>

          <div className="afd-creator__transition-section">
            <h4 className="afd-creator__section-title">
              Función de Transición
            </h4>

            <div className="afd-creator__transition-form">
              <Select
                value={transitionForm.fromState}
                onChange={(value) =>
                  handleTransitionFormChange("fromState", value)
                }
                options={stateOptions}
                placeholder="Estado origen"
              />

              <Select
                value={transitionForm.symbol}
                onChange={(value) =>
                  handleTransitionFormChange("symbol", value)
                }
                options={symbolOptions}
                placeholder="Símbolo"
              />

              <Select
                value={transitionForm.toState}
                onChange={(value) =>
                  handleTransitionFormChange("toState", value)
                }
                options={stateOptions}
                placeholder="Estado destino"
              />

              <Button onClick={handleAddTransition}>Agregar</Button>
            </div>
            <div className="afd-creator__actions">
              {transitions.length > 0 && (
                <Button
                  variant="secondary"
                  onClick={onClearTransitions}
                  className="afd-creator__clear-btn"
                >
                  Limpiar Transiciones
                </Button>
              )}
              <Button onClick={handleCreateAFD}>Crear AFD</Button>
            </div>

            {result && (
              <Card variant={result.type} className="afd-creator__result">
                {result.message}
              </Card>
            )}
          </div>

          <TransitionList
            transitions={transitions}
            onRemove={onRemoveTransition}
          />
        </div>
      </Card>
    </div>
  );
};
