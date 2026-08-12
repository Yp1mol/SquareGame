import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const GRID_SIZE = 20;
const MAX_CELLS = 200;

export default function ComponentDrawer({
  title,
  color,
  fieldColor,
  cells,
  onChange,
  disabled,
}) {
  const [activeCells, setActiveCells] = useState(() => new Set(cells.map(c => `${c.x},${c.y}`)));
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingMode, setDrawingMode] = useState(true);

  useEffect(() => {
    setActiveCells(new Set(cells.map(c => `${c.x},${c.y}`)));
  }, [cells]);

  const getCellKey = (x, y) => `${x},${y}`;

  const emit = (set) => {
    const arr = Array.from(set).map((key) => {
      const [x, y] = key.split(",").map(Number);
      return { x, y };
    });
    onChange?.(arr);
  };

  const handleMouseDown = (x, y) => {
    if (disabled) return;
    setIsDrawing(true);
    const key = getCellKey(x, y);
    const next = new Set(activeCells);
    const mode = !next.has(key);
    setDrawingMode(mode);

    if (mode) {
      if (next.size < MAX_CELLS) next.add(key);
    } else {
      next.delete(key);
    }
    setActiveCells(next);
    emit(next);
  };

  const handleMouseEnter = (x, y) => {
    if (!isDrawing || disabled) return;
    const key = getCellKey(x, y);
    const next = new Set(activeCells);

    if (drawingMode) {
      if (!next.has(key) && next.size < MAX_CELLS) next.add(key);
    } else {
      next.delete(key);
    }
    setActiveCells(next);
    emit(next);
  };

  const handleMouseUp = () => setIsDrawing(false);

  const handleClear = () => {
    if (disabled) return;
    setActiveCells(new Set());
    onChange?.([]);
  };

  return (
    <div
      className={`relative w-full aspect-square rounded-2xl md:rounded-4xl overflow-hidden shadow-2xl ring-[6px] md:ring-[12px] ring-white dark:ring-gray-900 ${fieldColor}`}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <span className="absolute top-2 left-2 md:top-4 md:left-4 z-10 text-[8px] md:text-[10px] font-black text-white uppercase opacity-50">
        {title}
      </span>

      <div className="absolute top-2 right-2 md:top-4 md:right-4 z-10 flex items-center gap-2">
        <span className={`text-[10px] font-bold ${activeCells.size >= MAX_CELLS ? "text-red-200" : "text-white/60"}`}>
          {activeCells.size}/{MAX_CELLS}
        </span>
        {!disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="text-[10px] font-black text-white/70 hover:text-white uppercase"
          >
            Clear
          </button>
        )}
      </div>

      <div
        className="absolute inset-0 grid"
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
      >
        {Array.from({ length: GRID_SIZE }).map((_, y) =>
          Array.from({ length: GRID_SIZE }).map((_, x) => {
            const key = getCellKey(x, y);
            const isActive = activeCells.has(key);

            return (
              <div
                key={key}
                onMouseDown={() => handleMouseDown(x, y)}
                onMouseEnter={() => handleMouseEnter(x, y)}
                className={`w-full aspect-square ${
                  isActive ? color : "bg-transparent"
                } ${disabled ? "cursor-default" : "cursor-crosshair"}`}
              />
            );
          })
        )}
      </div>

      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <h1 className="text-4xl md:text-7xl font-black text-white">{title}</h1>
      </div>
    </div>
  );
}

ComponentDrawer.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
  fieldColor: PropTypes.string,
  cells: PropTypes.arrayOf(PropTypes.shape({ x: PropTypes.number, y: PropTypes.number })),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};