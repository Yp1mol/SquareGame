import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { getPositions, savePositions, getRoom, finishRoomSetup } from "../../../services/api";
import { useAuth } from "../../auth/authContext";

const FIELDS = {
    ATTACK: "attack-field",
    PROTECT: "protect-field"
};

const UNITS = {
    ATTACK: "attack",
    PROTECT: "protect"
};

const DEFAULT_UNITS = [
    { id: UNITS.ATTACK, title: "ATTACK", color: "bg-red-600", x: 100, y: 590 },
    { id: UNITS.PROTECT, title: "PROTECT", color: "bg-blue-600", x: 100, y: 590 },
];

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

export function useGame() {
    const { code } = useParams();
    const navigate = useNavigate();
    const { token, user } = useAuth();
    const [fields] = useState([
        { id: FIELDS.ATTACK, title: "ATTACK", color: "bg-red-400 dark:bg-red-900", x: 0, y: 0 },
        { id: FIELDS.PROTECT, title: "PROTECT", color: "bg-blue-400 dark:bg-blue-900", x: 0, y: 0 },
    ]);
    const [units, setUnits] = useState(DEFAULT_UNITS);
    const [isOwner, setIsOwner] = useState(false);
    const [ownerReady, setOwnerReady] = useState(false);
    const [guestReady, setGuestReady] = useState(false);

    useEffect(() => {
        const roomData = getRoom(code, token);
        setIsOwner(roomData.ownerId === user?.id);
        setOwnerReady(roomData.ownerReady);
        setGuestReady(roomData.guestReady);

    }, [code, token, user]);

    const handleFinishSetup = async () => {
        try {
            const result = await finishRoomSetup(code, token);
            alert(result.message);

            const roomData = await getRoom(code, token);
            setOwnerReady(roomData.ownerReady);
            setGuestReady(roomData.guestReady);

            if (result.winnerId) {
                alert(`Battle finished! Winner gets ${result.winnerCredits} credits!`);
                navigate('/home');
            }
        } catch (err) {
            alert(err.message);
        }
    };

    useEffect(() => {
        const loadPositions = async () => {
            if (!token) {
                return;
            }
            const data = await getPositions(code, token);

            if (data && data.length > 0) {
                const loadedUnits = units.map(unit => {
                    const saved = data.find(p => p.unitId === unit.id);

                    if (saved) {
                        return { ...unit, x: saved.x, y: saved.y };
                    }

                    return unit;
                });
                setUnits(loadedUnits);
            }
        };
        loadPositions();
    }, [code, token]);

    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: { distance: 5 }
    }));

    const leaveRoom = () => {
        let result;
        result = navigate("/home");

        return result;
    };

    const reset = async () => {
        let result;

        if (!token) {
            alert('You need to be logged in');
            result = false;

            return result;
        }

        const positionsToSave = DEFAULT_UNITS.map(({ id, x, y }) => ({
            unitId: id,
            x: Math.round(x),
            y: Math.round(y),
        }));

        await savePositions(code, positionsToSave, token);
        setUnits(DEFAULT_UNITS);
        result = true;

        return result;
    };

    const savePositionsToServer = async () => {
        let result;

        if (!token) {
            result = false;

            return result;
        }

        const positionsToSave = units.map(({ id, x, y }) => ({
            unitId: id,
            x: Math.round(x),
            y: Math.round(y),
        }));

        await savePositions(code, positionsToSave, token);
        result = true;

        return result;
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        let result;

        if (!over) {
            result = undefined;
            return result;
        }

        const unit = units.find(u => u.id === active.id);
        if (!unit) {
            result = undefined;

            return result;
        }

        const field = fields.find(f => f.id === over.id);
        if (!field) {
            result = undefined;

            return result;
        }

        if (unit.title !== field.title) {
            alert(`${unit.title} can only land on ${field.title} field`);
            result = undefined;

            return result;
        }

        const fieldElement = document.getElementById(over.id);
        if (!fieldElement) {
            result = undefined;

            return result;
        }

        const fieldRect = fieldElement.getBoundingClientRect();
        const translatedRect = active.rect.current.translated || active.rect.current.initial;

        if (!translatedRect) {
            result = undefined;

            return result;
        }

        const position = getDropPosition(translatedRect, fieldRect);

        if (!position) {
            result = undefined;

            return result;
        }

        const updatedUnits = units.map((u) => {
            let updatedUnit;

            if (u.id === active.id) {
                updatedUnit = { ...u, x: position.x, y: position.y };
            } else {
                updatedUnit = u;
            }

            return updatedUnit;
        });

        setUnits(updatedUnits);
        result = updatedUnits;

        return result;
    };

    return {
        code,
        units,
        fields,
        reset,
        savePositions: savePositionsToServer,
        leaveRoom,
        handleDragEnd,
        sensors,
        isOwner,
        ownerReady,
        guestReady,
        finishSetup: handleFinishSetup,
    };
}