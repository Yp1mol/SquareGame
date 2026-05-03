import { useState, useEffect } from "react";
import { getBattleById } from "../../../services/api";
import { useAuth } from "../../auth/authContext";

export function useBattle(battleId) {
  const [battle, setBattle] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const loadBattle = async () => {
      if (!token || !battleId) {
        return;
      }
      const data = await getBattleById(battleId, token);
      setBattle(data);
    };
    loadBattle();
  }, [battleId, token]);

  return { battle };
}
