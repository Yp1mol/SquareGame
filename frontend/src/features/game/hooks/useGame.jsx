import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPositions, savePositions, getRoom, finishRoomSetup } from "../../../services/api";
import { useAuth } from "../../auth/authContext";

const UNITS = {
    ATTACK: "attack",
    PROTECT: "protect",
};

export function useGame() {
    const { code } = useParams();
    const navigate = useNavigate();
    const { token, user } = useAuth();

    const [attackCells, setAttackCells] = useState([]);
    const [protectCells, setProtectCells] = useState([]);
    const [isOwner, setIsOwner] = useState(false);
    const [ownerReady, setOwnerReady] = useState(false);
    const [guestReady, setGuestReady] = useState(false);

    useEffect(() => {
        const loadRoom = async () => {
            if (!token || !code) {
                return;
            }

            const roomData = await getRoom(code, token);
            const currentUserId = String(user.id);
            const roomOwnerId = String(roomData.ownerId);
            const roomGuestId = String(roomData.guestId);

            if (roomOwnerId !== currentUserId && roomGuestId !== currentUserId) {
                navigate("/home");
                return;
            }

            if (roomData.statusId >= 10) {
                navigate("/home");
                return;
            }

            const isUserOwner = roomOwnerId === currentUserId;
            setIsOwner(isUserOwner);
            setOwnerReady(roomData.statusId === 2 || roomData.statusId === 5);
            setGuestReady(roomData.statusId === 3 || roomData.statusId === 5);
        };

        loadRoom();
    }, [code, token, user]);

    useEffect(() => {
        const loadPositions = async () => {
            if (!token || !code) return;

            try {
                const data = await getPositions(code, token);

                if (data && data.length > 0) {
                    const attack = data.find((p) => p.unitId === UNITS.ATTACK);
                    const protect = data.find((p) => p.unitId === UNITS.PROTECT);

                    setAttackCells(Array.isArray(attack?.cells) ? attack.cells : []);
                    setProtectCells(Array.isArray(protect?.cells) ? protect.cells : []);
                } else {
                    setAttackCells([]);
                    setProtectCells([]);
                }
            } catch (err) {
                console.error(err);
                setAttackCells([]);
                setProtectCells([]);
            }
        };

        const timeoutId = setTimeout(loadPositions, 50);
        return () => clearTimeout(timeoutId);
    }, [code, token]);

    const leaveRoom = () => {
        return navigate("/home");
    };

    const reset = async () => {
        setAttackCells([]);
        setProtectCells([]);

        await savePositions(
            code,
            [
                { unitId: UNITS.ATTACK, cells: [] },
                { unitId: UNITS.PROTECT, cells: [] },
            ],
            token
        );

        return true;
    };

    const savePositionsToServer = async () => {
        if (attackCells.length === 0 || protectCells.length === 0) {
            return false;
        }

        if (attackCells.length !== protectCells.length) {
            return { ok: false, reason: "mismatch" };
        }

        try {
            await savePositions(
                code,
                [
                    { unitId: UNITS.ATTACK, cells: attackCells },
                    { unitId: UNITS.PROTECT, cells: protectCells },
                ],
                token,
            );
            return { ok: true };
        } catch (err) {
            return { ok: false, reason: "server", error: err.message || "Failed to save positions" };
        }
    };
    
    const handleFinishSetup = async () => {
        try {
            const result = await finishRoomSetup(code, token);
            alert("Successfully finished room");

            if (isOwner) {
                setOwnerReady(true);
            } else {
                setGuestReady(true);
            }

            if (result.winnerId) {
                alert(`Battle finished! Winner gets ${result.winnerCredits} credits!`);
                navigate("/home");
            }
        } catch (err) {
            alert(err.message);
        }
    };

    return {
        code,
        leaveRoom,
        isOwner,
        ownerReady,
        guestReady,
        finishSetup: handleFinishSetup,
        attackCells,
        protectCells,
        setAttackCells,
        setProtectCells,
        reset,
        savePositions: savePositionsToServer,
    };
}