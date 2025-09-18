// types/index.ts

export interface Transition {
  from: string;
  symbol: string;
  to: string;
}

export interface AFDDefinition {
  states: string[];
  alphabet: string[];
  initialState: string;
  finalStates: string[];
  transitions: Transition[];
}

export interface EvaluationStep {
  step: number;
  state: string;
  symbol: string;
  nextState?: string;
  message: string;
}

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
    this.transitionFunction = this.buildTransitionFunction(transitions);
  }

  private buildTransitionFunction(
    transitions: Transition[]
  ): Record<string, Record<string, string>> {
    const func: Record<string, Record<string, string>> = {};
    transitions.forEach((t) => {
      if (!func[t.from]) func[t.from] = {};
      func[t.from][t.symbol] = t.to;
    });
    return func;
  }

  evaluate(string: string): EvaluationResult {
    const steps: EvaluationStep[] = [];
    let currentState = this.initialState;

    steps.push({
      step: 0,
      state: currentState,
      symbol: "",
      message: `Estado inicial: ${currentState}`,
    });

    for (let i = 0; i < string.length; i++) {
      const symbol = string[i];

      if (!this.alphabet.includes(symbol)) {
        return {
          accepted: false,
          steps,
          error: `El símbolo '${symbol}' no pertenece al alfabeto`,
        };
      }

      const nextState = this.transitionFunction[currentState]?.[symbol];

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

      steps.push({
        step: i + 1,
        state: currentState,
        symbol: symbol,
        nextState: nextState,
        message: `Desde el estado (${currentState}) con el símbolo '${symbol}' se transita al estado (${nextState})`,
      });

      currentState = nextState;
    }

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

  generateStrings(limit: number = 10): string[] {
    const validStrings: string[] = [];
    const queue: Array<{ string: string; state: string }> = [
      { string: "", state: this.initialState },
    ];
    const visited = new Set<string>();
    let maxLength = 0;

    while (validStrings.length < limit && queue.length > 0 && maxLength <= 20) {
      const current = queue.shift()!;
      const key = `${current.string}-${current.state}`;

      if (visited.has(key)) continue;
      visited.add(key);

      if (this.finalStates.includes(current.state)) {
        validStrings.push(current.string);
      }

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

      if (queue.length === 0 && validStrings.length < limit) {
        maxLength++;
        queue.push({ string: "", state: this.initialState });
        visited.clear();
      }
    }

    return validStrings
      .slice(0, limit)
      .sort((a, b) => a.length - b.length || a.localeCompare(b));
  }
}
