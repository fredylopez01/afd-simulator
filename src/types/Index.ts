// types/index.ts

// Representa una transición del AFD: estado origen + símbolo → estado destino
export interface Transition {
  from: string;
  symbol: string;
  to: string;
}

// Definición completa de un AFD con todos sus componentes
export interface AFDDefinition {
  states: string[];
  alphabet: string[];
  initialState: string;
  finalStates: string[];
  transitions: Transition[];
}

// Representa un paso individual en la evaluación de una cadena
export interface EvaluationStep {
  step: number;
  state: string;
  symbol: string;
  nextState?: string;
  message: string;
}

// Resultado completo de la evaluación de una cadena
export interface EvaluationResult {
  accepted: boolean;
  steps: EvaluationStep[];
  finalState?: string;
  error?: string;
}

export interface AFDState {
  currentAFD: AFD | null;
  transitions: Transition[];
  isCreated: boolean;
}

export type TabType = "create" | "evaluate" | "generate" | "files" | "afd";

export interface GeneratedString {
  value: string;
  index: number;
}

// Clase principal del AFD
export class AFD {
  states: string[];
  alphabet: string[];
  initialState: string;
  finalStates: string[];
  transitions: Transition[];
  // Función de transición optimizada: estado[símbolo] → estado_destino
  transitionFunction: Record<string, Record<string, string>>;

  constructor(
    states: string[],
    alphabet: string[],
    initialState: string,
    finalStates: string[],
    transitions: Transition[]
  ) {
    this.states = states;
    this.alphabet = alphabet;
    this.initialState = initialState;
    this.finalStates = finalStates;
    this.transitions = transitions;
    // Construir la tabla de transiciones para acceso O(1)
    this.transitionFunction = this.buildTransitionFunction(transitions);
  }

  // Construye una tabla hash de transiciones para búsqueda eficiente
  private buildTransitionFunction(
    transitions: Transition[]
  ): Record<string, Record<string, string>> {
    const func: Record<string, Record<string, string>> = {};
    transitions.forEach((t) => {
      // Inicializar el objeto del estado si no existe
      if (!func[t.from]) func[t.from] = {};
      // Mapear: estado[símbolo] = estado_destino
      func[t.from][t.symbol] = t.to;
    });
    return func;
  }

  // Evalúa una cadena de entrada y retorna el resultado paso a paso
  evaluate(string: string): EvaluationResult {
    const steps: EvaluationStep[] = [];
    let currentState = this.initialState;

    // Paso inicial: mostrar el estado inicial
    steps.push({
      step: 0,
      state: currentState,
      symbol: "",
      message: `Estado inicial: ${currentState}`,
    });

    // Procesar cada símbolo de la cadena de entrada
    for (let i = 0; i < string.length; i++) {
      const symbol = string[i];

      // Verificar que el símbolo pertenezca al alfabeto
      if (!this.alphabet.includes(symbol)) {
        return {
          accepted: false,
          steps,
          error: `El símbolo '${symbol}' no pertenece al alfabeto`,
        };
      }

      // Buscar la transición correspondiente
      const nextState = this.transitionFunction[currentState]?.[symbol];

      // Si no existe transición, rechazar la cadena
      if (!nextState) {
        steps.push({
          step: i + 1,
          state: currentState,
          symbol: symbol,
          message: `No existe transición desde ${currentState} con símbolo '${symbol}'`,
        });
        return {
          accepted: false,
          steps,
          error: `No existe transición desde ${currentState} con símbolo '${symbol}'`,
        };
      }

      // Registrar la transición exitosa
      steps.push({
        step: i + 1,
        state: currentState,
        symbol: symbol,
        nextState: nextState,
        message: `Desde el estado (${currentState}) con el símbolo '${symbol}' se transita al estado (${nextState})`,
      });

      currentState = nextState;
    }

    // Verificar si el estado final es de aceptación
    const accepted = this.finalStates.includes(currentState);
    steps.push({
      step: string.length + 1,
      state: currentState,
      symbol: "",
      message: `Proceso finalizado. El estado final es (${currentState})`,
    });

    return {
      accepted,
      steps,
      finalState: currentState,
    };
  }

  // Genera cadenas válidas (aceptadas) por el AFD usando búsqueda en anchura
  generateStrings(limit: number = 10): string[] {
    const validStrings: string[] = [];
    // Cola para BFS: cada elemento contiene la cadena parcial y el estado actual
    const queue: Array<{ string: string; state: string }> = [
      { string: "", state: this.initialState },
    ];
    // Evitar procesar la misma combinación cadena-estado múltiples veces
    const visited = new Set<string>();
    let maxLength = 0;

    // Búsqueda en anchura limitada por número de cadenas y longitud máxima
    while (validStrings.length < limit && queue.length > 0 && maxLength <= 20) {
      const current = queue.shift()!;
      const key = `${current.string}-${current.state}`;

      // Evitar ciclos infinitos
      if (visited.has(key)) continue;
      visited.add(key);

      // Si estamos en un estado de aceptación, guardar la cadena
      if (this.finalStates.includes(current.state)) {
        validStrings.push(current.string);
      }

      // Explorar transiciones solo si no excedemos la longitud máxima actual
      if (current.string.length <= maxLength + 1) {
        this.alphabet.forEach((symbol) => {
          const nextState = this.transitionFunction[current.state]?.[symbol];
          if (nextState) {
            queue.push({
              string: current.string + symbol,
              state: nextState,
            });
          }
        });
      }

      // Si la cola se vacía y necesitamos más cadenas, incrementar longitud máxima
      if (queue.length === 0 && validStrings.length < limit) {
        maxLength++;
        // Reiniciar la búsqueda desde el estado inicial
        queue.push({ string: "", state: this.initialState });
        visited.clear();
      }
    }

    // Ordenar por longitud y luego alfabéticamente
    return validStrings
      .slice(0, limit)
      .sort((a, b) => a.length - b.length || a.localeCompare(b));
  }
}
