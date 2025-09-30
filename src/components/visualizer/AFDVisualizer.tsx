// components/AFDVisualizer.tsx

import { useEffect, useState, useCallback } from "react";
import { Card } from "../ui/Card";
import { useAFD } from "../../hooks/useAFD";
import "./AFDVisualizer.css";

// Posición de un estado en el canvas SVG
interface StatePosition {
  x: number;
  y: number;
  state: string;
}

// Configuración visual del componente
const CONFIG = {
  STATE_RADIUS: 40,
  STATE_SPACING: 180, // Espaciado horizontal entre estados
  CANVAS_HEIGHT: 400,
  MARGIN: 150,
  ARROW_SIZE: 8,
  SELF_LOOP_SIZE: 30,
};

export function AFDVisualizer() {
  const { currentAFD, isCreated } = useAFD();
  const [statePositions, setStatePositions] = useState<StatePosition[]>([]);
  const [canvasWidth, setCanvasWidth] = useState(800);

  // Calcular posiciones horizontales para los estados
  const calculateStatePositions = useCallback(() => {
    if (!currentAFD) return [];

    const states = currentAFD.states;
    const positions: StatePosition[] = [];

    // Calcular ancho total necesario
    const totalWidth = Math.max(
      800,
      states.length * CONFIG.STATE_SPACING + CONFIG.MARGIN * 2
    );
    setCanvasWidth(totalWidth);

    // Posición Y fija en el centro vertical
    const centerY = CONFIG.CANVAS_HEIGHT / 2;

    // Distribuir estados horizontalmente
    states.forEach((state, index) => {
      positions.push({
        state,
        x: CONFIG.MARGIN + index * CONFIG.STATE_SPACING + CONFIG.STATE_RADIUS,
        y: centerY,
      });
    });

    return positions;
  }, [currentAFD]);

  // Recalcular posiciones cuando cambie el AFD
  useEffect(() => {
    if (currentAFD) {
      setStatePositions(calculateStatePositions());
    }
  }, [currentAFD, calculateStatePositions]);

  // Encontrar la posición de un estado específico
  const getStatePosition = (stateName: string): StatePosition | undefined => {
    return statePositions.find((pos) => pos.state === stateName);
  };

  // Crear path SVG para flecha simple
  const createArrowMarker = (
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): string => {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const arrowLength = CONFIG.ARROW_SIZE;

    const arrowX1 = x2 - arrowLength * Math.cos(angle - Math.PI / 6);
    const arrowY1 = y2 - arrowLength * Math.sin(angle - Math.PI / 6);
    const arrowX2 = x2 - arrowLength * Math.cos(angle + Math.PI / 6);
    const arrowY2 = y2 - arrowLength * Math.sin(angle + Math.PI / 6);

    return `M ${arrowX1} ${arrowY1} L ${x2} ${y2} L ${arrowX2} ${arrowY2}`;
  };

  // Renderizar todas las transiciones agrupadas
  const renderTransitions = () => {
    if (!currentAFD) return null;

    // Agrupar transiciones por from-to para combinar símbolos
    const transitionGroups: {
      [key: string]: { from: string; to: string; symbols: string[] };
    } = {};

    currentAFD.transitions.forEach((transition) => {
      const key = `${transition.from}-${transition.to}`;
      if (!transitionGroups[key]) {
        transitionGroups[key] = {
          from: transition.from,
          to: transition.to,
          symbols: [],
        };
      }
      transitionGroups[key].symbols.push(transition.symbol);
    });

    return Object.values(transitionGroups).map((group, index) => {
      const fromPos = getStatePosition(group.from);
      const toPos = getStatePosition(group.to);

      if (!fromPos || !toPos) return null;

      // Self-loop (transición a sí mismo)
      if (group.from === group.to) {
        const loopCenterX = fromPos.x;
        const loopCenterY =
          fromPos.y - CONFIG.STATE_RADIUS - CONFIG.SELF_LOOP_SIZE - 5; // 5 píxeles más arriba

        return (
          <g key={`transition-${index}`}>
            {/* Círculo del self-loop */}
            <circle
              cx={loopCenterX}
              cy={loopCenterY - 5}
              r={CONFIG.SELF_LOOP_SIZE}
              fill="none"
              stroke="#333"
              strokeWidth="2"
            />
            {/* Flecha manual para el self-loop */}
            <polygon
              points={`${loopCenterX - 6},${
                loopCenterY + CONFIG.SELF_LOOP_SIZE - 5
              } ${loopCenterX},${loopCenterY + CONFIG.SELF_LOOP_SIZE + 8} ${
                loopCenterX + 6
              },${loopCenterY + CONFIG.SELF_LOOP_SIZE - 5}`}
              fill="#333"
            />
            {/* Etiqueta del self-loop */}
            <text
              x={loopCenterX}
              y={loopCenterY - CONFIG.SELF_LOOP_SIZE - 15}
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
              fill="#333"
            >
              {group.symbols.join(", ")}
            </text>
          </g>
        );
      }

      // Transición normal entre diferentes estados con offset vertical para evitar superposición
      const isGoingRight = toPos.x > fromPos.x;
      const isGoingLeft = toPos.x < fromPos.x;

      // Calcular offset vertical para evitar superposición
      let startY = fromPos.y;
      let endY = toPos.y;

      if (isGoingRight) {
        // Si va hacia la derecha, sale un poco arriba de la mitad
        startY = fromPos.y - 16;
        endY = toPos.y - 16;
      } else if (isGoingLeft) {
        // Si va hacia la izquierda, sale un poco abajo de la mitad
        startY = fromPos.y + 16;
        endY = toPos.y + 16;
      }

      // Calcular puntos de inicio y fin en los bordes de los círculos
      // const distance = Math.sqrt(
      //   Math.pow(toPos.x - fromPos.x, 2) + Math.pow(endY - startY, 2)
      // );
      const angle = Math.atan2(endY - startY, toPos.x - fromPos.x);

      const startX = fromPos.x + CONFIG.STATE_RADIUS * Math.cos(angle);
      const endX = toPos.x - CONFIG.STATE_RADIUS * Math.cos(angle);

      // Si la distancia es grande (más de 2 estados), usar curva suave
      const shouldCurve =
        Math.abs(toPos.x - fromPos.x) > CONFIG.STATE_SPACING * 1.5;

      if (shouldCurve) {
        // Crear curva suave para distancias largas
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        const curveOffset = isGoingRight ? -90 : 90; // Curva hacia arriba para derecha, hacia abajo para izquierda
        const controlY = midY + curveOffset;

        return (
          <g key={`transition-${index}`}>
            {/* Curva de la transición */}
            <path
              d={`M ${startX} ${startY} Q ${midX} ${controlY} ${endX} ${endY}`}
              fill="none"
              stroke="#333"
              strokeWidth="2"
            />
            {/* Flecha de la transición */}
            <path
              d={createArrowMarker(midX, controlY, endX, endY)}
              stroke="#333"
              strokeWidth="2"
              fill="none"
            />
            {/* Etiqueta de la transición */}
            <rect
              x={midX - 15}
              y={controlY - 12}
              width="30"
              height="24"
              fill="white"
              stroke="#ddd"
              strokeWidth="1"
              rx="4"
            />
            <text
              x={midX}
              y={controlY + 4}
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
              fill="#333"
            >
              {group.symbols.join(", ")}
            </text>
          </g>
        );
      } else {
        // Línea recta para distancias cortas
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;

        return (
          <g key={`transition-${index}`}>
            {/* Línea de la transición */}
            <line
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="#333"
              strokeWidth="2"
            />
            {/* Flecha de la transición */}
            <path
              d={createArrowMarker(startX, startY, endX, endY)}
              stroke="#333"
              strokeWidth="2"
              fill="none"
            />
            {/* Etiqueta de la transición */}
            <rect
              x={midX - 15}
              y={midY - 12}
              width="30"
              height="24"
              fill="white"
              stroke="#ddd"
              strokeWidth="1"
              rx="4"
            />
            <text
              x={midX}
              y={midY + 4}
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
              fill="#333"
            >
              {group.symbols.join(", ")}
            </text>
          </g>
        );
      }
    });
  };

  if (!isCreated || !currentAFD) {
    return (
      <div className="afd-visualizer">
        <Card title="Visualización del AFD">
          <div className="afd-visualizer__empty">
            <p>No hay ningún AFD definido para visualizar.</p>
            <p>Crea un AFD primero para poder ver su representación gráfica.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="afd-visualizer">
      <Card title="Visualización del AFD">
        <div className="afd-visualizer__content">
          {/* Canvas con scroll horizontal */}
          <div className="afd-visualizer__scroll-container">
            <svg
              width={canvasWidth}
              height={CONFIG.CANVAS_HEIGHT}
              className="afd-visualizer__svg"
            >
              {/* Renderizar transiciones primero (fondo) */}
              {renderTransitions()}

              {/* Flecha inicial */}
              {currentAFD &&
                (() => {
                  const initialPos = getStatePosition(currentAFD.initialState);
                  if (!initialPos) return null;

                  const arrowStartX = initialPos.x - CONFIG.STATE_RADIUS - 50;
                  const arrowEndX = initialPos.x - CONFIG.STATE_RADIUS;

                  return (
                    <g>
                      <line
                        x1={arrowStartX}
                        y1={initialPos.y}
                        x2={arrowEndX}
                        y2={initialPos.y}
                        stroke="#666"
                        strokeWidth="2"
                      />
                      <path
                        d={createArrowMarker(
                          arrowStartX,
                          initialPos.y,
                          arrowEndX,
                          initialPos.y
                        )}
                        stroke="#666"
                        strokeWidth="2"
                        fill="none"
                      />
                      <text
                        x={arrowStartX - 20}
                        y={initialPos.y + 5}
                        textAnchor="end"
                        fontSize="12"
                        fill="#666"
                      >
                        inicio
                      </text>
                    </g>
                  );
                })()}

              {/* Renderizar estados (frente) */}
              {statePositions.map((pos) => {
                const isFinal = currentAFD.finalStates.includes(pos.state);
                const isInitial = currentAFD.initialState === pos.state;

                return (
                  <g key={pos.state}>
                    {/* Círculo principal del estado */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={CONFIG.STATE_RADIUS}
                      fill={isInitial ? "#e3f2fd" : "#f5f5f5"}
                      stroke={isInitial ? "#2196f3" : "#333"}
                      strokeWidth="2"
                    />

                    {/* Círculo interno para estados finales */}
                    {isFinal && (
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={CONFIG.STATE_RADIUS - 8}
                        fill="none"
                        stroke="#4caf50"
                        strokeWidth="2"
                      />
                    )}

                    {/* Etiqueta del estado */}
                    <text
                      x={pos.x}
                      y={pos.y + 5}
                      textAnchor="middle"
                      fontSize="16"
                      fontWeight="bold"
                      fill="#333"
                    >
                      {pos.state}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Leyenda */}
          <div className="afd-visualizer__legend">
            <div className="afd-visualizer__legend-item">
              <div className="afd-visualizer__legend-symbol afd-visualizer__legend-initial"></div>
              <span>Estado inicial</span>
            </div>
            <div className="afd-visualizer__legend-item">
              <div className="afd-visualizer__legend-symbol afd-visualizer__legend-final"></div>
              <span>Estado final</span>
            </div>
            <div className="afd-visualizer__legend-item">
              <div className="afd-visualizer__legend-symbol afd-visualizer__legend-normal"></div>
              <span>Estado normal</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
