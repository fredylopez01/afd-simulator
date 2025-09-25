// hooks/useAFD.ts

import {
  useState,
  useCallback,
  ReactNode,
  createContext,
  useContext,
} from "react";
import {
  AFD,
  Transition,
  AFDDefinition,
  EvaluationResult,
} from "../types/Index";

interface UseAFDReturn {
  currentAFD: AFD | null;
  transitions: Transition[];
  isCreated: boolean;
  createAFD: (definition: AFDDefinition) => {
    success: boolean;
    error?: string;
  };
  addTransition: (transition: Transition) => {
    success: boolean;
    error?: string;
  };
  removeTransition: (index: number) => void;
  clearTransitions: () => void;
  evaluateString: (input: string) => EvaluationResult | null;
  generateStrings: (limit?: number) => string[];
  saveAFD: () => string;
  loadAFD: (data: AFDDefinition) => { success: boolean; error?: string };
  resetAFD: () => void;
}

const AFDContext = createContext<UseAFDReturn | undefined>(undefined);

export const AFDProvider = ({ children }: { children: ReactNode }) => {
  const [currentAFD, setCurrentAFD] = useState<AFD | null>(null);
  const [transitions, setTransitions] = useState<Transition[]>([]);
  const [isCreated, setIsCreated] = useState<boolean>(false);

  const createAFD = useCallback(
    (definition: AFDDefinition): { success: boolean; error?: string } => {
      try {
        // Validar que se hayan definido estados
        if (definition.states.length === 0) {
          return { success: false, error: "Debe definir al menos un estado" };
        }
        // Validar que se haya definido un alfabeto
        if (definition.alphabet.length === 0) {
          return {
            success: false,
            error: "Debe definir al menos un símbolo en el alfabeto",
          };
        }
        // Validar que se haya seleccionado un estado inicial
        if (!definition.initialState) {
          return {
            success: false,
            error: "Debe seleccionar un estado inicial",
          };
        }
        // Validar que existan estados de aceptación
        if (definition.finalStates.length === 0) {
          return {
            success: false,
            error: "Debe definir al menos un estado de aceptación",
          };
        }
        // Validar que existan transiciones
        if (definition.transitions.length === 0) {
          return {
            success: false,
            error: "Debe definir al menos una transición",
          };
        }

        // Verificar que todos los estados de aceptación existan en el conjunto de estados
        for (const state of definition.finalStates) {
          if (!definition.states.includes(state)) {
            return {
              success: false,
              error: `El estado de aceptación '${state}' no está en el conjunto de estados`,
            };
          }
        }

        // Verificar que todas las transiciones usen estados y símbolos válidos
        for (const t of definition.transitions) {
          // Validar estado origen
          if (!definition.states.includes(t.from)) {
            return {
              success: false,
              error: `Estado origen '${t.from}' no válido`,
            };
          }
          // Validar estado destino
          if (!definition.states.includes(t.to)) {
            return {
              success: false,
              error: `Estado destino '${t.to}' no válido`,
            };
          }
          // Validar símbolo de transición
          if (!definition.alphabet.includes(t.symbol)) {
            return { success: false, error: `Símbolo '${t.symbol}' no válido` };
          }
        }

        // Crear la instancia del AFD si todas las validaciones pasan
        const afd = new AFD(
          definition.states,
          definition.alphabet,
          definition.initialState,
          definition.finalStates,
          definition.transitions
        );

        setCurrentAFD(afd);
        setTransitions(definition.transitions);
        setIsCreated(true);

        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Error desconocido",
        };
      }
    },
    []
  );

  const addTransition = useCallback(
    (transition: Transition): { success: boolean; error?: string } => {
      // Verificar si ya existe una transición desde el mismo estado con el mismo símbolo
      const existingTransition = transitions.find(
        (t) => t.from === transition.from && t.symbol === transition.symbol
      );

      // Si existe, no permitir duplicados (AFD debe ser determinístico)
      if (existingTransition) {
        return {
          success: false,
          error: `Ya existe una transición desde ${transition.from} con símbolo '${transition.symbol}'`,
        };
      }

      setTransitions((prev) => [...prev, transition]);
      return { success: true };
    },
    [transitions]
  );

  const removeTransition = useCallback((index: number) => {
    setTransitions((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearTransitions = useCallback(() => {
    setTransitions([]);
  }, []);

  const evaluateString = useCallback(
    (input: string): EvaluationResult | null => {
      // Retornar null si no hay AFD creado
      if (!currentAFD) return null;
      return currentAFD.evaluate(input);
    },
    [currentAFD]
  );

  const generateStrings = useCallback(
    (limit: number = 10): string[] => {
      // Retornar array vacío si no hay AFD creado
      if (!currentAFD) return [];
      return currentAFD.generateStrings(limit);
    },
    [currentAFD]
  );

  // Serializar el AFD actual a formato JSON
  const saveAFD = useCallback((): string => {
    if (!currentAFD) return "";

    const afdData: AFDDefinition = {
      states: currentAFD.states,
      alphabet: currentAFD.alphabet,
      initialState: currentAFD.initialState,
      finalStates: currentAFD.finalStates,
      transitions: currentAFD.transitions,
    };

    return JSON.stringify(afdData, null, 2);
  }, [currentAFD]);

  // Cargar un AFD desde datos JSON
  const loadAFD = useCallback(
    (data: AFDDefinition): { success: boolean; error?: string } => {
      try {
        // Validar que el archivo contenga todas las propiedades requeridas
        if (
          !data.states ||
          !data.alphabet ||
          !data.initialState ||
          !data.finalStates ||
          !data.transitions
        ) {
          return {
            success: false,
            error: "Archivo de AFD inválido: faltan propiedades requeridas",
          };
        }

        // Reutilizar la función createAFD para validar y crear el AFD
        const result = createAFD(data);
        return result;
      } catch (error) {
        return {
          success: false,
          error: `Error al cargar el archivo: ${
            error instanceof Error ? error.message : "Error desconocido"
          }`,
        };
      }
    },
    [createAFD]
  );

  // Reiniciar el estado del AFD
  const resetAFD = useCallback(() => {
    setCurrentAFD(null);
    setTransitions([]);
    setIsCreated(false);
  }, []);

  const value = {
    currentAFD,
    transitions,
    isCreated,
    createAFD,
    addTransition,
    removeTransition,
    clearTransitions,
    evaluateString,
    generateStrings,
    saveAFD,
    loadAFD,
    resetAFD,
  };

  return <AFDContext.Provider value={value}>{children}</AFDContext.Provider>;
};

export const useAFD = () => {
  const context = useContext(AFDContext);
  // Verificar que el hook se use dentro del provider
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
