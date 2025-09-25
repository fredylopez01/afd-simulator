// components/AFDCreator.tsx

import { useState, useCallback, useEffect } from "react";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { AFDDefinition } from "../types/Index";
import "./AFDCreator.css";
import { TransitionList } from "./TransitionList";
import { useAFD } from "../hooks/useAFD";

// Interfaz para los datos del formulario principal
interface FormData {
  states: string;
  alphabet: string;
  initialState: string;
  finalStates: string;
}

// Interfaz para el formulario de transiciones
interface TransitionForm {
  fromState: string;
  symbol: string;
  toState: string;
}

export function AFDCreator() {
  // Hook personalizado para manejar la lógica del AFD
  const {
    transitions,
    createAFD,
    addTransition,
    removeTransition,
    clearTransitions,
  } = useAFD();

  // Estado para los datos del formulario principal
  const [formData, setFormData] = useState<FormData>({
    states: "",
    alphabet: "",
    initialState: "",
    finalStates: "",
  });

  // Estado para el formulario de transiciones
  const [transitionForm, setTransitionForm] = useState<TransitionForm>({
    fromState: "",
    symbol: "",
    toState: "",
  });

  // Estado para mostrar mensajes de resultado
  const [result, setResult] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Opciones disponibles para los selectores
  const [stateOptions, setStateOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [symbolOptions, setSymbolOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);

  // Actualizar opciones de estados cuando cambie el campo de estados
  useEffect(() => {
    const states = formData.states
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
    setStateOptions(states.map((state) => ({ value: state, label: state })));
  }, [formData.states]);

  // Actualizar opciones de símbolos cuando cambie el alfabeto
  useEffect(() => {
    const symbols = formData.alphabet
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
    setSymbolOptions(
      symbols.map((symbol) => ({ value: symbol, label: symbol }))
    );
  }, [formData.alphabet]);

  // Manejar cambios en los campos del formulario principal
  const handleInputChange = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setResult(null); // Limpiar mensajes de resultado
    },
    []
  );

  // Manejar cambios en el formulario de transiciones
  const handleTransitionFormChange = useCallback(
    (field: keyof TransitionForm, value: string) => {
      setTransitionForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // Agregar una nueva transición
  const handleAddTransition = useCallback(() => {
    // Validar que todos los campos estén llenos
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

    // Intentar agregar la transición
    const result = addTransition({
      from: transitionForm.fromState,
      symbol: transitionForm.symbol,
      to: transitionForm.toState,
    });

    if (result.success) {
      // Limpiar formulario de transición si se agregó exitosamente
      setTransitionForm({ fromState: "", symbol: "", toState: "" });
      setResult(null);
    } else {
      setResult({
        message: result.error || "Error al agregar transición",
        type: "error",
      });
    }
  }, [transitionForm, addTransition]);

  // Crear el AFD con todos los datos ingresados
  const handleCreateAFD = useCallback(() => {
    // Procesar los datos del formulario
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

    // Crear la definición del AFD
    const definition: AFDDefinition = {
      states,
      alphabet,
      initialState: formData.initialState,
      finalStates,
      transitions,
    };

    // Intentar crear el AFD
    const result = createAFD(definition);

    if (result.success) {
      setResult({ message: "AFD creado exitosamente", type: "success" });
    } else {
      setResult({
        message: result.error || "Error al crear AFD",
        type: "error",
      });
    }
  }, [formData, transitions, createAFD]);

  return (
    <div className="afd-creator">
      <Card title="Definir Autómata Finito Determinista">
        <div className="afd-creator__form">
          {/* Formulario principal para definir los componentes básicos del AFD */}
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

          {/* Sección para definir las transiciones */}
          <div className="afd-creator__transition-section">
            <h4 className="afd-creator__section-title">
              Función de Transición
            </h4>

            {/* Formulario para agregar transiciones individuales */}
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

            {/* Acciones principales */}
            <div className="afd-creator__actions">
              {transitions.length > 0 && (
                <Button
                  variant="secondary"
                  onClick={clearTransitions}
                  className="afd-creator__clear-btn"
                >
                  Limpiar Transiciones
                </Button>
              )}
              <Button onClick={handleCreateAFD}>Crear AFD</Button>
            </div>

            {/* Mostrar mensajes de resultado */}
            {result && (
              <Card variant={result.type} className="afd-creator__result">
                {result.message}
              </Card>
            )}
          </div>

          {/* Lista de transiciones añadidas */}
          <TransitionList
            transitions={transitions}
            onRemove={removeTransition}
          />
        </div>
      </Card>
    </div>
  );
}
