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
        // Validaciones
        if (definition.states.length === 0) {
          return { success: false, error: "Debe definir al menos un estado" };
        }
        if (definition.alphabet.length === 0) {
          return {
            success: false,
            error: "Debe definir al menos un símbolo en el alfabeto",
          };
        }
        if (!definition.initialState) {
          return {
            success: false,
            error: "Debe seleccionar un estado inicial",
          };
        }
        if (definition.finalStates.length === 0) {
          return {
            success: false,
            error: "Debe definir al menos un estado de aceptación",
          };
        }
        if (definition.transitions.length === 0) {
          return {
            success: false,
            error: "Debe definir al menos una transición",
          };
        }

        // Verificar que todos los estados de aceptación existan
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
          if (!definition.states.includes(t.from)) {
            return {
              success: false,
              error: `Estado origen '${t.from}' no válido`,
            };
          }
          if (!definition.states.includes(t.to)) {
            return {
              success: false,
              error: `Estado destino '${t.to}' no válido`,
            };
          }
          if (!definition.alphabet.includes(t.symbol)) {
            return { success: false, error: `Símbolo '${t.symbol}' no válido` };
          }
        }

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
      // Verificar si la transición ya existe
      const existingTransition = transitions.find(
        (t) => t.from === transition.from && t.symbol === transition.symbol
      );

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
      if (!currentAFD) return null;
      return currentAFD.evaluate(input);
    },
    [currentAFD]
  );

  const generateStrings = useCallback(
    (limit: number = 10): string[] => {
      if (!currentAFD) return [];
      return currentAFD.generateStrings(limit);
    },
    [currentAFD]
  );

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

  const loadAFD = useCallback(
    (data: AFDDefinition): { success: boolean; error?: string } => {
      try {
        // Validar estructura del archivo
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
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
