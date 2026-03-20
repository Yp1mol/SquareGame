import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSensor, useSensors, PointerSensor } from '@dnd-kit/core';

const getDropPosition = (translatedRect, fieldRect) => {
    let position = null;

    if (translatedRect && fieldRect) {
        position = {
            x: translatedRect.left - fieldRect.left - 12 + 0.46875,
            y: translatedRect.top - fieldRect.top - 12 + 0.46875,
        };
    }

    return position;
};

const UNIT_IDS = {
    ATTACK: "attack",
    PROTECT: "protect"
};

const FIELD_IDS = {
    ATTACK: "attack-field",
    PROTECT: "protect-field"
};

export function useGame() {
    const { code } = useParams();
    const navigate = useNavigate();
    const [fields] = useState([
        { id: FIELD_IDS.ATTACK, title: "ATTACK", color: "bg-red-400 dark:bg-red-900", x: 0, y: 0 },
        { id: FIELD_IDS.PROTECT, title: "PROTECT", color: "bg-blue-400 dark:bg-blue-900", x: 0, y: 0 },
    ]);
    const [units, setUnits] = useState(() => {
        let initialUnits;
        const saved = localStorage.getItem(`game_${code}`);

        if (saved) {
            initialUnits = JSON.parse(saved);
        } else {
            initialUnits = [
                { id: UNIT_IDS.ATTACK, title: "ATTACK", color: "bg-red-600", x: 100, y: 575 },
                { id: UNIT_IDS.PROTECT, title: "PROTECT", color: "bg-blue-600", x: 700, y: 575 },
            ];
        }

        return initialUnits;
    });

    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: {
            distance: 5
        }
    }));

    const leaveRoom = () => {
        let result;
        result = navigate("/home");
        return result;
    };

    const reset = () => {
        let result;
        localStorage.removeItem(`game_${code}`);
        result = window.location.reload();
        return result;
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over) {
            return;
        }
        const unit = units.find(u => u.id === active.id);

        if (!unit) {
            return;
        }
        const field = fields.find(f => f.id === over.id);

        if (!field) {
            return;
        }

        if (unit.title !== field.title) {
            return;
        }
        const fieldElement = document.getElementById(over.id);

        if (!fieldElement) {
            return;
        }
        const fieldRect = fieldElement.getBoundingClientRect();
        const translatedRect = active.rect.current.translated || active.rect.current.initial;

        if (!translatedRect) {
            return;
        }
        const position = getDropPosition(translatedRect, fieldRect);
        console.log('Position relative to field:', position);

        if (!position) {
            return;
        }
        const updatedUnits = units.map((unit) => {
            if (unit.id === active.id) {
                return { ...unit, x: position.x, y: position.y };
            }

            return unit;
        });

        setUnits(updatedUnits);
        localStorage.setItem(`game_${code}`, JSON.stringify(updatedUnits));
    };

    return {
        code,
        units,
        fields,
        reset,
        leaveRoom,
        handleDragEnd,
        sensors,
    };
}