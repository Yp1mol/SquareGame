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

const getDynamicDefaultUnits = () => {
    const deployZone = document.getElementById("deployment-zone");
    const attackField = document.getElementById(FIELDS.ATTACK);
    const protectField = document.getElementById(FIELDS.PROTECT);

    if (!deployZone || !attackField || !protectField) {
        return [
            { id: UNITS.ATTACK, title: "ATTACK", color: "bg-red-600", x: 0, y: 0 },
            { id: UNITS.PROTECT, title: "PROTECT", color: "bg-blue-600", x: 0, y: 0 },
        ];
    }

    const dRect = deployZone.getBoundingClientRect();
    const aRect = attackField.getBoundingClientRect();
    const pRect = protectField.getBoundingClientRect();

    const targetY = dRect.top + (dRect.height / 2) - 80;

    return [
        {
            id: UNITS.ATTACK,
            title: "ATTACK",
            color: "bg-red-600",
            x: (dRect.left + (dRect.width * 0.25)) - aRect.left - 80,
            y: targetY - aRect.top
        },
        {
            id: UNITS.PROTECT,
            title: "PROTECT",
            color: "bg-blue-600",
            x: (dRect.left + (dRect.width * 0.75)) - pRect.left - 80,
            y: targetY - pRect.top
        }
    ];
};

export function useGame() {
    const { code } = useParams();
    const navigate = useNavigate();
    const { token, user } = useAuth();
    const [fields] = useState([
        { id: FIELDS.ATTACK, title: "ATTACK", color: "bg-red-400 dark:bg-red-900", x: 0, y: 0 },
        { id: FIELDS.PROTECT, title: "PROTECT", color: "bg-blue-400 dark:bg-blue-900", x: 0, y: 0 },
    ]);
    const [units, setUnits] = useState([]);
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
            if (!token) return;
            
            const data = await getPositions(code, token);
            const dynamicDefaults = getDynamicDefaultUnits();

            if (data && data.length > 0) {
                const loadedUnits = dynamicDefaults.map(unit => {
                    const saved = data.find(p => p.unitId === unit.id);
                    if (saved) {
                        return { ...unit, x: saved.x, y: saved.y };
                    }
                    return unit;
                });
                setUnits(loadedUnits);
            } else {
                setUnits(dynamicDefaults);
            }
        };

        const timeoutId = setTimeout(loadPositions, 50);
        return () => clearTimeout(timeoutId);
    }, [code, token]);

    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: { distance: 5 }
    }));

    const leaveRoom = () => {
        let result = navigate("/home");
        return result;
    };

    const reset = async () => {
        if (!token) {
            alert('You need to be logged in');
            return false;
        }

        const dynamicDefaults = getDynamicDefaultUnits();

        const positionsToSave = dynamicDefaults.map(({ id, x, y }) => ({
            unitId: id,
            x: Math.round(x),
            y: Math.round(y),
        }));

        await savePositions(code, positionsToSave, token);
        setUnits(dynamicDefaults);
        return true;
    };

    const savePositionsToServer = async () => {
        if (!token) return false;

        const positionsToSave = units.map(({ id, x, y }) => ({
            unitId: id,
            x: Math.round(x),
            y: Math.round(y),
        }));

        await savePositions(code, positionsToSave, token);
        return true;
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (!over) return undefined;

        const unit = units.find(u => u.id === active.id);
        if (!unit) return undefined;

        const field = fields.find(f => f.id === over.id);
        if (!field) return undefined;

        if (unit.title !== field.title) {
            alert(`${unit.title} can only land on ${field.title} field`);
            return undefined;
        }

        const fieldElement = document.getElementById(over.id);
        if (!fieldElement) return undefined;

        const fieldRect = fieldElement.getBoundingClientRect();
        const translatedRect = active.rect.current.translated || active.rect.current.initial;

        if (!translatedRect) return undefined;

        const position = getDropPosition(translatedRect, fieldRect);

        if (!position) return undefined;

        const updatedUnits = units.map((u) => {
            if (u.id === active.id) {
                return { ...u, x: position.x, y: position.y };
            }
            return u;
        });

        setUnits(updatedUnits);
        return updatedUnits;
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