import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSensor, useSensors, PointerSensor, TouchSensor } from '@dnd-kit/core';
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

const VIRTUAL_BASE = 1000; 

const getDynamicDefaultUnits = () => {
    return [
        { id: UNITS.ATTACK, title: "ATTACK", color: "bg-red-600", x: 0, y: 0 },
        { id: UNITS.PROTECT, title: "PROTECT", color: "bg-blue-600", x: 0, y: 0 },
    ];
};

const getDropPosition = (translatedRect, fieldRect) => {
    if (!translatedRect || !fieldRect) {
        return null;
    }
    
    const squareSize = fieldRect.width * 0.3;
    const maxX = fieldRect.width - squareSize;
    const maxY = fieldRect.height - squareSize;

    let x = translatedRect.left - fieldRect.left;
    let y = translatedRect.top - fieldRect.top;

    if (x < 0 || y < 0 || x > maxX || y > maxY) {
        return null;
    }

    const normX = (x / fieldRect.width) * VIRTUAL_BASE;
    const normY = (y / fieldRect.height) * VIRTUAL_BASE;

    return { x: normX, y: normY };
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
    const [fieldDimensions, setFieldDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateDimensions = () => {
            const fieldElement = document.getElementById(FIELDS.ATTACK);

            if (fieldElement) {
                const rect = fieldElement.getBoundingClientRect();
                setFieldDimensions({ width: rect.width, height: rect.height });
            }
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    useEffect(() => {
        const loadRoom = async () => {
            if (!token || !code) return;
            try {
                const roomData = await getRoom(code, token);

                if (roomData.ownerId !== user?.id && roomData.guestId !== user?.id) {
                    alert('You are not a participant of this room');
                    navigate('/home');
                    return;
                }
                if (roomData.status === 'finished') {
                    alert('This battle is already over');
                    navigate('/home');
                    return;
                }
                if (roomData.status === 'draft' && roomData.ownerId !== user?.id) {
                    alert('Room is not ready yet');
                    navigate('/home');
                    return;
                }

                setIsOwner(roomData.ownerId === user?.id);
                setOwnerReady(roomData.ownerReady);
                setGuestReady(roomData.guestReady);
            } catch (err) {
                console.error(err);
                alert('Room not found or unavailable');
                navigate('/home');
            }
        };
        loadRoom();
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
            const defaultUnits = getDynamicDefaultUnits();

            if (data && data.length > 0) {
                const loadedUnits = defaultUnits.map(unit => {
                    const saved = data.find(p => p.unitId === unit.id);
                    if (saved) {
                        return { ...unit, x: saved.x, y: saved.y };
                    }
                    return unit;
                });
                setUnits(loadedUnits);
            } else {
                setUnits(defaultUnits);
            }
        };

        const timeoutId = setTimeout(loadPositions, 50);
        return () => clearTimeout(timeoutId);
    }, [code, token]);

    const sensors = useSensors(useSensor(PointerSensor, {
        activationConstraint: { distance: 5 }
    }), useSensor(TouchSensor, {
        activationConstraint: { distance: 5 }
    }));

    const leaveRoom = () => {
        return navigate("/home");
    };

    const reset = async () => {
        if (!token) {
            alert('You need to be logged in');
            return false;
        }

        const defaultUnits = getDynamicDefaultUnits();
        const positionsToSave = defaultUnits.map(({ id, x, y }) => ({
            unitId: id,
            x: Math.round(x),
            y: Math.round(y),
        }));

        await savePositions(code, positionsToSave, token);
        setUnits(defaultUnits);
        return true;
    };

    const savePositionsToServer = async () => {
    const defaults = getDynamicDefaultUnits();

    if (units.some((unit, i) =>
        Math.abs(unit.x - defaults[i].x) < 3 && Math.abs(unit.y - defaults[i].y) < 3
    )) {
        alert('Move both units to the game fields before saving');
        return false;
    }

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
            alert(`${unit.title} can only land on ${field.title} field`);
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

        if (!position) {
            return;
        }

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
        fieldDimensions
    };
}